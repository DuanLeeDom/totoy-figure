let data = document.getElementById("data")
let cpf = document.getElementById("cpf")
let nome = document.getElementById("nome")
let email = document.getElementById("email")
let cep = document.getElementById("cep")
let logradouro = document.getElementById("logradouro")
let numero = document.getElementById("num")
let bairro = document.getElementById("bairro")
let cidade = document.getElementById("cidade")
let estado = document.getElementById("estado")

let pedidos = recuperarLS("pedidos");
let carrinho = recuperarDadosCarrinho();

data.innerHTML = "Data: " + pedidos.data;
cpf.innerHTML = "CPF: " + pedidos.cpf;
nome.innerHTML = "Nome: " + pedidos.nome;
email.innerHTML = "E-mail: " + pedidos.email;
cep.innerHTML = "CEP: " + pedidos.cep;
logradouro.innerHTML = "Logradouro: " + pedidos.logradouro;
numero.innerHTML = "Numero: " + pedidos.numero;
bairro.innerHTML = "Bairro: " + pedidos.bairro;
cidade.innerHTML = "Cidade: " + pedidos.cidade;
estado.innerHTML = "Estado: " + pedidos.estado;