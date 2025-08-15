// === PRODUTOS.JS - LÓGICA DA PÁGINA DE PRODUTOS ===

// Variáveis globais
let produtosFiltrados = [];
let paginaAtual = 1;
const produtosPorPagina = 9;
let produtoSelecionado = null;

// Elementos do DOM
const produtosGrid = document.getElementById('produtos-grid');
const totalProdutosSpan = document.getElementById('total-produtos');
const paginationDiv = document.getElementById('pagination');
const modal = document.getElementById('modal-produto');

// Elementos de filtro
const ordenacaoSelect = document.getElementById('ordenacao');
const filtroPrecoSelect = document.getElementById('filtro-preco');
const filtroAvaliacaoSelect = document.getElementById('filtro-avaliacao');
const limparFiltrosBtn = document.getElementById('limpar-filtros');

// === FUNÇÕES UTILITÁRIAS ===

function resolverCaminhoImagem(caminho) {
    if (caminho.startsWith("http") || caminho.startsWith("//")) {
        return caminho.startsWith("//") ? "https:" + caminho : caminho;
    } else {
        return "../img/" + caminho;
    }
}

function formatarPreco(preco) {
    const precoNumerico = parseFloat(preco.replace(/\./g, "").replace(",", "."));
    return precoNumerico.toFixed(2).replace(".", ",");
}

function gerarEstrelas(avaliacao) {
    const rating = avaliacao || 4;
    const estrelasCheias = Math.floor(rating);
    const temMeiaEstrela = rating % 1 >= 0.5;
    let html = '';

    for (let i = 1; i <= 5; i++) {
        if (i <= estrelasCheias) {
            html += '<span>★</span>';
        } else if (i === estrelasCheias + 1 && temMeiaEstrela) {
            html += '<span>⯨</span>';
        } else {
            html += '<span>☆</span>';
        }
    }
    return html;
}

function calcularParcelamento(preco) {
    const precoNumerico = parseFloat(preco.replace(/\./g, "").replace(",", "."));
    let parcelas = 12;

    while (parcelas > 1 && (precoNumerico / parcelas) < 10) {
        parcelas--;
    }

    if (precoNumerico >= 50 && parcelas > 1) {
        const valorParcela = (precoNumerico / parcelas).toFixed(2).replace(".", ",");
        return `ou ${parcelas}x de R$ ${valorParcela} sem juros`;
    }
    return '';
}

// === FUNÇÕES DO CARRINHO ===

function obterCarrinho() {
    const carrinho = localStorage.getItem('carrinho');
    return carrinho ? JSON.parse(carrinho) : [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function verificarProdutoNoCarrinho(produtoId) {
    const carrinho = obterCarrinho();
    return carrinho.some(item => item.id === produtoId);
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
    atualizarBotoesCarrinho();

    // Feedback visual
    mostrarNotificacao(`${produto.nome} foi adicionado ao carrinho!`, 'sucesso');
}

function removerDoCarrinho(produtoId) {
    let carrinho = obterCarrinho();
    carrinho = carrinho.filter(item => item.id !== produtoId);
    salvarCarrinho(carrinho);
    atualizarBotoesCarrinho();

    const produto = produtos[produtoId];
    mostrarNotificacao(`${produto.nome} foi removido do carrinho!`, 'info');
}

function atualizarBotoesCarrinho() {
    const botoes = document.querySelectorAll('.btn-carrinho');
    botoes.forEach(botao => {
        const produtoId = parseInt(botao.dataset.produtoId);
        const jaNoCarrinho = verificarProdutoNoCarrinho(produtoId);

        if (jaNoCarrinho) {
            botao.textContent = "Remover do carrinho";
            botao.classList.add("carrinho-ativo");
            botao.onclick = () => removerDoCarrinho(produtoId);
        } else {
            botao.textContent = "Adicionar ao carrinho";
            botao.classList.remove("carrinho-ativo");
            botao.onclick = () => adicionarAoCarrinho(produtoId);
        }
    });
}

// === FUNÇÕES DE FILTRO E ORDENAÇÃO ===

function filtrarProdutos() {
    let produtosFiltradosTemp = [...produtos];

    // Filtro por preço
    const filtroPreco = filtroPrecoSelect.value;
    if (filtroPreco !== 'todos') {
        produtosFiltradosTemp = produtosFiltradosTemp.filter(produto => {
            const preco = parseFloat(produto.preco.replace(/\./g, "").replace(",", "."));

            switch (filtroPreco) {
                case '0-100':
                    return preco <= 100;
                case '100-500':
                    return preco > 100 && preco <= 500;
                case '500-1000':
                    return preco > 500 && preco <= 1000;
                case '1000-2000':
                    return preco > 1000 && preco <= 2000;
                case '2000+':
                    return preco > 2000;
                default:
                    return true;
            }
        });
    }

    // Filtro por avaliação
    const filtroAvaliacao = filtroAvaliacaoSelect.value;
    if (filtroAvaliacao !== 'todas') {
        const avaliacaoMinima = parseFloat(filtroAvaliacao);
        produtosFiltradosTemp = produtosFiltradosTemp.filter(produto => {
            return produto.avaliacao >= avaliacaoMinima;
        });
    }

    produtosFiltrados = produtosFiltradosTemp;
    ordenarProdutos();
}

function ordenarProdutos() {
    const ordenacao = ordenacaoSelect.value;

    produtosFiltrados.sort((a, b) => {
        switch (ordenacao) {
            case 'menor-preco':
                const precoA = parseFloat(a.preco.replace(/\./g, "").replace(",", "."));
                const precoB = parseFloat(b.preco.replace(/\./g, "").replace(",", "."));
                return precoA - precoB;

            case 'maior-preco':
                const precoA2 = parseFloat(a.preco.replace(/\./g, "").replace(",", "."));
                const precoB2 = parseFloat(b.preco.replace(/\./g, "").replace(",", "."));
                return precoB2 - precoA2;

            case 'melhor-avaliacao':
                return b.avaliacao - a.avaliacao;

            case 'nome-a-z':
                return a.nome.localeCompare(b.nome);

            case 'nome-z-a':
                return b.nome.localeCompare(a.nome);

            default: // relevancia
                return 0;
        }
    });

    paginaAtual = 1;
    renderizarProdutos();
    renderizarPaginacao();
    atualizarTotalProdutos();
}

function limparFiltros() {
    ordenacaoSelect.value = 'relevancia';
    filtroPrecoSelect.value = 'todos';
    filtroAvaliacaoSelect.value = 'todas';
    filtrarProdutos();
}

// === FUNÇÕES DE RENDERIZAÇÃO ===

function renderizarProdutos() {
    produtosGrid.innerHTML = '<div class="loading">Carregando produtos...</div>';

    setTimeout(() => {
        const inicio = (paginaAtual - 1) * produtosPorPagina;
        const fim = inicio + produtosPorPagina;
        const produtosPagina = produtosFiltrados.slice(inicio, fim);

        if (produtosPagina.length === 0) {
            produtosGrid.innerHTML = '<div class="sem-produtos">Nenhum produto encontrado.</div>';
            return;
        }

        produtosGrid.innerHTML = '';

        produtosPagina.forEach((produto, index) => {
            const produtoIndex = produtos.indexOf(produto);
            const produtoCard = criarCardProduto(produto, produtoIndex);
            produtosGrid.appendChild(produtoCard);
        });

        atualizarBotoesCarrinho();
    }, 300);
}

function criarCardProduto(produto, index) {
    const card = document.createElement('div');
    card.className = 'produto-card';
    card.onclick = () => abrirModal(produto, index);

    const precoNumerico = parseFloat(produto.preco.replace(/\./g, "").replace(",", "."));
    const precoFormatado = formatarPreco(produto.preco);
    const parcelamento = calcularParcelamento(produto.preco);
    const estrelas = gerarEstrelas(produto.avaliacao);

    card.innerHTML = `
        <div class="produto-imagem">
            <img src="${resolverCaminhoImagem(produto.imagem)}" alt="${produto.nome}">
            ${produto.avaliacao >= 4.5 ? '<div class="produto-badge">Destaque</div>' : ''}
        </div>
        <div class="produto-info">
            <h3 class="produto-nome">${produto.nome}</h3>
            <p class="produto-descricao">${produto.descricao}</p>
            <div class="estrelas">${estrelas}</div>
            <div class="produto-preco">
                <span class="preco-atual">R$ ${precoFormatado}</span>
                ${parcelamento ? `<div class="parcelamento">${parcelamento}</div>` : ''}
            </div>
            <div class="produto-acoes">
                <button class="btn-carrinho" data-produto-id="${index}" onclick="event.stopPropagation()">
                    Adicionar ao carrinho
                </button>
            </div>
        </div>
    `;

    return card;
}

// === CONTINUAÇÃO DO PRODUTOS.JS ===

// === FUNÇÕES DE PAGINAÇÃO ===

function renderizarPaginacao() {
    const totalPaginas = Math.ceil(produtosFiltrados.length / produtosPorPagina);
    paginationDiv.innerHTML = '';

    if (totalPaginas <= 1) return;

    // Botão anterior
    const btnAnterior = document.createElement('button');
    btnAnterior.textContent = 'Anterior';
    btnAnterior.className = `pagination-btn ${paginaAtual === 1 ? 'disabled' : ''}`;
    btnAnterior.onclick = () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            renderizarProdutos();
            renderizarPaginacao();
            scrollToProdutos();
        }
    };
    paginationDiv.appendChild(btnAnterior);

    // Números das páginas
    const inicioRange = Math.max(1, paginaAtual - 2);
    const fimRange = Math.min(totalPaginas, paginaAtual + 2);

    // Primeira página
    if (inicioRange > 1) {
        const btn1 = criarBotaoPagina(1);
        paginationDiv.appendChild(btn1);

        if (inicioRange > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            paginationDiv.appendChild(ellipsis);
        }
    }

    // Páginas no range
    for (let i = inicioRange; i <= fimRange; i++) {
        const btn = criarBotaoPagina(i);
        paginationDiv.appendChild(btn);
    }

    // Última página
    if (fimRange < totalPaginas) {
        if (fimRange < totalPaginas - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            paginationDiv.appendChild(ellipsis);
        }

        const btnUltima = criarBotaoPagina(totalPaginas);
        paginationDiv.appendChild(btnUltima);
    }

    // Botão próximo
    const btnProximo = document.createElement('button');
    btnProximo.textContent = 'Próximo';
    btnProximo.className = `pagination-btn ${paginaAtual === totalPaginas ? 'disabled' : ''}`;
    btnProximo.onclick = () => {
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            renderizarProdutos();
            renderizarPaginacao();
            scrollToProdutos();
        }
    };
    paginationDiv.appendChild(btnProximo);
}

function criarBotaoPagina(numeroPagina) {
    const btn = document.createElement('button');
    btn.textContent = numeroPagina;
    btn.className = `pagination-btn ${numeroPagina === paginaAtual ? 'active' : ''}`;
    btn.onclick = () => {
        paginaAtual = numeroPagina;
        renderizarProdutos();
        renderizarPaginacao();
        scrollToProdutos();
    };
    return btn;
}

function scrollToProdutos() {
    produtosGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function atualizarTotalProdutos() {
    if (totalProdutosSpan) {
        totalProdutosSpan.textContent = produtosFiltrados.length;
    }
}

// === FUNÇÕES DO MODAL ===

function abrirModal(produto, index) {
    produtoSelecionado = { produto, index };

    // Preencher informações do modal
    const modalNome = modal.querySelector('.modal-produto-nome');
    const modalImagem = modal.querySelector('.modal-produto-imagem img');
    const modalDescricao = modal.querySelector('.modal-produto-descricao');
    const modalPreco = modal.querySelector('.modal-produto-preco');
    const modalEstrelas = modal.querySelector('.modal-estrelas');
    const modalParcelamento = modal.querySelector('.modal-parcelamento');
    const modalBtnCarrinho = modal.querySelector('.modal-btn-carrinho');

    if (modalNome) modalNome.textContent = produto.nome;
    if (modalImagem) {
        modalImagem.src = resolverCaminhoImagem(produto.imagem);
        modalImagem.alt = produto.nome;
    }
    if (modalDescricao) modalDescricao.textContent = produto.descricao;
    if (modalPreco) modalPreco.textContent = `R$ ${formatarPreco(produto.preco)}`;
    if (modalEstrelas) modalEstrelas.innerHTML = gerarEstrelas(produto.avaliacao);
    if (modalParcelamento) {
        const parcelamento = calcularParcelamento(produto.preco);
        modalParcelamento.textContent = parcelamento;
        modalParcelamento.style.display = parcelamento ? 'block' : 'none';
    }

    // Configurar botão do carrinho
    if (modalBtnCarrinho) {
        modalBtnCarrinho.dataset.produtoId = index;
        const jaNoCarrinho = verificarProdutoNoCarrinho(index);

        if (jaNoCarrinho) {
            modalBtnCarrinho.textContent = "Remover do carrinho";
            modalBtnCarrinho.classList.add("carrinho-ativo");
            modalBtnCarrinho.onclick = () => {
                removerDoCarrinho(index);
                fecharModal();
            };
        } else {
            modalBtnCarrinho.textContent = "Adicionar ao carrinho";
            modalBtnCarrinho.classList.remove("carrinho-ativo");
            modalBtnCarrinho.onclick = () => {
                adicionarAoCarrinho(index);
                fecharModal();
            };
        }
    }

    // Mostrar modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Animação de entrada
    setTimeout(() => {
        modal.classList.add('modal-aberto');
    }, 10);
}

function fecharModal() {
    modal.classList.remove('modal-aberto');

    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        produtoSelecionado = null;
    }, 300);
}

// === FUNÇÕES DE NOTIFICAÇÃO ===

function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao ${tipo}`;
    notificacao.innerHTML = `
        <div class="notificacao-content">
            <span class="notificacao-icon">${obterIconeNotificacao(tipo)}</span>
            <span class="notificacao-texto">${mensagem}</span>
            <button class="fechar-notificacao">&times;</button>
        </div>
    `;

    document.body.appendChild(notificacao);

    // Mostrar notificação
    setTimeout(() => {
        notificacao.classList.add('notificacao-visivel');
    }, 100);

    // Configurar botão de fechar
    const btnFechar = notificacao.querySelector('.fechar-notificacao');
    btnFechar.onclick = () => removerNotificacao(notificacao);

    // Auto-remover após 4 segundos
    setTimeout(() => {
        if (document.body.contains(notificacao)) {
            removerNotificacao(notificacao);
        }
    }, 4000);
}

function obterIconeNotificacao(tipo) {
    switch (tipo) {
        case 'sucesso': return '✓';
        case 'erro': return '✗';
        case 'aviso': return '⚠';
        default: return 'ℹ';
    }
}

function removerNotificacao(notificacao) {
    notificacao.classList.remove('notificacao-visivel');

    setTimeout(() => {
        if (document.body.contains(notificacao)) {
            document.body.removeChild(notificacao);
        }
    }, 300);
}

// === FUNÇÕES DE BUSCA ===

function buscarProdutos(termo) {
    if (!termo || termo.trim() === '') {
        produtosFiltrados = [...produtos];
    } else {
        const termoBusca = termo.toLowerCase().trim();
        produtosFiltrados = produtos.filter(produto =>
            produto.nome.toLowerCase().includes(termoBusca) ||
            produto.descricao.toLowerCase().includes(termoBusca)
        );
    }

    paginaAtual = 1;
    ordenarProdutos();
}

// === EVENT LISTENERS ===

function configurarEventListeners() {
    // Filtros e ordenação
    if (ordenacaoSelect) {
        ordenacaoSelect.addEventListener('change', ordenarProdutos);
    }

    if (filtroPrecoSelect) {
        filtroPrecoSelect.addEventListener('change', filtrarProdutos);
    }

    if (filtroAvaliacaoSelect) {
        filtroAvaliacaoSelect.addEventListener('change', filtrarProdutos);
    }

    if (limparFiltrosBtn) {
        limparFiltrosBtn.addEventListener('click', limparFiltros);
    }

    // Modal
    if (modal) {
        // Fechar modal clicando no fundo
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                fecharModal();
            }
        });

        // Fechar modal com botão X
        const btnFecharModal = modal.querySelector('.fechar-modal');
        if (btnFecharModal) {
            btnFecharModal.addEventListener('click', fecharModal);
        }

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                fecharModal();
            }
        });
    }

    // Busca (se existir campo de busca)
    const campoBusca = document.getElementById('campo-busca');
    if (campoBusca) {
        let timeoutBusca;
        campoBusca.addEventListener('input', (e) => {
            clearTimeout(timeoutBusca);
            timeoutBusca = setTimeout(() => {
                buscarProdutos(e.target.value);
            }, 300);
        });
    }
}

// === FUNÇÃO DE INICIALIZAÇÃO ===

function inicializarPaginaProdutos() {
    // Verificar se os elementos existem
    if (!produtosGrid) {
        console.error('Elemento produtos-grid não encontrado');
        return;
    }

    // Configurar event listeners
    configurarEventListeners();

    // Inicializar produtos
    produtosFiltrados = [...produtos];

    // Renderizar página inicial
    renderizarProdutos();
    renderizarPaginacao();
    atualizarTotalProdutos();

    console.log('Página de produtos inicializada com sucesso');
    console.log(`Total de produtos: ${produtos.length}`);
}

// === FUNÇÕES AUXILIARES ===

function redimensionarImagens() {
    const imagens = document.querySelectorAll('.produto-card img');
    imagens.forEach(img => {
        img.onload = function () {
            this.classList.add('carregada');
        };

        img.onerror = function () {
            this.src = '../img/placeholder.jpg'; // Imagem padrão se não carregar
            this.alt = 'Imagem não disponível';
        };
    });
}

function aplicarAnimacoes() {
    // Animação de entrada dos cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('card-visivel');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observar todos os cards de produto
    document.querySelectorAll('.produto-card').forEach(card => {
        observer.observe(card);
    });
}

// === INICIALIZAÇÃO QUANDO DOM ESTIVER PRONTO ===

document.addEventListener('DOMContentLoaded', inicializarPaginaProdutos);

// === FUNÇÕES PARA USAR EM OUTRAS PÁGINAS ===

// Exportar funções para uso global (se necessário)
window.produtosFuncoes = {
    adicionarAoCarrinho,
    removerDoCarrinho,
    verificarProdutoNoCarrinho,
    obterCarrinho,
    formatarPreco,
    gerarEstrelas,
    mostrarNotificacao
};