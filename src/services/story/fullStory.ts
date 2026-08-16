import "server-only";
import { generateFullStoryText } from "@/lib/gemini";
import { OrderStory } from "@/types/order";
import { StorySession } from "@/types/story";

/**
 * Continuações usadas quando a Gemini não está disponível.
 *
 * Não substituem a IA: existem para que o livro entregue tenha o número de
 * páginas que foi cobrado mesmo se a geração de texto falhar. Um livro
 * curto demais é uma cobrança indevida; um livro com texto mais simples é
 * um problema de qualidade, que é menos grave.
 */
const FALLBACK_BEATS = [
  "{name} respirou fundo e seguiu em frente, com o coração batendo forte de tanta curiosidade.",
  "No caminho, {name} encontrou uma pista que ninguém tinha percebido antes, pequena e brilhante.",
  "Foi preciso coragem para continuar, e coragem era justamente o que não faltava em {name}.",
  "Cada passo revelava uma parte nova daquele lugar, como se o mundo estivesse se abrindo só para {name}.",
  "{name} parou para ajudar um amigo pelo caminho, e descobriu que ajudar deixava a aventura ainda melhor.",
  "O céu mudou de cor devagar, e {name} entendeu que estava chegando perto do que procurava.",
  "Houve um momento de silêncio, daqueles em que tudo parece esperar, e {name} sorriu.",
  "Com muito cuidado, {name} resolveu o enigma que guardava a última passagem.",
  "Os amigos que {name} fez no caminho vieram juntos, todos lado a lado.",
  "{name} olhou para trás e viu o quanto tinha crescido naquela jornada tão curta.",
  "Ali estava, enfim, aquilo que {name} tinha vindo encontrar, e era ainda mais bonito do que imaginava.",
  "Na volta para casa, {name} levava no bolso uma lembrança daquele dia, para nunca esquecer.",
  "A noite chegou devagar, e {name} adormeceu com um sorriso, já sonhando com a próxima aventura.",
];

function fallbackPages(name: string, count: number, offset: number): string[] {
  return Array.from({ length: count }, (_, index) =>
    FALLBACK_BEATS[(offset + index) % FALLBACK_BEATS.length].replaceAll("{name}", name),
  );
}

/**
 * Leva a história ao tamanho que o cliente comprou.
 *
 * A prévia tem 3 páginas fixas, mas as faixas vendem 6, 12, 18 ou 24. Sem
 * este passo, quem paga por 24 páginas recebe as mesmas 3 de quem viu de
 * graça.
 */
export async function expandStoryToPurchasedLength(
  session: StorySession,
  story: OrderStory,
  targetPages: number,
): Promise<OrderStory> {
  if (story.pages.length >= targetPages) {
    return { ...story, pages: story.pages.slice(0, targetPages) };
  }

  const name = session.childName?.trim() || "Seu filho";

  try {
    const full = await generateFullStoryText(session, targetPages, story.pages);
    if (full.pages.length >= targetPages) {
      return { ...story, pages: full.pages.slice(0, targetPages) };
    }
    // Veio curto: completa o que faltou em vez de entregar menos.
    return {
      ...story,
      pages: [
        ...full.pages,
        ...fallbackPages(name, targetPages - full.pages.length, full.pages.length),
      ],
    };
  } catch (error) {
    console.warn("[fullStory] Gemini indisponível, usando continuação local:", error);
    return {
      ...story,
      pages: [
        ...story.pages,
        ...fallbackPages(name, targetPages - story.pages.length, story.pages.length),
      ],
    };
  }
}
