const API_URL = "https://saudemais-programacao-distribuida.onrender.com";

document.getElementById("formInformacao").addEventListener("submit", async function (e) {
    e.preventDefault();

    const btnEnviar = document.getElementById("btnEnviar");

    const informacao = {
        nome: document.getElementById("nome").value.trim(),
        dataNascimento: document.getElementById("dataNascimento").value,
        cpf: document.getElementById("cpf").value.trim(),
        email: document.getElementById("email").value.trim(),
        telefone: document.getElementById("telefone").value.trim(),
        senha: document.getElementById("senha").value
    };

    try {
        btnEnviar.disabled = true;
        btnEnviar.textContent = "Cadastrando...";

        const resposta = await fetch(`${API_URL}/cadastro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(informacao)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao realizar cadastro.");
        }

        alert("Cadastro realizado com sucesso!");
        window.location.href = "./index.html";

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível realizar o cadastro. Verifique a conexão com o servidor.");
    } finally {
        btnEnviar.disabled = false;
        btnEnviar.textContent = "Criar cadastro";
    }
});
