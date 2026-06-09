const API_URL = "http://localhost:3000";

async function login(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const senha = document.getElementById("senha").value;

    const resposta = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, senha })
    });

    if (resposta.ok) {
        alert("Login bem-sucedido!");
        sessionStorage.setItem("sessionActive", "true");
        localStorage.setItem("loggedUser", nome);
        window.location.href = "./site.html";
    } else {
        alert("Usuário ou senha incorretos.");
    }
}