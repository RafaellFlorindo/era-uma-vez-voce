export interface PageTier {
  pages: number;
  /** Preço final e absoluto desse pacote. */
  price: number;
  /** Rótulo curto opcional exibido no card (ex: "Mais escolhido"). */
  badge?: string;
}

// Preço base de 6 páginas, subindo R$ 5,00 a cada faixa.
export const pageTiers: PageTier[] = [
  { pages: 6, price: 29.9 },
  { pages: 12, price: 34.9, badge: "Mais escolhido" },
  { pages: 18, price: 39.9 },
  { pages: 24, price: 44.9 },
];

export const DEFAULT_TIER_INDEX = 1;

export const offer = {
  productName: "Era Uma Vez Você",
  currency: "BRL",
  // TODO: substituir pela URL real do checkout quando a integração for feita.
  checkoutUrl: "",
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
