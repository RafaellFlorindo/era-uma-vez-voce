import { NextResponse } from "next/server";
import { getOrderStore } from "@/services/order/orderStore";
import { toPublicView } from "@/types/order";

/**
 * Status do pedido para a página do comprador ficar consultando enquanto o
 * livro é gerado. Devolve só o recorte público: nunca a foto da criança nem
 * dados de pagamento.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const order = await getOrderStore().findByToken(token);
  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  }

  return NextResponse.json(toPublicView(order), {
    headers: { "Cache-Control": "no-store" },
  });
}
