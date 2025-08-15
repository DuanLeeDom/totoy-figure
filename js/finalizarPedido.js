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
                    <span style="font-weight: bold; min-width: 20px; text-align: center;">${item.quantidade}</span>
                </div>
            </td>
            <td>
                <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
                    <strong>R$ ${valorTotal.toFixed(2).replace(".", ",")}</strong>
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

}

// === INICIALIZAÇÃO ===
document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrinho();
});