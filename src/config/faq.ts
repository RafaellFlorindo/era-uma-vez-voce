export interface FaqItem {
  question: string;
  answer: string;
}

// Conteúdo inicial — pode/deve ser refinado depois com base em dúvidas reais dos pais.
export const faqItems: FaqItem[] = [
  {
    question: "Meu filho realmente aparece na história?",
    answer:
      "Sim! Usamos o nome, a idade, a personalidade e as características que você nos conta para criar um personagem inspirado no seu filho, que protagoniza toda a aventura.",
  },
  {
    question: "Posso escolher o tema da aventura?",
    answer:
      "Sim. Você escolhe entre universos como dinossauros, espaço, piratas, magia, animais e fundo do mar — o que fizer mais sentido para o seu filho.",
  },
  {
    question: "Funciona para qualquer criança?",
    answer:
      "A experiência foi pensada para crianças de aproximadamente 3 a 10 anos, mas cada história é adaptada às informações fornecidas pelos pais.",
  },
  {
    question: "Como eu recebo a história?",
    answer:
      "Você recebe acesso digital à história personalizada, com capa, ilustrações e capítulos, direto após a confirmação.",
  },
  {
    question: "Consigo ouvir a história em vez de só ler?",
    answer:
      "Sim, a história inclui narração em áudio para que seu filho possa ouvir a própria aventura quantas vezes quiser.",
  },
  {
    question: "Quanto tempo demora para ficar pronta?",
    answer:
      "O processo de criação é rápido — em poucos minutos você já pode ver a prévia personalizada da história do seu filho.",
  },
];
