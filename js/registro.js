// === FUNÇÕES DE REGISTRO DE USUÁRIO ===
function obterUsuarios() {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
}

function salvarUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function obterUsuarioLogado() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    return usuarioLogado ? JSON.parse(usuarioLogado) : null;
}

function salvarUsuarioLogado(usuario) {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
}

function formatarCPF(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = value;
}

function formatarCEP(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    input.value = value;
}

function buscarCEP(cep) {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length === 8) {
        // Mostrar feedback de carregamento
        const bairroInput = document.querySelector('input[name="bairro"]');
        const cidadeInput = document.querySelector('input[name="cidade"]');
        const estadoInput = document.querySelector('input[name="estado"]');

        bairroInput.value = 'Carregando...';
        cidadeInput.value = 'Carregando...';
        estadoInput.value = 'Carregando...';

        fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    bairroInput.value = data.bairro || '';
                    cidadeInput.value = data.localidade || '';
                    estadoInput.value = data.uf || '';
                } else {
                    bairroInput.value = '';
                    cidadeInput.value = '';
                    estadoInput.value = '';
                    alert('CEP não encontrado!');
                }
            })
            .catch(error => {
                console.log('Erro ao buscar CEP:', error);
                bairroInput.value = '';
                cidadeInput.value = '';
                estadoInput.value = '';
                alert('Erro ao buscar CEP. Verifique sua conexão.');
            });
    }
}

function validarFormularioRegistro() {
    const campos = {
        cpf: document.querySelector('input[name="cpf"]'),
        iptLogradouro: document.querySelector('input[name="logradouro"]'),
        nome: document.querySelector('input[name="nome"]'),
        email: document.querySelector('input[name="email"]'),
        cep: document.querySelector('input[name="cep"]'),
        numero: document.querySelector('input[name="numero"]'),
        bairro: document.querySelector('input[name="bairro"]'),
        cidade: document.querySelector('input[name="cidade"]'),
        estado: document.querySelector('input[name="estado"]')
    };

    let valido = true;
    let mensagem = '';

    // Limpar estilos anteriores
    Object.values(campos).forEach(campo => {
        if (campo) {
            campo.style.borderColor = '';
        }
    });

    // Validar campos obrigatórios
    Object.entries(campos).forEach(([nome, campo]) => {
        if (!campo || !campo.value.trim()) {
            valido = false;
            mensagem += `- ${nome.charAt(0).toUpperCase() + nome.slice(1)} é obrigatório\n`;
            if (campo) {
                campo.style.borderColor = '#dc3545';
            }
        } else {
            if (campo) {
                campo.style.borderColor = '#28a745';
            }
        }
    });

    // Validação específica do CPF
    if (campos.cpf && campos.cpf.value.trim()) {
        const cpf = campos.cpf.value.replace(/\D/g, '');
        if (cpf.length !== 11) {
            valido = false;
            mensagem += '- CPF deve ter 11 dígitos\n';
            campos.cpf.style.borderColor = '#dc3545';
        } else {
            // Verificar se CPF já existe
            const usuarios = obterUsuarios();
            const cpfExiste = usuarios.some(usuario => usuario.cpf.replace(/\D/g, '') === cpf);
            if (cpfExiste) {
                valido = false;
                mensagem += '- Este CPF já está cadastrado\n';
                campos.cpf.style.borderColor = '#dc3545';
            }
        }
    }

    // Validação do email
    if (campos.email && campos.email.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(campos.email.value)) {
            valido = false;
            mensagem += '- Email deve ter um formato válido\n';
            campos.email.style.borderColor = '#dc3545';
        } else {
            // Verificar se email já existe
            const usuarios = obterUsuarios();
            const emailExiste = usuarios.some(usuario =>
                usuario.email.toLowerCase() === campos.email.value.toLowerCase()
            );
            if (emailExiste) {
                valido = false;
                mensagem += '- Este email já está cadastrado\n';
                campos.email.style.borderColor = '#dc3545';
            }
        }
    }

    // Validação do CEP
    if (campos.cep && campos.cep.value.trim()) {
        const cep = campos.cep.value.replace(/\D/g, '');
        if (cep.length !== 8) {
            valido = false;
            mensagem += '- CEP deve ter 8 dígitos\n';
            campos.cep.style.borderColor = '#dc3545';
        }
    }

    return { valido, mensagem };
}

function finalizarRegistro() {
    const validacao = validarFormularioRegistro();

    if (!validacao.valido) {
        alert('Corrija os seguintes erros:\n\n' + validacao.mensagem);
        return;
    }

    // Coletar dados do formulário
    const dadosUsuario = {
        cpf: document.querySelector('input[name="cpf"]').value.trim(),
        nome: document.querySelector('input[name="nome"]').value.trim(),
        email: document.querySelector('input[name="email"]').value.trim(),
        endereco: {
            cep: document.querySelector('input[name="cep"]').value.trim(),
            numero: document.querySelector('input[name="numero"]').value.trim(),
            bairro: document.querySelector('input[name="bairro"]').value.trim(),
            cidade: document.querySelector('input[name="cidade"]').value.trim(),
            estado: document.querySelector('input[name="estado"]').value.trim()
        },
        dataRegistro: new Date().toLocaleString('pt-BR'),
        id: Date.now()
    };

    // Obter usuários existentes e adicionar o novo
    const usuarios = obterUsuarios();
    usuarios.push(dadosUsuario);
    salvarUsuarios(usuarios);

    // Salvar como usuário logado
    salvarUsuarioLogado(dadosUsuario);

    // Mostrar confirmação
    alert(`Registro realizado com sucesso!\n\nBem-vindo(a), ${dadosUsuario.nome}!\n\nVocê será redirecionado para continuar suas compras.`);

    // Redirecionar para página inicial ou carrinho se houver produtos
    const carrinho = localStorage.getItem('carrinho');
    if (carrinho && JSON.parse(carrinho).length > 0) {
        window.location.href = '../components/carrinho.html';
    } else {
        window.location.href = '../index.html';
    }
}

function preencherDadosUsuarioLogado() {
    const usuario = obterUsuarioLogado();

    if (usuario) {
        // Preencher campos do formulário
        const cpfInput = document.querySelector('input[name="cpf"]');
        const nomeInput = document.querySelector('input[name="nome"]');
        const emailInput = document.querySelector('input[name="email"]');
        const cepInput = document.querySelector('input[name="cep"]');
        const numeroInput = document.querySelector('input[name="numero"]');
        const bairroInput = document.querySelector('input[name="bairro"]');
        const cidadeInput = document.querySelector('input[name="cidade"]');
        const estadoInput = document.querySelector('input[name="estado"]');

        if (cpfInput) cpfInput.value = usuario.cpf;
        if (nomeInput) nomeInput.value = usuario.nome;
        if (emailInput) emailInput.value = usuario.email;
        if (cepInput) cepInput.value = usuario.endereco.cep;
        if (numeroInput) numeroInput.value = usuario.endereco.numero;
        if (bairroInput) bairroInput.value = usuario.endereco.bairro;
        if (cidadeInput) cidadeInput.value = usuario.endereco.cidade;
        if (estadoInput) estadoInput.value = usuario.endereco.estado;

        // Alterar texto do botão se usuário já estiver logado
        const btnFinalizar = document.getElementById('finalizarPedidoBtn');
        if (btnFinalizar && btnFinalizar.textContent === 'Finalizar registro') {
            btnFinalizar.textContent = 'Atualizar dados';
        }
    }
}

function verificarSeUsuarioEstaLogado() {
    const usuario = obterUsuarioLogado();
    return usuario !== null;
}

function deslogarUsuario() {
    localStorage.removeItem('usuarioLogado');
    alert('Você foi deslogado com sucesso!');
    window.location.href = '../index.html';
}

// === INICIALIZAÇÃO ===
document.addEventListener("DOMContentLoaded", () => {
    // Verificar se estamos na página de registro e preencher dados se usuário estiver logado
    if (window.location.pathname.includes('registro.html')) {
        preencherDadosUsuarioLogado();
    }

    // Configurar eventos
    const btnFinalizar = document.getElementById('finalizarPedidoBtn');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', finalizarRegistro);
    }

    // Configurar formatação do CPF
    const cpfInput = document.querySelector('input[name="cpf"]');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => formatarCPF(e.target));
    }

    // Configurar formatação do CEP
    const cepInput = document.querySelector('input[name="cep"]');
    if (cepInput) {
        cepInput.addEventListener('input', (e) => formatarCEP(e.target));
        cepInput.addEventListener('blur', (e) => buscarCEP(e.target.value));
    }

    // Adicionar validação em tempo real nos campos
    const inputs = document.querySelectorAll('.inputs');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim()) {
                input.style.borderColor = '#28a745';
            } else {
                input.style.borderColor = '#dc3545';
            }
        });
    });
});