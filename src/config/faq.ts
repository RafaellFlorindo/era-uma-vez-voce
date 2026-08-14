export interface FaqItem {
  question: string;
  answer: string;
}

// Conteúdo inicial. Refinar depois com base nas dúvidas reais que os pais
// mandarem no suporte e nos comentários dos anúncios.
export const faqItems: FaqItem[] = [
  {
    question: "Meu filho realmente aparece na história?",
    answer:
      "Sim. Ele é o protagonista do começo ao fim. Usamos o nome, a idade, a personalidade e a foto que você enviar para criar um personagem parecido com ele, que aparece nas ilustrações e conduz toda a aventura.",
  },
  {
    question: "É só o nome trocado dentro de uma história pronta?",
    answer:
      "Não. O texto é escrito do zero a partir das respostas que você dá. Mudando o mundo, o jeito da criança ou a idade, a história muda junto. Duas crianças nunca recebem o mesmo livro.",
  },
  {
    question: "Posso escolher o tema da aventura?",
    answer:
      "Sim. Você escolhe entre dinossauros, espaço, piratas, magia, animais e fundo do mar. É só marcar o que faz os olhos do seu filho brilharem.",
  },
  {
    question: "Funciona para qualquer criança?",
    answer:
      "A experiência foi pensada para crianças de 3 a 10 anos. Como cada história é montada em cima das informações que você dá, ela se adapta tanto ao menorzinho quanto ao que já lê sozinho.",
  },
  {
    question: "Como eu recebo o livro?",
    answer:
      "Você recebe o acesso digital logo depois da confirmação, com capa, ilustrações, capítulos e narração. Dá para ler no celular, no tablet ou no computador.",
  },
  {
    question: "Consigo ouvir a história em vez de só ler?",
    answer:
      "Sim. Todo livro vem com narração em áudio, então dá para colocar para tocar na hora de dormir mesmo nos dias em que você está exausta.",
  },
  {
    question: "Quanto tempo demora para ficar pronto?",
    answer:
      "A prévia aparece na hora, ainda enquanto você responde. O livro completo fica pronto logo em seguida, sem precisar esperar por entrega física.",
  },
  {
    question: "E se eu não gostar do resultado?",
    answer:
      "[Inserir aqui a política de garantia oficial: prazo, condições e como solicitar.]",
  },
];
