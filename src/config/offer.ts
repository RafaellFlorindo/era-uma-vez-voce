export interface PageTier {
  pages: number;
  /** Preço adicional sobre o `price` base. 0 = já incluído no preço base. */
  extraPrice: number;
  /** Quanto o combo economiza comparado a comprar os blocos extras separadamente. */
  savings?: number;
}

export const pageTiers: PageTier[] = [
  { pages: 6, extraPrice: 0 },
  { pages: 12, extraPrice: 19.9 },
  { pages: 18, extraPrice: 34.9, savings: 4.9 },
  { pages: 24, extraPrice: 44.9, savings: 14.9 },
];

export const offer = {
  productName: "Era Uma Vez Você",
  price: 47,
  compareAtPrice: 97,
  currency: "BRL",
  // TODO: substituir pela URL real do checkout quando a integração for feita.
  checkoutUrl: "",
  features: [
    "História completamente personalizada",
    "Personagem inspirado nele(a)",
    "Capa exclusiva",
    "Diversas ilustrações",
    "Vários capítulos",
    "Versão digital para ler quando quiser",
    "Narração completa da história",
    "Acesso para ouvir quantas vezes quiser",
  ],
};

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
