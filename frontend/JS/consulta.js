const API_URL = "http://localhost:3000";

let especialidade = document.getElementById("especialidade");
let exame = document.getElementById("exame");
let data = document.getElementById("data");
let horario = document.getElementById("horario");
let localConsulta = document.getElementById("local");
let contato = document.getElementById("contato");

document.getElementById("formInformacao").addEventListener("submit", async function (e) {
    e.preventDefault();

    const consulta = {
        especialidade: especialidade.value,
        exame: exame.value,
        data: data.value,
        horario: horario.value,
        local: localConsulta.value,
        contato: contato.value
    };

    await fetch(`${API_URL}/consultas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(consulta)
    });

    alert("Consulta cadastrada!");
    atualizarTabela();
});

async function atualizarTabela() {
    const resposta = await fetch(`${API_URL}/consultas`);
    const dados = await resposta.json();

    const tabela = document.querySelector("#dadosTable tbody");
    tabela.innerHTML = "";

    dados.forEach((consulta) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${consulta.especialidade}</td>
            <td>${consulta.exame}</td>
            <td>${consulta.horario}</td>
            <td>${consulta.data}</td>
            <td>${consulta.local}</td>
            <td>
                <button onclick="removerConsulta('${consulta._id}')">Excluir</button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}

async function removerConsulta(id) {
    await fetch(`${API_URL}/consultas/${id}`, {
        method: "DELETE"
    });

    atualizarTabela();
}

window.onload = atualizarTabela;