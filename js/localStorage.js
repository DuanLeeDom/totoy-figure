function guardarLS(keyName, conteudo){
    if(window.localStorage){
        let dados = JSON.stringify(conteudo);
        localStorage.setItem(keyName, dados);
    }
    else{
        alert("Local Storage indisponivel!");
    }
}

function recuperarLS(keyName){
    if(window.localStorage){
        let dados = localStorage.getItem(keyName);
        return JSON.parse(dados);
    }
    else{
        alert("Local Storage indisponivel!");
    }
}