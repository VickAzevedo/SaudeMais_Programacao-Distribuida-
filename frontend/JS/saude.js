const API_URL = "http://localhost:3000";

document.getElementById("cadastroForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const dadosSaude = {
        nomeCompleto: document.getElementById("nomeCompleto").value,
        idade: document.getElementById("idade").value,
        exercicioRegular: document.getElementById("exercicioRegular").value,
        dietaEquilibrada: document.getElementById("dietaEquilibrada").value,
        checkupsRegulares: document.getElementById("checkupsRegulares").value,
        vacinas: document.getElementById("vacinas").value,
        saudeMental: document.getElementById("saudeMental").value,
        higiene: document.getElementById("higiene").value
    };

    await fetch(`${API_URL}/saude`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosSaude)
    });

    alert("Dados salvos!");
    atualizarTabela();
});

async function atualizarTabela() {
    const resposta = await fetch(`${API_URL}/saude`);
    const dados = await resposta.json();

    const tabela = document.querySelector("#dadosTable tbody");
    tabela.innerHTML = "";

    dados.forEach((item) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${item.nomeCompleto}</td>
            <td>${item.idade}</td>
            <td>${item.exercicioRegular}</td>
            <td>${item.dietaEquilibrada}</td>
            <td>${item.checkupsRegulares}</td>
            <td>${item.vacinas}</td>
            <td>${item.saudeMental}</td>
            <td>${item.higiene}</td>
            <td>
                <button onclick="removerSaude('${item._id}')">Excluir</button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}

async function removerSaude(id) {
    await fetch(`${API_URL}/saude/${id}`, {
        method: "DELETE"
    });

    atualizarTabela();
}

window.onload = atualizarTabela;