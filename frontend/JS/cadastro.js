const API_URL = "http://localhost:3000";

let dados = JSON.parse(localStorage.getItem('dadosCadastro')) || []; 


let nome = document.getElementById('nome');
let dataNascimento = document.getElementById('data');
let cpf = document.getElementById('CPF');
let email = document.getElementById('email');
let telefone = document.getElementById('number');
let senha = document.getElementById('senha');

function salvarusuario(){
    localStorage.setItem("registeredPassword", senha.value);
    localStorage.setItem("registeredUser", nome.value);    
}


const key = new URLSearchParams(window.location.search).get('chave');

if (key) {
    const info = dados[key];
    if (info) {
        nome.value = info.nome || '';
        dataNascimento.value = info.dataNascimento || '';
        cpf.value = info.cpf || '';
        email.value = info.email || '';
        telefone.value = info.telefone || '';
    }
    document.querySelector('#formInformacao button[type="submit"]').innerText = "Alterar";
}

document.getElementById('formInformacao').addEventListener('reset', function (e) {
    e.preventDefault();
    window.location.href = "./cadastro.html";
});

document.getElementById('formInformacao').addEventListener('submit', function (e) {
    e.preventDefault();


    if (!nome.value || !dataNascimento.value || !cpf.value || !email.value || !telefone.value) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const informacao = {
        nome: nome.value,
        dataNascimento: dataNascimento.value,
        cpf: cpf.value,
        email: email.value,
        telefone: telefone.value
    };

    
    if (!key) {
        dados.push(informacao);
    } else {
        dados[key] = informacao;
    }

      
      salvarusuario();

    
    localStorage.setItem('dadosCadastro', JSON.stringify(dados)); 
    
    
    window.location.href = "./index.html";
});


window.onload = atualizarTabela;

function atualizarTabela() {
    const tabela = document.querySelector('#dadosTable tbody');
    tabela.innerHTML = ''; 

    if (dados.length === 0) {
        const linhaVazia = document.createElement('tr');
        linhaVazia.innerHTML = `<td colspan="6">Nenhum dado encontrado.</td>`;
        tabela.appendChild(linhaVazia);
        return;
    }

    dados.forEach((informacao, index) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${informacao.nome || 'N/A'}</td>
            <td>${informacao.dataNascimento || 'N/A'}</td>
            <td>${informacao.cpf || 'N/A'}</td>
            <td>${informacao.email || 'N/A'}</td>
            <td>${informacao.telefone || 'N/A'}</td>
            <td>
                <a href="cadastro.html?chave=${index}">Editar</a>
                <a href="#" onclick="removerInformacao(${index})">Excluir</a>
            </td>
        `;
        tabela.appendChild(linha);
    });
}

function removerInformacao(index) {
    dados.splice(index, 1);
    localStorage.setItem('dadosCadastro', JSON.stringify(dados));
    atualizarTabela();
}
