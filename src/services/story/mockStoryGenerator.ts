import { LivePreview, PersonalityTrait, StoryPreview, StorySession, ThemeId } from "@/types/story";

interface ThemeContent {
  label: string;
  titleTemplates: string[];
  worldDescription: string;
  scenes: string[];
  page2: string;
  page3: string;
}

const THEME_CONTENT: Record<ThemeId, ThemeContent> = {
  dinossauros: {
    label: "Dinossauros",
    titleTemplates: [
      "{name} e a Jornada no Vale dos Dinossauros",
      "{name} e o Ovo Perdido do Vale Esquecido",
    ],
    worldDescription: "um vale escondido cheio de dinossauros gigantes e amigáveis",
    scenes: [
      "uma pegada enorme na lama, ainda fresca",
      "um filhote de dinossauro perdido chorando baixinho",
      "uma trilha de folhas mordidas levando a uma caverna",
    ],
    page2:
      "{name} seguiu as pegadas com cuidado, até chegar a uma clareira onde um dinossauro gigante dormia. Ao acordar, ele não pareceu assustador, só curioso com aquele novo amiguinho.",
    page3:
      "Foi ali que {name} entendeu: aquele vale guardava um segredo havia muito tempo, e só um coração corajoso como o dele conseguiria descobri-lo.",
  },
  espaco: {
    label: "Espaço",
    titleTemplates: [
      "{name} e o Segredo das Estrelas",
      "{name} e a Viagem à Lua Cintilante",
    ],
    worldDescription: "uma galáxia distante cheia de planetas coloridos e estrelas cantantes",
    scenes: [
      "uma nave brilhante pousando silenciosamente no jardim",
      "um mapa estelar desenhado com poeira de estrelas",
      "um robozinho curioso piscando luzes em código",
    ],
    page2:
      "{name} entrou na nave sem pensar duas vezes. Lá dentro, milhares de botões brilhavam como estrelas, e um deles, bem no centro, parecia chamar seu nome.",
    page3:
      "Quando {name} apertou o botão, a nave decolou rumo a um planeta que nenhum mapa jamais havia registrado.",
  },
  piratas: {
    label: "Piratas",
    titleTemplates: [
      "{name} e o Tesouro da Ilha Perdida",
      "{name} e a Bússola Encantada dos Mares",
    ],
    worldDescription: "um mar azul-turquesa cheio de ilhas escondidas e tesouros enterrados",
    scenes: [
      "um mapa antigo com um X desenhado a tinta dourada",
      "uma garrafa balançando nas ondas com um bilhete dentro",
      "um papagaio falante pousando no mastro do navio",
    ],
    page2:
      "{name} desenrolou o mapa com cuidado. As linhas antigas desenhavam um caminho entre recifes e ilhas, e todas levavam ao mesmo X dourado.",
    page3:
      "Com a bússola em mãos, {name} soube que aquela seria a aventura mais emocionante de todas.",
  },
  magia: {
    label: "Magia",
    titleTemplates: [
      "{name} e o Livro Encantado da Floresta",
      "{name} e o Feitiço das Luzes Perdidas",
    ],
    worldDescription: "uma floresta encantada onde as árvores sussurram segredos antigos",
    scenes: [
      "uma varinha de madeira brilhando fracamente entre as folhas",
      "um portal de luz dourada se abrindo devagar",
      "pequenas luzes flutuantes formando um caminho no ar",
    ],
    page2:
      "{name} seguiu as luzinhas até um portal que brilhava entre duas árvores antigas. Do outro lado, um mundo inteiro parecia esperar por ele.",
    page3:
      "Foi então que {name} descobriu: a verdadeira magia daquele lugar despertava com coragem, e ele tinha de sobra.",
  },
  animais: {
    label: "Animais",
    titleTemplates: [
      "{name} e os Amigos da Floresta Encantada",
      "{name} e o Conselho dos Bichos Sábios",
    ],
    worldDescription: "uma floresta cheia de animais falantes e sabidos",
    scenes: [
      "uma coruja pousando gentilmente no galho mais baixo",
      "uma trilha de pegadas de raposa levando a uma clareira",
      "um coelho apressado carregando um embrulho misterioso",
    ],
    page2:
      "{name} seguiu o coelho até um círculo de pedras onde os animais da floresta já se reuniam. Todos ficaram em silêncio quando perceberam que tinham visita.",
    page3:
      "Foi então que a coruja mais velha falou: apenas alguém especial poderia ajudá-los, e todos concordaram que {name} era exatamente quem procuravam.",
  },
  "fundo-do-mar": {
    label: "Fundo do Mar",
    titleTemplates: [
      "{name} e o Reino Escondido no Fundo do Mar",
      "{name} e a Pérola Mágica dos Corais",
    ],
    worldDescription: "um reino submerso cheio de corais coloridos e criaturas encantadas",
    scenes: [
      "uma concha brilhando com uma luz suave no fundo da areia",
      "um cardume de peixes formando um caminho colorido",
      "uma tartaruga antiga guardando um portão de corais",
    ],
    page2:
      "{name} nadou até a concha e a tocou de leve. Uma luz suave se espalhou pela água, revelando um caminho de corais que ninguém tinha visto antes.",
    page3:
      "A tartaruga abriu um olho e sorriu: fazia séculos que esperava alguém corajoso o bastante para atravessar aquele portão.",
  },
};

export interface ThemeVisual {
  label: string;
  /** Emoji do companheiro de aventura que "aparece" ao lado da criança na capa mockada. */
  companionEmoji: string;
  companionLabel: string;
  colorFrom: string;
  colorTo: string;
  /** Filtro CSS aplicado sobre a foto real para simular uma "ilustração". */
  filter: string;
}

export const THEME_VISUALS: Record<ThemeId, ThemeVisual> = {
  dinossauros: {
    label: "Dinossauros",
    companionEmoji: "🦕",
    companionLabel: "O Dinossauro Gentil",
    colorFrom: "#5fae82",
    colorTo: "#2f5f45",
    filter: "saturate(1.2) contrast(1.05) sepia(0.12)",
  },
  espaco: {
    label: "Espaço",
    companionEmoji: "👽",
    companionLabel: "O Alienígena Amigável",
    colorFrom: "#3f7d95",
    colorTo: "#15303d",
    filter: "saturate(1.15) contrast(1.1) brightness(0.97)",
  },
  piratas: {
    label: "Piratas",
    companionEmoji: "🦜",
    companionLabel: "O Papagaio Navegador",
    colorFrom: "#4fa3b9",
    colorTo: "#1d4655",
    filter: "sepia(0.2) saturate(1.15)",
  },
  magia: {
    label: "Magia",
    companionEmoji: "🧚",
    companionLabel: "A Fada da Floresta",
    colorFrom: "#a184c9",
    colorTo: "#4a3a6b",
    filter: "saturate(1.2) contrast(1.05)",
  },
  animais: {
    label: "Animais",
    companionEmoji: "🦊",
    companionLabel: "A Raposa Sábia",
    colorFrom: "#d1a15e",
    colorTo: "#8a5a2e",
    filter: "saturate(1.1) sepia(0.1)",
  },
  "fundo-do-mar": {
    label: "Fundo do Mar",
    companionEmoji: "🐢",
    companionLabel: "A Tartaruga Guardiã",
    colorFrom: "#4fa3b9",
    colorTo: "#144a5c",
    filter: "saturate(1.2) hue-rotate(-4deg)",
  },
};

export const VISUAL_STYLE_FILTERS: Record<string, string> = {
  "livro-3d": "contrast(1.1) saturate(1.15)",
  aquarela: "saturate(0.9) brightness(1.05) contrast(0.92)",
  "conto-classico": "sepia(0.35) contrast(0.95)",
  cartoon: "contrast(1.25) saturate(1.4)",
};

const PERSONALITY_OPENERS: Partial<Record<PersonalityTrait, string>> = {
  curioso: "ainda não sabia que estava prestes a encontrar algo que nenhuma outra criança havia visto antes",
  corajoso: "sentiu o coração bater forte, mas deu o primeiro passo sem hesitar",
  engracado: "já estava inventando uma piada para contar sobre o que veria a seguir",
  carinhoso: "pensou em como adoraria mostrar aquilo tudo para quem mais amava",
  aventureiro: "não conseguia mais esperar para descobrir o que vinha depois da próxima curva",
  criativo: "já imaginava mil formas diferentes de contar aquela história depois",
  inteligente: "começou a juntar as pistas, uma por uma, como quem monta um quebra-cabeça",
  timido: "respirou fundo, criou coragem e deu um passo à frente",
};

function pickTitle(theme: ThemeContent, name: string): string {
  const template = theme.titleTemplates[0];
  return template.replace("{name}", name);
}

function pickOpener(personality: PersonalityTrait[]): string {
  const trait = personality[0];
  return (trait && PERSONALITY_OPENERS[trait]) || "ainda não sabia que aquele dia mudaria tudo";
}

export function generateMockStoryPreview(session: StorySession): StoryPreview {
  const name = session.childName?.trim() || "Seu filho";
  const themeId = session.theme ?? "magia";
  const theme = THEME_CONTENT[themeId];
  const scene = theme.scenes[name.length % theme.scenes.length];
  const opener = pickOpener(session.personality);

  const title = pickTitle(theme, name);

  const intro = `A aventura de ${name} está prestes a começar em ${theme.worldDescription}.`;

  const page1 = `Naquela manhã, ${name} ${opener}. Tudo começou quando ${name} encontrou ${scene}, bem no meio do caminho, e soube, ali mesmo, que aquele não seria um dia comum.`;
  const page2 = theme.page2.replaceAll("{name}", name);
  const page3 = theme.page3.replaceAll("{name}", name);

  return {
    title,
    intro,
    coverUrl: `/covers/${themeId}.svg`,
    pages: [page1, page2, page3],
  };
}

/**
 * Prévia parcial usada durante o wizard: reflete apenas o que já foi
 * respondido, para dar a sensação de que o livro está sendo criado ao vivo.
 */
export function generateLivePreview(session: Partial<StorySession>): LivePreview {
  const name = session.childName?.trim();
  const themeId = session.theme;
  const theme = themeId ? THEME_CONTENT[themeId] : undefined;

  if (!name) {
    return {
      title: "A história do seu filho",
      coverUrl: "/covers/magia.svg",
      snippet: "Conte um pouco sobre ele para começarmos a criar a aventura...",
      ready: false,
    };
  }

  if (!theme) {
    return {
      title: `A história de ${name}`,
      coverUrl: "/covers/magia.svg",
      snippet: `${name} está prestes a virar personagem principal de uma aventura só sua...`,
      ready: false,
    };
  }

  const opener = pickOpener(session.personality ?? []);
  const title = pickTitle(theme, name);
  const snippet = `Naquela manhã, ${name} ${opener}...`;

  return {
    title,
    coverUrl: `/covers/${themeId}.svg`,
    snippet,
    ready: true,
  };
}
