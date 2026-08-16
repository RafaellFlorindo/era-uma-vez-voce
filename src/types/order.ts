import { StorySession } from "@/types/story";

export type OrderStatus =
  /** Pedido criado, visitante foi mandado ao checkout e ainda não pagou. */
  | "aguardando_pagamento"
  /** Pagamento confirmado pelo provedor. O livro ainda pode estar sendo gerado. */
  | "pago"
  /** PDF gerado e disponível para download. */
  | "pronto"
  /** Geração falhou. O pagamento continua válido: dá para tentar de novo. */
  | "falhou"
  | "reembolsado";

export interface OrderStory {
  title: string;
  intro: string;
  pages: string[];
}

export interface Order {
  id: string;
  /**
   * Segredo que vai na URL do comprador (/meu-livro/{token}). Separado do
   * `id` de propósito: o `id` circula por checkout e webhook, o token não,
   * então vazar um não dá acesso ao livro do outro.
   */
  token: string;
  status: OrderStatus;

  /** Tudo que os pais preencheram no wizard, incluindo a foto em base64. */
  session: StorySession;
  /** Texto das 3 páginas da prévia, reaproveitado como início do livro. */
  story: OrderStory;

  tier: {
    pages: number;
    price: number;
    offerId: string;
  };

  /** Preenchido pelo webhook, quando o provedor informa quem pagou. */
  customer?: {
    name?: string;
    email?: string;
  };

  payment?: {
    provider: "cakto";
    /** Id da transação no provedor. Usado para não processar 2x o mesmo evento. */
    transactionId: string;
    paidAt: string;
  };

  /** Caminho do PDF já gerado, relativo à raiz do store. */
  ebookFile?: string;
  /** Mensagem do último erro de geração, para suporte conseguir diagnosticar. */
  lastError?: string;

  utm?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/** Recorte seguro para devolver ao navegador: sem foto, sem dados de pagamento. */
export interface OrderPublicView {
  token: string;
  status: OrderStatus;
  childName: string;
  title: string;
  pages: number;
  downloadReady: boolean;
}

export function toPublicView(order: Order): OrderPublicView {
  return {
    token: order.token,
    status: order.status,
    childName: order.session.childName,
    title: order.story.title,
    pages: order.tier.pages,
    downloadReady: order.status === "pronto" && Boolean(order.ebookFile),
  };
}
