import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderStore } from "@/services/order/orderStore";
import { toPublicView } from "@/types/order";
import { MyBookView } from "@/app/meu-livro/[token]/MyBookView";

export const dynamic = "force-dynamic";

// Página com o livro de uma criança específica: nunca deve ser indexada.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "O livro do seu filho | Era Uma Vez Você",
};

export default async function MyBookPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const order = await getOrderStore().findByToken(token);
  if (!order) notFound();

  return <MyBookView initial={toPublicView(order)} />;
}
