function obterUsuarioLogado() {
    const usuario = localStorage.getItem("usuarioLogado");

    if (!usuario) {
        return null;
    }

    return JSON.parse(usuario);
}

function estaLogado() {
    return sessionStorage.getItem("sessionActive") === "true" && obterUsuarioLogado() !== null;
}

function protegerPagina() {
    if (!estaLogado()) {
        esconderTabela();
        alert("Você precisa fazer login para acessar esta página.");
        window.location.href = "./index.html";
    }
}

function esconderTabela() {
    const tabelaCard = document.querySelector(".table-card");
    const tabelaAntiga = document.getElementById("tabela");

    if (tabelaCard) {
        tabelaCard.style.display = "none";
    }

    if (tabelaAntiga) {
        tabelaAntiga.style.display = "none";
    }
}

function mostrarUsuarioNoTopo() {
    const usuario = obterUsuarioLogado();
    const campoNome = document.getElementById("nomeUsuario");
    const btnSair = document.getElementById("btnSair");

    if (!campoNome) {
        return;
    }

    if (usuario) {
        campoNome.textContent = `Olá, ${usuario.nome}`;
    } else {
        campoNome.textContent = "";
    }

    if (btnSair && !usuario) {
        btnSair.style.display = "none";
    }
}

function sair() {
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("loggedUser");
    sessionStorage.removeItem("sessionActive");
    sessionStorage.removeItem("token");

    window.location.href = "./index.html";
}

document.addEventListener("DOMContentLoaded", function () {
    const paginaProtegida = document.body.dataset.protegida === "true";

    if (paginaProtegida) {
        protegerPagina();
    }

    mostrarUsuarioNoTopo();
});