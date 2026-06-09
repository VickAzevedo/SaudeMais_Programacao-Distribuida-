const API_URL = "http://localhost:3000";

let nome = document.getElementById('nome');
let dataNascimento = document.getElementById('data');
let cpf = document.getElementById('CPF');
let email = document.getElementById('email');
let telefone = document.getElementById('number');
let senha = document.getElementById('senha');

document.getElementById('formInformacao').addEventListener('reset', function (e) {
    e.preventDefault();
    window.location.href = "./cadastro.html";
});

document.getElementById('formInformacao').addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!nome.value || !dataNascimento.value || !cpf.value || !email.value || !telefone.value || !senha.value) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const informacao = {
        nome: nome.value,
        dataNascimento: dataNascimento.value,
        cpf: cpf.value,
        email: email.value,
        telefone: telefone.value,
        senha: senha.value
    };

    try {
        const resposta = await fetch(`${API_URL}/cadastro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(informacao)
        });

        if (!resposta.ok) {
            alert("Erro ao cadastrar. Tente novamente.");
            return;
        }

        alert("Cadastro realizado com sucesso!");
        window.location.href = "./index.html";
    } catch (erro) {
        alert("Não foi possível conectar ao servidor.");
    }
});
