const API_URL = "http://localhost:3000";

document.getElementById("formInformacao").addEventListener("submit", async function (e) {
    e.preventDefault();

    const informacao = {
        nome: nome.value,
        dataNascimento: dataNascimento.value,
        cpf: cpf.value,
        email: email.value,
        telefone: telefone.value,
        senha: senha.value
    };

    await fetch(`${API_URL}/cadastro`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(informacao)
    });

    alert("Cadastro realizado com sucesso!");
    window.location.href = "./index.html";
});