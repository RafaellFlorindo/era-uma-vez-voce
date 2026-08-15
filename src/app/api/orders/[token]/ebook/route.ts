import { NextResponse } from "next/server";
import { getOrderStore } from "@/services/order/orderStore";
import { fulfillOrder } from "@/services/order/fulfillment";

function fileNameFor(childName: string): string {
  const slug =
    childName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "historia";
  return `${slug}-era-uma-vez-voce.pdf`;
}

/**
 * Entrega o PDF do livro. Este é o portão: só pedido pago passa.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const store = getOrderStore();
  const order = await store.findByToken(token);

  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  }

  if (order.status === "aguardando_pagamento") {
    return NextResponse.json(
      { error: "Pagamento ainda não confirmado." },
      { status: 402 },
    );
  }

  if (order.status === "reembolsado") {
    return NextResponse.json({ error: "Este pedido foi reembolsado." }, { status: 403 });
  }

  // Pago mas ainda sem arquivo (webhook caiu no meio da geração, ou a
  // geração falhou): gera agora, para o comprador não ficar sem o livro
  // que ele já pagou.
  let ready = order;
  if (!order.ebookFile) {
    try {
      ready = await fulfillOrder(order.id);
    } catch {
      return NextResponse.json(
        { error: "Não foi possível gerar o livro agora. Tente de novo em instantes." },
        { status: 503 },
      );
    }
  }

  if (!ready.ebookFile) {
    return NextResponse.json({ error: "Livro indisponível." }, { status: 503 });
  }

  const bytes = await store.readEbook(ready.ebookFile);

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileNameFor(ready.session.childName)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
