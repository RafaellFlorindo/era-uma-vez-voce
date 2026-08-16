import "server-only";
import { EbookImage, generateEbookPdf } from "@/lib/ebookPdf";
import { getImageProvider } from "@/services/image";
import { getOrderStore } from "@/services/order/orderStore";
import { expandStoryToPurchasedLength } from "@/services/story/fullStory";
import { Order } from "@/types/order";

/**
 * Falhar uma ilustração não pode derrubar o livro inteiro: a página sai só
 * com o texto e o restante do PDF continua sendo entregue.
 */
async function safely(work: () => Promise<EbookImage>): Promise<EbookImage | null> {
  try {
    return await work();
  } catch (error) {
    console.warn("[fulfillment] imagem falhou:", error);
    return null;
  }
}

/**
 * Executa as tarefas respeitando o teto de paralelismo do provedor.
 *
 * Preserva a ordem do resultado: a posição 0 é a capa e as seguintes são
 * as páginas, e trocar isso embaralharia as ilustrações do livro.
 */
async function runPooled<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results = new Array<T>(tasks.length);
  let next = 0;

  async function worker() {
    while (next < tasks.length) {
      const index = next++;
      results[index] = await tasks[index]();
    }
  }

  await Promise.all(
    Array.from({ length: Math.max(1, Math.min(limit, tasks.length)) }, worker),
  );

  return results;
}

/**
 * Gera o PDF de um pedido pago e o guarda no store.
 *
 * É idempotente por status: se o livro já está pronto, não gera de novo
 * (o webhook pode chegar duas vezes, e gerar de novo custaria dinheiro de
 * API à toa).
 */
export async function fulfillOrder(orderId: string): Promise<Order> {
  const store = getOrderStore();
  const order = await store.findById(orderId);
  if (!order) throw new Error(`Pedido ${orderId} não encontrado.`);

  if (order.status === "pronto" && order.ebookFile) return order;
  if (order.status === "aguardando_pagamento") {
    throw new Error(`Pedido ${orderId} ainda não foi pago.`);
  }

  try {
    const provider = getImageProvider();
    const { session } = order;

    // A prévia tem 3 páginas; a compra pode ser de 6, 12, 18 ou 24.
    // Escrever o resto aqui é o que faz o cliente receber o que pagou.
    const story = await expandStoryToPurchasedLength(session, order.story, order.tier.pages);

    // Etapa lenta do processo. Paraleliza até onde o provedor aguenta:
    // no gratuito isso é uma por vez, no pago é o livro todo de uma vez.
    const [coverImage, ...pageImages] = await runPooled<EbookImage | null>(
      [
        () => safely(() => provider.generateCover(session)),
        ...story.pages.map(
          (_, index) => () => safely(() => provider.generatePage(session, index)),
        ),
      ],
      provider.maxConcurrency,
    );

    const pdfBytes = await generateEbookPdf({
      title: story.title,
      intro: story.intro,
      childName: session.childName,
      coverImage,
      pages: story.pages.map((text, index) => ({ text, image: pageImages[index] ?? null })),
    });

    const ebookFile = await store.saveEbook(order.id, pdfBytes);
    // Grava a história completa: se o livro precisar ser gerado de novo,
    // tem que sair idêntico ao que o cliente já leu.
    return store.update(order.id, { status: "pronto", story, ebookFile, lastError: undefined });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[fulfillment] geração falhou:", message);
    // O pagamento continua válido — só a geração falhou. Marcar como
    // "falhou" deixa a página do comprador oferecer nova tentativa em vez
    // de girar num "gerando..." eterno.
    await store.update(order.id, { status: "falhou", lastError: message });
    throw error;
  }
}
