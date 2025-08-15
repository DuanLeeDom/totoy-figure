let iptCPF = document.getElementById("cpf");
let iptNome = document.getElementById("nome");
let iptEmail = document.getElementById("email");

let iptCEP = document.getElementById("cep");
let iptLogradouro = document.getElementById("logradouro")
let iptNumero = document.getElementById("numero");
let iptBairro = document.getElementById("bairro");
let iptCidade = document.getElementById("cidade");
let iptEstado = document.getElementById("estado");

let buttonFinish = document.getElementById("finalizarPedidoBtn")


let vetorUsuarios = recuperarLS("usuarios")
if (vetorUsuarios == null) {
    vetorUsuarios = [];
}


//Guardar os dados dos usuarios em um vetor de objetos no localStorage
function criarOBJ() {
    let usuario = {}

    usuario.cpf = iptCPF.value;
    usuario.nome = iptNome.value;
    usuario.email = iptEmail.value;

    usuario.cep = iptCEP.value;
    usuario.logradouro = iptLogradouro.value;
    usuario.numero = iptNumero.value;
    usuario.bairro = iptBairro.value;
    usuario.cidade = iptCidade.value;
    usuario.estado = iptEstado.value;

    return usuario;
}

function guardarObj() {
    let usuario = criarOBJ()

    vetorUsuarios.push(usuario);

    guardarLS("usuarios", vetorUsuarios)

    let ax = pedidoConcluido();

    guardarLS("pedidos", ax)

    alert("usuariosGuardados");

    window.location.href = "../components/pedidoConcluido.html"

}

buttonFinish.addEventListener("click", guardarObj);

function verificarCPFExistente(cpf) {
    return vetorUsuarios.find(usuario => usuario.cpf === cpf);
}

// Função para preencher automaticamente os campos com base no CPF
function preencherAutomatico() {
    let cpf = iptCPF.value.trim();

    if (cpf !== "") {
        let usuarioExistente = verificarCPFExistente(cpf);

        if (usuarioExistente) {
            iptNome.value = usuarioExistente.nome;
            iptEmail.value = usuarioExistente.email;
            iptCEP.value = usuarioExistente.cep;
            iptLogradouro.value = usuarioExistente.logradouro;
            iptNumero.value = usuarioExistente.numero;
            iptBairro.value = usuarioExistente.bairro;
            iptCidade.value = usuarioExistente.cidade;
            iptEstado.value = usuarioExistente.estado;

            alert("Dados encontrados e preenchidos automaticamente!");
        }
    }
}

// Event listener para verificar CPF quando o usuário sair do campo
iptCPF.addEventListener("blur", preencherAutomatico);


function pedidoConcluido() {
    let pedidosConcluido = {}

    pedidosConcluido.data = new Date();

    pedidosConcluido.cpf = iptCPF.value;
    pedidosConcluido.nome = iptNome.value;
    pedidosConcluido.email = iptEmail.value;

    pedidosConcluido.cep = iptCEP.value;
    pedidosConcluido.logradouro = iptLogradouro.value;
    pedidosConcluido.numero = iptNumero.value;
    pedidosConcluido.bairro = iptBairro.value;
    pedidosConcluido.cidade = iptCidade.value;
    pedidosConcluido.estado = iptEstado.value;

    let carrinho = recuperarDadosCarrinho();
    console.log(carrinho)
    pedidosConcluido.nomeP = carrinho.nome;
    pedidosConcluido.descricao = carrinho.descricao;
    pedidosConcluido.preco = carrinho.preco;
    pedidosConcluido.quantidade = carrinho.quantidade;



    return pedidosConcluido
}