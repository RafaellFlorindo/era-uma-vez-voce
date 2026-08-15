import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getOrderStore } from "@/services/order/orderStore";
import { fulfillOrder } from "@/services/order/fulfillment";
import { Order } from "@/types/order";

/**
 * Recebe a confirmação de pagamento da Cakto e libera o livro.
 *
 * ATENÇÃO — CONFERIR COM UM EVENTO REAL: os nomes de campo abaixo são a
 * leitura mais provável do payload da Cakto, mas não foram validados
 * contra um webhook de verdade. `normalizeEvent` concentra toda essa
 * incerteza num lugar só: quando o primeiro evento real chegar, o log
 * `[webhook/cakto] payload` mostra a forma exata e é só ajustar aqui.
 */

interface NormalizedEvent {
  transactionId: string;
  paid: boolean;
  refunded: boolean;
  /** Nosso `order.id`, se a Cakto devolveu o `ref` que mandamos na URL. */
  orderRef?: string;
  customerEmail?: string;
  customerName?: string;
}

type Json = Record<string, unknown>;

function pick(source: Json | undefined, ...keys: string[]): string | undefined {
  if (!source) return undefined;
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return undefined;
}

const PAID_STATUSES = new Set([
  "paid",
  "approved",
  "aprovado",
  "pago",
  "completed",
  "purchase_approved",
]);
const REFUNDED_STATUSES = new Set(["refunded", "reembolsado", "chargeback", "refund"]);

function normalizeEvent(body: Json): NormalizedEvent | null {
  const data = (body.data as Json | undefined) ?? body;

  const status = (pick(data, "status", "event", "type") ?? pick(body, "event", "type") ?? "")
    .toLowerCase();
  const transactionId = pick(data, "id", "transaction_id", "transactionId", "order_id", "reference");
  if (!transactionId) return null;

  const customer = (data.customer as Json | undefined) ?? (data.buyer as Json | undefined);

  return {
    transactionId,
    paid: PAID_STATUSES.has(status),
    refunded: REFUNDED_STATUSES.has(status),
    orderRef:
      pick(data, "ref", "external_reference", "externalReference", "utm_content") ??
      pick(body, "ref"),
    customerEmail: pick(customer, "email"),
    customerName: pick(customer, "name", "full_name"),
  };
}

/** Compara em tempo constante para não vazar o segredo por timing. */
function secretMatches(received: string | null, expected: string): boolean {
  if (!received) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function isAuthorized(request: NextRequest, body: Json): boolean {
  const expected = process.env.CAKTO_WEBHOOK_SECRET;

  // Sem segredo configurado a rota fica fechada. Um webhook de pagamento
  // aberto é um botão de "me dê o produto de graça" para qualquer um.
  if (!expected) {
    console.error("[webhook/cakto] CAKTO_WEBHOOK_SECRET não configurada — evento recusado.");
    return false;
  }

  const candidates = [
    request.headers.get("x-cakto-signature"),
    request.headers.get("x-webhook-secret"),
    request.nextUrl.searchParams.get("secret"),
    typeof body.secret === "string" ? body.secret : null,
  ];

  return candidates.some((candidate) => secretMatches(candidate, expected));
}

async function findOrder(event: NormalizedEvent): Promise<Order | null> {
  const store = getOrderStore();

  // 1. Já processamos este pagamento antes? (webhook repetido)
  const known = await store.findByTransactionId(event.transactionId);
  if (known) return known;

  // 2. Caminho normal: a Cakto devolveu o `ref` que mandamos na URL.
  if (event.orderRef) {
    const byRef = await store.findById(event.orderRef);
    if (byRef) return byRef;
  }

  // 3. Rede de segurança: casa pelo e-mail do comprador.
  if (event.customerEmail) return store.findByEmail(event.customerEmail);

  return null;
}

export async function POST(request: NextRequest) {
  let body: Json;
  try {
    body = (await request.json()) as Json;
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  if (!isAuthorized(request, body)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  // Log de forma (sem valores) para conferir os campos reais da Cakto sem
  // despejar dado pessoal do comprador no log.
  console.info("[webhook/cakto] payload keys:", Object.keys(body), Object.keys((body.data as Json) ?? {}));

  const event = normalizeEvent(body);
  if (!event) {
    return NextResponse.json({ error: "Evento sem identificador de transação." }, { status: 400 });
  }

  if (!event.paid && !event.refunded) {
    // Evento que não muda nada (pendente, carrinho abandonado, etc).
    return NextResponse.json({ ok: true, ignored: true });
  }

  const order = await findOrder(event);
  if (!order) {
    // 200 de propósito: se devolvêssemos erro, a Cakto ficaria reenviando
    // para sempre um evento que nunca vai casar. Fica registrado para
    // reconciliação manual.
    console.error("[webhook/cakto] pagamento sem pedido correspondente:", event.transactionId);
    return NextResponse.json({ ok: true, matched: false });
  }

  const store = getOrderStore();

  if (event.refunded) {
    await store.update(order.id, { status: "reembolsado" });
    return NextResponse.json({ ok: true, status: "reembolsado" });
  }

  // Idempotência: se já está pago, não regenera (geração custa dinheiro).
  if (order.status !== "aguardando_pagamento") {
    return NextResponse.json({ ok: true, status: order.status, duplicate: true });
  }

  await store.update(order.id, {
    status: "pago",
    customer: { name: event.customerName, email: event.customerEmail },
    payment: {
      provider: "cakto",
      transactionId: event.transactionId,
      paidAt: new Date().toISOString(),
    },
  });

  // Gera sem segurar a resposta: a Cakto espera 200 rápido, e a geração
  // leva dezenas de segundos. Se falhar, o pedido fica "falhou" e a página
  // do comprador oferece nova tentativa.
  void fulfillOrder(order.id).catch((error) => {
    console.error("[webhook/cakto] geração falhou:", error);
  });

  return NextResponse.json({ ok: true, status: "pago" });
}
