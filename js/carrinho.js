// === FUNÇÕES DO CARRINHO ===
function obterCarrinho() {
    const carrinho = localStorage.getItem('carrinho');
    return carrinho ? JSON.parse(carrinho) : [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function CaminhoImagem(caminho) {
    if (caminho.startsWith("http") || caminho.startsWith("//")) {
        return caminho.startsWith("//") ? "https:" + caminho : caminho;
    } else {
        return "../img/" + caminho;
    }
}

function atualizarQuantidade(produtoId, novaQuantidade) {
    let carrinho = obterCarrinho();
    const item = carrinho.find(item => item.id === produtoId);

    if (item) {
        if (novaQuantidade <= 0) {
            // Remove o item se a quantidade for 0 ou menor
            carrinho = carrinho.filter(item => item.id !== produtoId);
        } else {
            item.quantidade = novaQuantidade;
        }
        salvarCarrinho(carrinho);
        renderizarCarrinho();
    }
}

function removerItemCarrinho(produtoId) {
    let carrinho = obterCarrinho();
    carrinho = carrinho.filter(item => item.id !== produtoId);
    salvarCarrinho(carrinho);
    renderizarCarrinho();
}

function calcularTotal() {
    const carrinho = obterCarrinho();
    return carrinho.reduce((total, item) => {
        const preco = parseFloat(item.preco.replace(/\./g, "").replace(",", "."));
        return total + (preco * item.quantidade);
    }, 0);
}

function renderizarCarrinho() {
    const tbody = document.getElementById('tBody');
    const carrinho = obterCarrinho();

    if (!tbody) return;

    // Limpar conteúdo atual
    tbody.innerHTML = '';

    if (carrinho.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="7" style="text-align: center; padding: 20px;">
                <p>Seu carrinho está vazio!</p>
                <a href="../index.html" style="color: #007bff; text-decoration: none;">
                    Continuar comprando
                </a>
            </td>
        `;
        tbody.appendChild(tr);
        return;
    }

    carrinho.forEach((item, index) => {
        const preco = parseFloat(item.preco.replace(/\./g, "").replace(",", "."));
        const valorTotal = preco * item.quantidade;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${String(item.id + 1).padStart(3, '0')}</td>
            <td>
                <img src="${CaminhoImagem(item.imagem)}" alt="${item.nome}" width="60" style="border-radius: 4px;">
            </td>
            <td>${item.nome}</td>
            <td>${item.descricao}</td>
            <td>R$ ${item.preco}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button onclick="atualizarQuantidade(${item.id}, ${item.quantidade - 1})" 
                            style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                        -
                    </button>
                    <span style="font-weight: bold; min-width: 20px; text-align: center;">${item.quantidade}</span>
                    <button onclick="atualizarQuantidade(${item.id}, ${item.quantidade + 1})" 
                            style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                        +
                    </button>
                </div>
            </td>
            <td>
                <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
                    <strong>R$ ${valorTotal.toFixed(2).replace(".", ",")}</strong>
                    <button onclick="removerItemCarrinho(${item.id})" 
                            style="background: #dc3545; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 12px;">
                        Remover
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Adicionar linha de total
    const totalGeral = calcularTotal();
    const trTotal = document.createElement('tr');
    trTotal.style.backgroundColor = '#f8f9fa';
    trTotal.style.fontWeight = 'bold';
    trTotal.innerHTML = `
        <td colspan="6" style="text-align: right; padding: 15px;">TOTAL GERAL:</td>
        <td style="padding: 15px;">
            <span style="font-size: 18px; color: #28a745;">R$ ${totalGeral.toFixed(2).replace(".", ",")}</span>
        </td>
    `;
    tbody.appendChild(trTotal);

    // Adicionar botões de ação
    const trAcoes = document.createElement('tr');
    trAcoes.innerHTML = `
        <td colspan="7" style="text-align: center; padding: 20px;">
            <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                <a href="../index.html" 
                   style="background: #6c757d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Continuar Comprando
                </a>
                <button onclick="limparCarrinho()" 
                        style="background: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
                    Limpar Carrinho
                </button>
                <a href="./finalizarPedido.html" 
                   style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Finalizar Pedido
                </a>
            </div>
        </td>
    `;
    tbody.appendChild(trAcoes);
}

function limparCarrinho() {
    if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
        localStorage.removeItem('carrinho');
        renderizarCarrinho();
    }
}

// === INICIALIZAÇÃO ===
document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrinho();
});

function recuperarDadosCarrinho() {
    const carrinhoString = localStorage.getItem('carrinho');
    const carrinho = carrinhoString ? JSON.parse(carrinhoString) : [];
    return carrinho;
}