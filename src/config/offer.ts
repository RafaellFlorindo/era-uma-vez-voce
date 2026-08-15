export interface PageTier {
  pages: number;
  /** Preço final e absoluto desse pacote. */
  price: number;
  /** Rótulo curto opcional exibido no card (ex: "Mais escolhido"). */
  badge?: string;
  /** Link de checkout da Cakto para essa oferta específica. */
  checkoutUrl: string;
}

// Preço base de 6 páginas, subindo R$ 5,00 a cada faixa.
// Produto e ofertas criados na Cakto (produto "Era Uma Vez Você",
// id 570d07bd-715d-4a20-9359-323b3a20034a).
export const pageTiers: PageTier[] = [
  { pages: 6, price: 29.9, checkoutUrl: "https://pay.cakto.com.br/u4k5xbk" },
  {
    pages: 12,
    price: 34.9,
    badge: "Mais escolhido",
    checkoutUrl: "https://pay.cakto.com.br/bts3r5t",
  },
  { pages: 18, price: 39.9, checkoutUrl: "https://pay.cakto.com.br/mhs6qrc" },
  { pages: 24, price: 44.9, checkoutUrl: "https://pay.cakto.com.br/9r4sba6" },
];

export const DEFAULT_TIER_INDEX = 1;

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
