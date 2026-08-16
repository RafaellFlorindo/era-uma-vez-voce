export interface Testimonial {
  /** Foto da mãe/pai ou da criança com o livro. Salvar em public/depoimentos/ */
  photoUrl: string;
  quote: string;
  authorName: string;
  /** Ex: "mãe do Gabriel, 6 anos" */
  authorContext: string;
}

/**
 * PLACEHOLDER: nada aqui é depoimento real.
 *
 * Substituir por depoimentos verdadeiros de clientes antes de subir tráfego.
 * O texto entre colchetes deixa claro o que ainda falta preencher; as fotos
 * entram em public/depoimentos/ com os nomes abaixo.
 */
export const testimonials: Testimonial[] = [
  {
    photoUrl: "/depoimentos/depoimento-1.jpg",
    quote: "[Colar aqui o depoimento real, nas palavras dele.]",
    authorName: "[Nome]",
    authorContext: "[pai do ___, __ anos]",
  },
  {
    photoUrl: "/depoimentos/depoimento-2.jpg",
    quote: "[Colar aqui o depoimento real, nas palavras dela.]",
    authorName: "[Nome]",
    authorContext: "[mãe do ___, __ anos]",
  },
  {
    photoUrl: "/depoimentos/depoimento-3.jpg",
    quote: "[Colar aqui o depoimento real, nas palavras dela.]",
    authorName: "[Nome]",
    authorContext: "[mãe do ___, __ anos]",
  },
];
