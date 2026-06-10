const API_URL = window.API_URL;

const formConsulta = document.getElementById("formInformacao");
const tabela = document.querySelector("#dadosTable tbody");

formConsulta.addEventListener("submit", async function (e) {
    e.preventDefault();

    const usuario = obterUsuarioLogado();

    if (!usuario || !usuario.id) {
        alert("Você precisa estar logado para agendar uma consulta.");
        window.location.href = "./index.html";
        return;
    }

    const botao = formConsulta.querySelector("button");

    const consulta = {
        usuarioId: usuario.id,
        usuarioNome: usuario.nome,
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

        const retorno = await resposta.json();

        if (!resposta.ok) {
            console.log("Erro retornado pela API:", retorno);
            throw new Error(retorno.mensagem || "Erro ao cadastrar consulta.");
        }

        alert("Consulta cadastrada!");
        formConsulta.reset();

        if (tabela) {
            atualizarTabela();
        }

    } catch (erro) {
        console.error("Erro ao cadastrar consulta:", erro);
        alert("Não foi possível cadastrar a consulta. Verifique o console.");
    } finally {
        botao.disabled = false;
        botao.textContent = "Agendar consulta";
    }
});

async function atualizarTabela() {
    const usuario = obterUsuarioLogado();

    if (!usuario || !usuario.id) {
        esconderTabela();
        return;
    }

    if (!tabela) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/consultas/usuario/${usuario.id}`);

        const dados = await resposta.json();

        if (!resposta.ok) {
            console.log("Erro retornado pela API:", dados);
            throw new Error("Erro ao buscar consultas.");
        }

        tabela.innerHTML = "";

        if (dados.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6">Você ainda não possui consultas cadastradas.</td>
                </tr>
            `;
            return;
        }

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
        console.error("Erro ao carregar consultas:", erro);

        if (tabela) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6">Não foi possível carregar suas consultas.</td>
                </tr>
            `;
        }
    }
}

async function removerConsulta(id) {
    const usuario = obterUsuarioLogado();

    if (!usuario || !usuario.id) {
        alert("Você precisa estar logado.");
        window.location.href = "./index.html";
        return;
    }

    const confirmar = confirm("Deseja realmente excluir esta consulta?");

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/consultas/${id}/usuario/${usuario.id}`, {
            method: "DELETE"
        });

        const retorno = await resposta.json();

        if (!resposta.ok) {
            console.log("Erro retornado pela API:", retorno);
            throw new Error("Erro ao remover consulta.");
        }

        atualizarTabela();

    } catch (erro) {
        console.error("Erro ao excluir consulta:", erro);
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

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

document.addEventListener("DOMContentLoaded", atualizarTabela);