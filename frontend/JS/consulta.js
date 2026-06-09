const API_URL = "https://SEU-BACKEND.onrender.com";

const formConsulta = document.getElementById("formInformacao");
const tabela = document.querySelector("#dadosTable tbody");

formConsulta.addEventListener("submit", async function (e) {
    e.preventDefault();

    const botao = formConsulta.querySelector("button");

    const consulta = {
        especialidade: document.getElementById("especialidade").value.trim(),
        exame: document.getElementById("exame").value.trim(),
        data: document.getElementById("data").value,
        horario: document.getElementById("horario").value,
        local: document.getElementById("local").value.trim(),
        contato: document.getElementById("contato").value.trim()
    };

    try {
        botao.disabled = true;
        botao.textContent = "Agendando...";

        const resposta = await fetch(`${API_URL}/consultas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(consulta)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar consulta.");
        }

        alert("Consulta cadastrada!");
        formConsulta.reset();
        atualizarTabela();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível cadastrar a consulta.");
    } finally {
        botao.disabled = false;
        botao.textContent = "Agendar consulta";
    }
});

async function atualizarTabela() {
    try {
        const resposta = await fetch(`${API_URL}/consultas`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar consultas.");
        }

        const dados = await resposta.json();

        tabela.innerHTML = "";

        dados.forEach((consulta) => {
            const linha = document.createElement("tr");

            criarCelula(linha, consulta.especialidade);
            criarCelula(linha, consulta.exame);
            criarCelula(linha, consulta.horario);
            criarCelula(linha, formatarData(consulta.data));
            criarCelula(linha, consulta.local);

            const colunaAcao = document.createElement("td");
            const botaoExcluir = document.createElement("button");

            botaoExcluir.textContent = "Excluir";
            botaoExcluir.addEventListener("click", () => removerConsulta(consulta._id));

            colunaAcao.appendChild(botaoExcluir);
            linha.appendChild(colunaAcao);

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error(erro);
        tabela.innerHTML = `
            <tr>
                <td colspan="6">Não foi possível carregar as consultas.</td>
            </tr>
        `;
    }
}

async function removerConsulta(id) {
    const confirmar = confirm("Deseja realmente excluir esta consulta?");

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/consultas/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao remover consulta.");
        }

        atualizarTabela();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível excluir a consulta.");
    }
}

function criarCelula(linha, texto) {
    const celula = document.createElement("td");
    celula.textContent = texto || "-";
    linha.appendChild(celula);
}

function formatarData(data) {
    if (!data) {
        return "-";
    }

    const partes = data.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

document.addEventListener("DOMContentLoaded", atualizarTabela);
