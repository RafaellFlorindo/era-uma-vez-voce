/**
 * Livro de exemplo mostrado na seção de demonstração da página de vendas.
 *
 * É sempre o mesmo livro (o "Gabriel"), fixo para todo visitante: serve de
 * amostra do que o produto entrega, não é gerado na hora. Para trocar as
 * artes, basta salvar os arquivos nos caminhos abaixo dentro de `public/`.
 * Enquanto um arquivo não existir, a página mostra um placeholder no lugar.
 */
export const demoBook = {
  childName: "Gabriel",
  title: "Gabriel e a Jornada no Vale dos Dinossauros",

  /** Arquivo único de narração. Salvar em: public/demo/narracao-gabriel.mp3 */
  audioUrl: "/demo/narracao-gabriel.mp3",

  cover: {
    imageUrl: "/demo/capa.png",
    alt: "Capa do livro de exemplo do Gabriel",
  },

  pages: [
    {
      imageUrl: "/demo/pagina-1.png",
      text: "Naquela manhã, Gabriel ainda não sabia que estava prestes a encontrar algo que nenhuma outra criança havia visto antes.",
    },
    {
      imageUrl: "/demo/pagina-2.png",
      text: "Ele seguiu as pegadas com cuidado, até chegar a uma clareira onde um dinossauro gigante dormia tranquilo.",
    },
    {
      imageUrl: "/demo/pagina-3.png",
      text: "Foi ali que Gabriel entendeu: aquele vale guardava um segredo, e só um coração corajoso como o dele conseguiria descobrir.",
    },
  ],
};
