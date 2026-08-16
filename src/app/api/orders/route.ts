import { NextRequest, NextResponse } from "next/server";
import { getOrderStore, newOrderId, newOrderToken } from "@/services/order/orderStore";
import { caktoCheckoutUrl, pageTiers } from "@/config/offer";
import { Order, OrderStory } from "@/types/order";
import { StorySession } from "@/types/story";

interface CreateOrderBody {
  session: StorySession;
  story: OrderStory;
  /** Quantidade de páginas escolhida, usada para achar a faixa/oferta. */
  pages: number;
  utm?: Record<string, string>;
}

function isValidStory(story: OrderStory | undefined): story is OrderStory {
  return Boolean(story?.title && story?.intro && Array.isArray(story?.pages) && story.pages.length > 0);
}

/**
 * Cria o pedido ANTES de mandar o visitante para o checkout.
 *
 * Esse é o passo que faltava no fluxo: sem ele, tudo que os pais
 * preencheram fica só no localStorage do navegador e o pagamento chega
 * na Cakto sem nenhuma ligação com a história que foi montada.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateOrderBody;

    if (!body.session?.childName?.trim()) {
      return NextResponse.json({ error: "Nome da criança é obrigatório." }, { status: 400 });
    }
    if (!isValidStory(body.story)) {
      return NextResponse.json({ error: "História da prévia ausente." }, { status: 400 });
    }

    const tier = pageTiers.find((t) => t.pages === body.pages) ?? pageTiers[1];

    const now = new Date().toISOString();
    const order: Order = {
      id: newOrderId(),
      token: newOrderToken(),
      status: "aguardando_pagamento",
      session: body.session,
      story: body.story,
      tier: { pages: tier.pages, price: tier.price, offerId: tier.offerId },
      utm: body.utm,
      createdAt: now,
      updatedAt: now,
    };

    await getOrderStore().create(order);

    // `ref` volta no webhook da Cakto e é o que liga pagamento a pedido.
    const checkoutUrl = `${caktoCheckoutUrl(tier.offerId)}?ref=${encodeURIComponent(order.id)}`;

    return NextResponse.json({ token: order.token, checkoutUrl });
  } catch (error) {
    console.error("[api/orders]", error);
    return NextResponse.json({ error: "Erro ao criar o pedido." }, { status: 500 });
  }
}
