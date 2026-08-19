export interface PageTier {
  pages: number;
  /** Preço final e absoluto desse pacote. */
  price: number;
  /** Rótulo curto opcional exibido no card (ex: "Mais escolhido"). */
  badge?: string;
  /** ID da oferta na Cakto (o trecho final de pay.cakto.com.br/{offerId}). */
  offerId: string;
}

// Preço base de 6 páginas, subindo R$ 5,00 a cada faixa.
// Produto e ofertas criados na Cakto (produto "Era Uma Vez Você",
// id 570d07bd-715d-4a20-9359-323b3a20034a).
export const pageTiers: PageTier[] = [
  { pages: 6, price: 19.9, offerId: "mo6u7b6" },
  { pages: 12, price: 24.9, badge: "Mais escolhido", offerId: "d2ayuno" },
  { pages: 18, price: 29.9, offerId: "zqpdetg" },
  { pages: 24, price: 34.9, offerId: "gtwkmia" },
];

export function caktoCheckoutUrl(offerId: string): string {
  return `https://pay.cakto.com.br/${offerId}`;
}

export const DEFAULT_TIER_INDEX = 1;

/**
 * CONFIRMAR: o e-mail abaixo aparece publicamente na seção de garantia e é
 * o canal que o comprador vai usar para pedir reembolso. Trocar pelo e-mail
 * real de suporte antes de subir para produção.
 *
 * O prazo de 7 dias não é escolha de marketing: é o direito de
 * arrependimento do art. 49 do Código de Defesa do Consumidor para compras
 * fora do estabelecimento. Reduzi-lo não é possível.
 */
export const support = {
  email: "contato@erauamvezvoce.com.br", // TODO: trocar pelo e-mail real de suporte
  refundWindowDays: 7,
};

export const offer = {
  productName: "Era Uma Vez Você",
  currency: "BRL",
  features: [
    "História escrita do zero para o seu filho",
    "Personagem criado a partir da foto dele",
    "Capa com o nome dele no título",
    "Ilustrações originais em todas as páginas",
    "Narração em áudio para ouvir na hora de dormir",
    "Livro digital para ler e ouvir quantas vezes quiser",
    "Acesso imediato, sem esperar entrega",
  ],
};

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
