const API_URL = "https://saudemais-programacao-distribuida.onrender.com";

const formSaude = document.getElementById("cadastroForm");
const tabela = document.querySelector("#dadosTable tbody");

formSaude.addEventListener("submit", async function (e) {
    e.preventDefault();

    const botao = formSaude.querySelector("button");

    const dadosSaude = {
        nomeCompleto: document.getElementById("nomeCompleto").value.trim(),
        idade: document.getElementById("idade").value,
        exercicioRegular: document.getElementById("exercicioRegular").value,
        dietaEquilibrada: document.getElementById("dietaEquilibrada").value,
        checkupsRegulares: document.getElementById("checkupsRegulares").value,
        vacinas: document.getElementById("vacinas").value,
        saudeMental: document.getElementById("saudeMental").value.trim(),
        higiene: document.getElementById("higiene").value
    };

    try {
        botao.disabled = true;
        botao.textContent = "Salvando...";

        const resposta = await fetch(`${API_URL}/saude`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosSaude)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao salvar dados de saúde.");
        }

        alert("Dados salvos!");
        formSaude.reset();
        atualizarTabela();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível salvar os dados.");
    } finally {
        botao.disabled = false;
        botao.textContent = "Salvar informações";
    }
});

async function atualizarTabela() {
    try {
        const resposta = await fetch(`${API_URL}/saude`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados de saúde.");
        }

        const dados = await resposta.json();

        tabela.innerHTML = "";

        dados.forEach((item) => {
            const linha = document.createElement("tr");

            criarCelula(linha, item.nomeCompleto);
            criarCelula(linha, item.idade);
            criarCelula(linha, item.exercicioRegular);
            criarCelula(linha, item.dietaEquilibrada);
            criarCelula(linha, item.checkupsRegulares);
            criarCelula(linha, item.vacinas);
            criarCelula(linha, item.saudeMental);
            criarCelula(linha, item.higiene);

            const colunaAcao = document.createElement("td");
            const botaoExcluir = document.createElement("button");

            botaoExcluir.textContent = "Excluir";
            botaoExcluir.addEventListener("click", () => removerSaude(item._id));

            colunaAcao.appendChild(botaoExcluir);
            linha.appendChild(colunaAcao);

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error(erro);
        tabela.innerHTML = `
            <tr>
                <td colspan="9">Não foi possível carregar os registros.</td>
            </tr>
        `;
    }
}

async function removerSaude(id) {
    const confirmar = confirm("Deseja realmente excluir este registro?");

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/saude/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir registro.");
        }

        atualizarTabela();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível excluir o registro.");
    }
}

function criarCelula(linha, texto) {
    const celula = document.createElement("td");
    celula.textContent = texto || "-";
    linha.appendChild(celula);
}

document.addEventListener("DOMContentLoaded", atualizarTabela);
