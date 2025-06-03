const vitrine = document.getElementById("vitrine");
const maxCaracteres = 40;
const btnEsquerda = document.querySelector(".seta.esquerda");
const btnDireita = document.querySelector(".seta.direita");
let carrinho = [];

// === FUNÇÃO: Renderizar produtos na vitrine ===
function renderizarVitrine() {
    produtos.forEach((produto, index) => {
        const div = document.createElement("div");
        div.className = "produto";
        div.id = `produto-${index + 1}`;

        const img = document.createElement("img");
        img.src = produto.imagem;
        img.alt = produto.nome;

        const titulo = document.createElement("h2");
        const nomeCurto = produto.nome.length >= maxCaracteres
            ? produto.nome.substring(0, maxCaracteres) + "..."
            : produto.nome;
        titulo.textContent = nomeCurto;

        const precoNumerico = parseFloat(produto.preco.replace(/\./g, "").replace(",", "."));
        const preco = document.createElement("h3");
        const precoFormatado = precoNumerico.toFixed(2).replace(".", ",");
        preco.textContent = "R$ " + precoFormatado;

        const estrelas = document.createElement("div");
        estrelas.className = "estrelas";
        const rating = produto.avaliacao || 4;
        const estrelasCheias = Math.floor(rating);
        const temMeiaEstrela = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            const estrela = document.createElement("span");
            if (i <= estrelasCheias) estrela.innerHTML = "★";
            else if (i === estrelasCheias + 1 && temMeiaEstrela) estrela.innerHTML = "⯨";
            else estrela.innerHTML = "☆";
            estrelas.appendChild(estrela);
        }

        const precoParcelado = document.createElement("p");
        let parcelas = 12;
        while (parcelas > 1 && (precoNumerico / parcelas) < 10) parcelas--;

        const botaoCarrinho = document.createElement("button");
        botaoCarrinho.textContent = "Adicionar ao carrinho";
        botaoCarrinho.className = "botao-carrinho";
        botaoCarrinho.addEventListener("click", () => {
            carrinho.push(produto);
            botaoCarrinho.textContent = "Cancelar";
            botaoCarrinho.classList.add("carrinho-ativo");
        });

        div.appendChild(img);
        div.appendChild(titulo);
        div.appendChild(estrelas);
        if (precoNumerico >= 50 && parcelas > 1) {
            const valorParcela = (precoNumerico / parcelas).toFixed(2).replace(".", ",");
            precoParcelado.textContent = `ou ${parcelas}x de R$ ${valorParcela} sem juros`;
            div.appendChild(precoParcelado);
        }
        div.appendChild(preco);
        div.appendChild(botaoCarrinho);
        vitrine.appendChild(div);
    });
}

// === SCROLL DAS SETAS ===
btnEsquerda.addEventListener("click", () => {
    vitrine.scrollBy({ left: -500, behavior: "smooth" });
});

btnDireita.addEventListener("click", () => {
    vitrine.scrollBy({ left: 500, behavior: "smooth" });
});

function iniciarCarrossel() {
  const carouselInner = document.getElementById("carousel-inner");
  const carouselDots = document.getElementById("carousel-dots");

  imagensBanner.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Banner ${index + 1}`;
    carouselInner.appendChild(img);

    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      mudarSlide(index);
    });
    carouselDots.appendChild(dot);
  });

  let slideAtual = 0;
  const totalSlides = imagensBanner.length;

  function mudarSlide(index) {
    slideAtual = index;
    carouselInner.style.transform = `translateX(-${index * 300 / totalSlides}%)`;
    document.querySelectorAll(".carousel-dots span").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  setInterval(() => {
    slideAtual = (slideAtual + 1) % totalSlides;
    mudarSlide(slideAtual);
  }, 5000); // Troca a cada 5 segundos
}

// === INICIALIZAÇÃO ===
document.addEventListener("DOMContentLoaded", () => {
    renderizarVitrine();
    iniciarCarrossel();
});