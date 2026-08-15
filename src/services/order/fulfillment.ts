import "server-only";
import { EbookImage, generateEbookPdf } from "@/lib/ebookPdf";
import { getImageProvider } from "@/services/image";
import { getOrderStore } from "@/services/order/orderStore";
import { Order } from "@/types/order";

/**
 * Falhar uma ilustração não pode derrubar o livro inteiro: a página sai só
 * com o texto e o restante do PDF continua sendo entregue.
 */
async function safely(work: Promise<EbookImage>): Promise<EbookImage | null> {
  try {
    return await work;
  } catch (error) {
    console.warn("[fulfillment] imagem falhou:", error);
    return null;
  }
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
    const { session, story } = order;

    // Capa e páginas em paralelo: é a etapa lenta e cara do processo.
    const [coverImage, ...pageImages] = await Promise.all([
      safely(provider.generateCover(session)),
      ...story.pages.map((_, index) => safely(provider.generatePage(session, index))),
    ]);

    const pdfBytes = await generateEbookPdf({
      title: story.title,
      intro: story.intro,
      childName: session.childName,
      coverImage,
      pages: story.pages.map((text, index) => ({ text, image: pageImages[index] ?? null })),
    });

    const ebookFile = await store.saveEbook(order.id, pdfBytes);
    return store.update(order.id, { status: "pronto", ebookFile, lastError: undefined });
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
