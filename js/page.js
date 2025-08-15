const maxCaracteres = 40;
const TEXTOS_BOTAO = {
    comprar: "Comprar",
    cancelar: "Cancelar Pedido"
};

// Categorização dos produtos baseada na descrição e preço
const categorizarProdutos = () => {
    const categorias = {
        'action-figures': [],
        'estatuetas': [],
        'colecionaveis': [],
        'acessorios': [],
        'novidades': [],
        'promocoes': []
    };

    produtos.forEach((produto, index) => {
        const descricao = produto.descricao.toLowerCase();
        const preco = parseFloat(produto.preco.replace(/\./g, "").replace(",", "."));

        // Produtos com "figura articulada" ou preço entre 300-800 = Action Figures
        if (descricao.includes('articulada') || descricao.includes('pose dinâmica') ||
            (preco >= 300 && preco <= 800)) {
            categorias['action-figures'].push({ ...produto, index });
        }
        // Produtos com "estátua", "miniatura" ou preço acima de 1000 = Estatuetas
        else if (descricao.includes('estátua') || descricao.includes('miniatura') ||
            descricao.includes('acabamento premium') || preco >= 1000) {
            categorias['estatuetas'].push({ ...produto, index });
        }
        // Produtos com "colecionável", "coleção" ou "edição especial" = Colecionáveis
        else if (descricao.includes('colecionável') || descricao.includes('coleção') ||
            descricao.includes('edição especial') || descricao.includes('exclusivo')) {
            categorias['colecionaveis'].push({ ...produto, index });
        }
        // Produtos com preço baixo (abaixo de 100) = Promoções
        else if (preco < 100) {
            categorias['promocoes'].push({ ...produto, index });
        }
        // Produtos dos últimos 6 do array = Novidades
        else if (index >= produtos.length - 6) {
            categorias['novidades'].push({ ...produto, index });
        }
        // Resto vai para colecionáveis
        else {
            categorias['colecionaveis'].push({ ...produto, index });
        }
    });

    return categorias;
};

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
            botao.textContent = TEXTOS_BOTAO.cancelar;
            botao.classList.add("carrinho-ativo");
            botao.onclick = () => removerDoCarrinho(produtoId);
        } else {
            botao.textContent = TEXTOS_BOTAO.comprar;
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

// === FUNÇÃO: Criar elemento de produto ===
function criarElementoProduto(produto, index) {
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

    const jaNoCarrinho = verificarProdutoNoCarrinho(index);

    if (jaNoCarrinho) {
        botaoCarrinho.textContent = TEXTOS_BOTAO.cancelar;
        botaoCarrinho.classList.add("carrinho-ativo");
        botaoCarrinho.onclick = () => removerDoCarrinho(index);
    } else {
        botaoCarrinho.textContent = TEXTOS_BOTAO.comprar;
        botaoCarrinho.onclick = () => adicionarAoCarrinho(index);
    }

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

    return div;
}

// === FUNÇÃO: Renderizar produtos por categoria ===
function renderizarCategoria(categoria, produtosCategoria) {
    const vitrine = document.getElementById(`vitrine-${categoria}`);
    if (!vitrine) return;

    vitrine.innerHTML = ''; // Limpar conteúdo anterior

    produtosCategoria.forEach(produto => {
        const elementoProduto = criarElementoProduto(produto, produto.index);
        vitrine.appendChild(elementoProduto);
    });
}

// === FUNÇÃO: Renderizar todas as categorias ===
function renderizarTodasCategorias() {
    const categorias = categorizarProdutos();

    // Renderizar cada categoria
    Object.keys(categorias).forEach(categoria => {
        renderizarCategoria(categoria, categorias[categoria]);
    });

    // Renderizar "todos os produtos"
    const vitrineTodos = document.getElementById('vitrine-todos');
    if (vitrineTodos) {
        vitrineTodos.innerHTML = '';
        produtos.forEach((produto, index) => {
            const elementoProduto = criarElementoProduto(produto, index);
            vitrineTodos.appendChild(elementoProduto);
        });
    }
}

// === FUNÇÃO: Mostrar categoria específica ===
function mostrarCategoria(categoria) {
    // Esconder todas as seções
    const secoes = document.querySelectorAll('.categoria-section');
    secoes.forEach(secao => {
        secao.style.display = 'none';
    });

    // Mostrar apenas a categoria selecionada
    const secaoSelecionada = document.getElementById(categoria);
    if (secaoSelecionada) {
        secaoSelecionada.style.display = 'block';
    }

    // Se for "todos", mostrar todas as seções
    if (categoria === 'todos') {
        secoes.forEach(secao => {
            if (secao.id !== 'acessorios') { // Acessórios fica oculto por não ter produtos
                secao.style.display = 'block';
            }
        });
    }
}

// === FUNÇÃO: Scroll das categorias ===
function scrollCategoria(categoria, quantidade) {
    const vitrine = document.getElementById(`vitrine-${categoria}`);
    if (vitrine) {
        vitrine.scrollBy({ left: quantidade, behavior: "smooth" });
    }
}

// === FUNÇÃO: Inicializar carrossel ===
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
    if (typeof produtos !== 'undefined') {
        renderizarTodasCategorias();
        // Mostrar apenas Action Figures por padrão
        mostrarCategoria('todos');


    }
    if (typeof imagensBanner !== 'undefined') {
        iniciarCarrossel();
    }
});