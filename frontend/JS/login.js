async function login(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const senha = document.getElementById("senha").value;
    const botao = event.target.querySelector("button");

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

        const dados = await resposta.json();

        const usuario = {
            id: dados.usuario.id || dados.usuario._id,
            nome: dados.usuario.nome
        };

        if (!usuario.id) {
            alert("Erro: o servidor não retornou o ID do usuário.");
            console.log("Resposta recebida do servidor:", dados);
            return;
        }

        sessionStorage.setItem("sessionActive", "true");
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        localStorage.setItem("loggedUser", usuario.nome);

        if (dados.token) {
            sessionStorage.setItem("token", dados.token);
        }

        alert("Login bem-sucedido!");
        window.location.href = "./site.html";

    } catch (erro) {
        console.error("Erro no login:", erro);
        alert("Erro ao conectar com o servidor.");
    } finally {
        botao.disabled = false;
        botao.textContent = "Entrar";
    }
}