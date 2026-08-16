export interface Testimonial {
  /** Foto da mãe/pai ou da criança com o livro. Salvar em public/depoimentos/ */
  photoUrl: string;
  quote: string;
  authorName: string;
  /** Ex: "mãe do Gabriel, 6 anos" */
  authorContext: string;
}

export const testimonials: Testimonial[] = [
  {
    photoUrl: "/depoimentos/depoimento-1.jpg",
    quote:
      "Na hora que ele percebeu que era o personagem da história, abriu um sorrisão e falou: 'Pai, esse sou eu!'. Depois quis mostrar cada página pra todo mundo. Foi muito legal ver ele se sentindo parte da aventura.",
    authorName: "Lucas",
    authorContext: "pai do Bernardo, 5 anos",
  },
  {
    photoUrl: "/depoimentos/depoimento-2.jpg",
    quote:
      "O que mais me surpreendeu foi o quanto ela entrou na história. Ela comentava cada cena como se realmente estivesse vivendo aquela aventura.",
    authorName: "Fernanda",
    authorContext: "mãe da Alice, 8 anos",
  },
  {
    photoUrl: "/depoimentos/depoimento-3.jpg",
    quote:
      "Eu achei que ele ia gostar, mas não imaginei que seria tanto. Mostrou o livro pra avó, pro pai, pros primos, dizendo pra todo mundo que ele tinha virado personagem.",
    authorName: "Larissa",
    authorContext: "mãe do Pedro, 9 anos",
  },
];
