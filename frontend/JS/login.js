const API_URL = "https://SEU-BACKEND.onrender.com";

async function login(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const senha = document.getElementById("senha").value;
    const botao = event.target.querySelector("button");

    if (!nome || !senha) {
        alert("Preencha usuário e senha.");
        return;
    }

    try {
        botao.disabled = true;
        botao.textContent = "Entrando...";

        const resposta = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, senha })
        });

        if (!resposta.ok) {
            alert("Usuário ou senha incorretos.");
            return;
        }

        const dados = await resposta.json().catch(() => null);

        sessionStorage.setItem("sessionActive", "true");
        localStorage.setItem("loggedUser", nome);

        if (dados && dados.token) {
            sessionStorage.setItem("token", dados.token);
        }

        alert("Login bem-sucedido!");
        window.location.href = "./site.html";

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
        botao.disabled = false;
        botao.textContent = "Entrar";
    }
}