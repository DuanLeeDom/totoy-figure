const vitrine = document.getElementById("vitrine");
const maxCaracteres = 40;
const btnEsquerda = document.querySelector(".seta.esquerda");
const btnDireita = document.querySelector(".seta.direita");

// === FUNÇÃO UTILITÁRIA: Resolver caminho da imagem ===
function CaminhoImagem(caminho) {
    if (caminho.startsWith("http") || caminho.startsWith("//")) {
        return caminho.startsWith("//") ? "https:" + caminho : caminho;
    } else {
        return "./img/" + caminho;
    }
}

// === FUNÇÕES DO CARRINHO ===
function obterCarrinho() {
    const carrinho = localStorage.getItem('carrinho');
    return carrinho ? JSON.parse(carrinho) : [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function adicionarAoCarrinho(produtoId) {
    const produto = produtos[produtoId];
    if (!produto) return;

    const carrinho = obterCarrinho();
    
    // Verificar se o produto já existe no carrinho
    const itemExistente = carrinho.find(item => item.id === produtoId);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: produtoId,
            nome: produto.nome,
            descricao: produto.descricao,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: 1
        });
    }
    
    salvarCarrinho(carrinho);
    atualizarBotaoCarrinho(produtoId, true);
    
    // Mostrar feedback visual
    // alert(`${produto.nome} foi adicionado ao carrinho!`);
}

function removerDoCarrinho(produtoId) {
    let carrinho = obterCarrinho();
    carrinho = carrinho.filter(item => item.id !== produtoId);
    salvarCarrinho(carrinho);
    atualizarBotaoCarrinho(produtoId, false);
}

function atualizarBotaoCarrinho(produtoId, adicionado) {
    const botao = document.querySelector(`#produto-${produtoId} .botao-carrinho`);
    if (botao) {
        if (adicionado) {
            botao.textContent = "Remover do carrinho";
            botao.classList.add("carrinho-ativo");
            botao.onclick = () => removerDoCarrinho(produtoId);
        } else {
            botao.textContent = "Adicionar ao carrinho";
            botao.classList.remove("carrinho-ativo");
            botao.onclick = () => adicionarAoCarrinho(produtoId);
        }
    }
}

function verificarProdutoNoCarrinho(produtoId) {
    const carrinho = obterCarrinho();
    return carrinho.some(item => item.id === produtoId);
}

function irParaCarrinho() {
    window.location.href = './components/carrinho.html';
}

// === FUNÇÃO: Renderizar produtos na vitrine ===
function renderizarVitrine() {
    produtos.forEach((produto, index) => {
        const div = document.createElement("div");
        div.className = "produto";
        div.id = `produto-${index}`;

        const img = document.createElement("img");
        img.src = CaminhoImagem(produto.imagem);
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
        botaoCarrinho.className = "botao-carrinho";
        
        // Verificar se o produto já está no carrinho
        const jaNoCarrinho = verificarProdutoNoCarrinho(index);
        
        if (jaNoCarrinho) {
            botaoCarrinho.textContent = "Remover do carrinho";
            botaoCarrinho.classList.add("carrinho-ativo");
            botaoCarrinho.onclick = () => removerDoCarrinho(index);
        } else {
            botaoCarrinho.textContent = "Adicionar ao carrinho";
            botaoCarrinho.onclick = () => adicionarAoCarrinho(index);
        }

        // Botão para ir ao carrinho
        const botaoIrCarrinho = document.createElement("button");
        botaoIrCarrinho.onclick = irParaCarrinho;

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
if (btnEsquerda) {
    btnEsquerda.addEventListener("click", () => {
        vitrine.scrollBy({ left: -500, behavior: "smooth" });
    });
}

if (btnDireita) {
    btnDireita.addEventListener("click", () => {
        vitrine.scrollBy({ left: 500, behavior: "smooth" });
    });
}

function iniciarCarrossel() {
    const carouselInner = document.getElementById("carousel-inner");
    const carouselDots = document.getElementById("carousel-dots");

    if (!carouselInner || !carouselDots) return;

    imagensBanner.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = CaminhoImagem(src);
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
        carouselInner.style.transform = `translateX(-${index * 100}%)`;
        document.querySelectorAll(".carousel-dots span").forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    }

    setInterval(() => {
        slideAtual = (slideAtual + 1) % totalSlides;
        mudarSlide(slideAtual);
    }, 5000);
}

// === INICIALIZAÇÃO ===
document.addEventListener("DOMContentLoaded", () => {
    if (vitrine && typeof produtos !== 'undefined') {
        renderizarVitrine();
    }
    if (typeof imagensBanner !== 'undefined') {
        iniciarCarrossel();
    }
});