// Este arquivo contém os dados que serão utilizados no site

// Um array de strings, cada uma representa uma imagem de banner
const imagensBanner = [
  "//nerdarena.in/cdn/shop/files/Website-banner_figures.jpg?v=1657633477&width=1920",
  "//nerdarena.in/cdn/shop/files/anime-banner_9e3b230d-509e-4138-b41e-59ffd6668834.jpg?v=1726403936&width=1920",
  "//nerdarena.in/cdn/shop/files/zd-banner1.jpg?v=1725455222&width=1920",
];

function retornarObj() {
  return produtos;
}

// Um array de objetos, cada um representa um produto
const produtos = [
  {
    nome: "Produto 1",
    descricao: "Figura colecionável de alta qualidade, perfeita para fãs e colecionadores.",
    preco: "1.074,29",
    imagem: "https://m.media-amazon.com/images/I/71fXcn7CKhL._AC_SY679_.jpg",
    avaliacao: 5
  },
  {
    nome: "Produto 2",
    descricao: "Item decorativo com acabamento detalhado e ótimo para exibição.",
    preco: "78,90",
    imagem: "https://m.media-amazon.com/images/I/61cmFBiD5bS._AC_SX569_.jpg",
    avaliacao: 3.5
  },
  {
    nome: "Produto 3",
    descricao: "Peça estilizada com excelente fidelidade visual e pintura vibrante.",
    preco: "49,99",
    imagem: "https://m.media-amazon.com/images/I/817Da98Jh2L._AC_SX569_.jpg",
    avaliacao: 2.5
  },
  {
    nome: "Produto 4",
    descricao: "Figura articulada com grande atenção aos detalhes e pose dinâmica.",
    preco: "363,43",
    imagem: "https://m.media-amazon.com/images/I/61uNJcZckBL._AC_SX679_.jpg",
    avaliacao: 4
  },
  {
    nome: "Produto 5",
    descricao: "Modelo colecionável ideal para montar cenários e vitrines temáticas.",
    preco: "862,84",
    imagem: "https://m.media-amazon.com/images/I/61VVx6Jd-VL._AC_SY550_.jpg",
    avaliacao: 3
  },
  {
    nome: "Produto 6",
    descricao: "Edição especial para colecionadores exigentes, com acabamento premium.",
    preco: "2.543,76",
    imagem: "https://m.media-amazon.com/images/I/51e2BrwuBuL._AC_SL1085_.jpg",
    avaliacao: 5
  },
  {
    nome: "Produto 7",
    descricao: "Produto de coleção com design marcante e base inclusa.",
    preco: "1.027,30",
    imagem: "https://m.media-amazon.com/images/I/61af3K9DAbL._AC_SX569_.jpg",
    avaliacao: 4.5
  },
  {
    nome: "Produto 8",
    descricao: "Figura altamente detalhada, ideal para compor prateleiras temáticas.",
    preco: "1.234,88",
    imagem: "https://m.media-amazon.com/images/I/71ggIzSvwDL._AC_SY550_.jpg",
    avaliacao: 4.5
  },
  {
    nome: "Produto 9",
    descricao: "Modelo colecionável com pintura resistente e base de apoio.",
    preco: "1.397,15",
    imagem: "https://m.media-amazon.com/images/I/71W5gZxoImL._AC_SX679_.jpg",
    avaliacao: 4.5
  },
  {
    nome: "Produto 10",
    descricao: "Estátua em miniatura com acabamento refinado e ótimo para presentes.",
    preco: "723,06",
    imagem: "https://m.media-amazon.com/images/I/61sEqZdWzgL._AC_SY606_.jpg",
    avaliacao: 4.5
  },
  {
    nome: "Produto 11",
    descricao: "Item exclusivo de coleção com design moderno e estilizado.",
    preco: "627,79",
    imagem: "https://m.media-amazon.com/images/I/51vj7tftiaL._AC_SY450_.jpg",
    avaliacao: 4.5
  },
  {
    nome: "Produto 12",
    descricao: "Peça decorativa feita para fãs que valorizam autenticidade.",
    preco: "3.188,53",
    imagem: "https://m.media-amazon.com/images/I/61NYqh68P8L._AC_SX569_.jpg",
    avaliacao: 4.5
  },
  {
    nome: "Produto 13",
    descricao: "Figura com ótimo nível de detalhe e ideal para coleções temáticas.",
    preco: "3.224,50",
    imagem: "https://m.media-amazon.com/images/I/61oTvyZTyHL._AC_SX466_.jpg",
    avaliacao: 5
  },
  {
    nome: "Produto 14",
    descricao: "Item de decoração colecionável com visual impactante e durável.",
    preco: "1.058,89",
    imagem: "https://m.media-amazon.com/images/I/61NEEkkPavL._AC_SX466_.jpg",
    avaliacao: 4.5
  },
  {
    nome: "Produto 15",
    descricao: "Modelo ideal para vitrines geek, com ótimo acabamento visual.",
    preco: "913,98",
    imagem: "https://m.media-amazon.com/images/I/61LF90FQ1kL._AC_SY879_.jpg",
    avaliacao: 4.5
  },
  {
    nome: "Produto 16",
    descricao: "Figura em escala reduzida com excelente presença em estantes.",
    preco: "794,62",
    imagem: "https://m.media-amazon.com/images/I/61s8XIbG1zL._AC_SY550_.jpg",
    avaliacao: 4.5
  },
  {
    nome: "Produto 17",
    descricao: "Produto versátil com boa mobilidade e base de exibição inclusa.",
    preco: "661,54",
    imagem: "https://m.media-amazon.com/images/I/51vCTZRij4L._AC_SX569_.jpg",
    avaliacao: 4.5
  },
  {
    nome: "Produto 18",
    descricao: "Peça de coleção detalhada com acabamento sólido e realista.",
    preco: "599,99",
    imagem: "https://lojalimitededition.vteximg.com.br/arquivos/ids/412762-1000-1000/image-f7352b18199542a0bae6fd32871b821a.jpg?v=638203826758330000",
    avaliacao: 4.5
  },
  {
    nome: "Darth Maul (MMS748)",
    descricao: "Figura com ótimo nível de detalhe e ideal para coleções temáticas de Star Wars.",
    preco: "3511,90",
    imagem: "https://actionfigurebrasil.com.br/cdn/shop/files/darth-maul_star-wars_gallery_6635113ac82c3.jpg?v=1750440943",
    avaliacao: 5
  },
  {
    nome: "Fennec Shand (TMS068)",
    descricao: "Figura com ótimo nível de detalhe e ideal para coleções temáticas de Star Wars.",
    preco: "2393,00",
    imagem: "https://actionfigurebrasil.com.br/cdn/shop/files/fennec-shand_star-wars_gallery_61c29413cce58.jpg?v=1750440966",
    avaliacao: 5
  },
  {
    nome: "Nicepool (Pré-venda) (MMS788)",
    descricao: "Figura com ótimo nível de detalhe e ideal para coleções temáticas de Deadpool & Wolverine.",
    preco: "2866,00",
    imagem: "https://actionfigurebrasil.com.br/cdn/shop/files/hot-toys-marvel-nicepool-sixth-scale-figure-gallery-6776bda0d62f9.jpg?v=1750440996",
    avaliacao: 5
  },
  {
    nome: "Blade (Pré-venda) (MMS791)",
    descricao: "Figura com ótimo nível de detalhe e ideal para coleções temáticas de Marvel.",
    preco: "2794,90",
    imagem: "https://actionfigurebrasil.com.br/cdn/shop/files/hot-toys-marvel-blade-sixth-scale-figure-gallery-67a23dbda070e.jpg?v=1750441023",
    avaliacao: 5
  },
  {
    nome: "Batman (Deluxe Version) (Pré-venda) (MMS770)",
    descricao: "Figura com ótimo nível de detalhe e ideal para coleções temáticas de DC Comics.",
    preco: "3167,00",
    imagem: "https://actionfigurebrasil.com.br/cdn/shop/files/batman-deluxe-version_dc-comics_gallery_66ed91fe3cc04.jpg?v=1750441052",
    avaliacao: 5
  },
  {
    nome: "POP! Justice League Superman",
    descricao: "Figura com ótimo nível de detalhe e ideal para coleções temáticas de DC Comics.",
    preco: "521,88",
    imagem: "https://actionfigurebrasil.com.br/cdn/shop/files/602155538m.jpg?v=1748399725",
    avaliacao: 5
  },
  {
    nome: "POP! Hellboy Rasputin",
    descricao: "Figura com ótimo nível de detalhe e ideal para coleções temáticas de Hellboy.",
    preco: "532,88",
    imagem: "https://actionfigurebrasil.com.br/cdn/shop/files/602158857m.jpg?v=1748399716",
    avaliacao: 5
  },
  {
    nome: "Five Star Harry Potter Ron Weasley",
    descricao: "Figura com ótimo nível de detalhe e ideal para coleções temáticas de Harry Potter.",
    preco: "763,00",
    imagem: "https://actionfigurebrasil.com.br/cdn/shop/files/602167422m.jpg?v=1747306583",
    avaliacao: 5
  },
  {
    nome: "Five Star Harry Potter Harry Potter",
    descricao: "Figura com ótimo nível de detalhe e ideal para coleções temáticas de Harry Potter.",
    preco: "465,00",
    imagem: "https://actionfigurebrasil.com.br/cdn/shop/files/602167421m.jpg?v=1747306581",
    avaliacao: 5
  },
  {
    nome: "Vynl. Marvel Comics Deadpool & Cable",
    descricao: "Figura com ótimo nível de detalhe e ideal para coleções temáticas de Marvel Comics.",
    preco: "8,00",
    imagem: "https://actionfigurebrasil.com.br/cdn/shop/files/FIGURE-039584_01.jpg?v=1748918571",
    avaliacao: 5
  }
];
