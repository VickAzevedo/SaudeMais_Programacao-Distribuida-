const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Erro MongoDB:", err));

const usuarioSchema = new mongoose.Schema({
  nome: String,
  dataNascimento: String,
  cpf: String,
  email: String,
  telefone: String,
  senha: String
});

const consultaSchema = new mongoose.Schema({
  usuarioId: {
    type: String,
    required: true
  },
  usuarioNome: String,
  especialidade: String,
  exame: String,
  data: String,
  horario: String,
  local: String,
  contato: String
});

const saudeSchema = new mongoose.Schema({
  usuarioId: {
    type: String,
    required: true
  },
  usuarioNome: String,
  nomeCompleto: String,
  idade: Number,
  exercicioRegular: String,
  dietaEquilibrada: String,
  checkupsRegulares: String,
  vacinas: String,
  saudeMental: String,
  higiene: String
});

const Usuario = mongoose.model("Usuario", usuarioSchema);
const Consulta = mongoose.model("Consulta", consultaSchema);
const Saude = mongoose.model("Saude", saudeSchema);

app.get("/", (req, res) => {
  res.json({ status: "API Saude+ rodando" });
});

/* CADASTRO */

app.post("/cadastro", async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
      usuario: {
        id: usuario._id.toString(),
        nome: usuario.nome,
        email: usuario.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
  }
});

/* LOGIN */

app.post("/login", async (req, res) => {
  try {
    const { nome, senha } = req.body;

    const usuario = await Usuario.findOne({ nome, senha });

    if (!usuario) {
      return res.status(401).json({
        mensagem: "Usuário ou senha incorretos"
      });
    }

    res.json({
      mensagem: "Login realizado com sucesso",
      usuario: {
        id: usuario._id.toString(),
        nome: usuario.nome,
        email: usuario.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao fazer login" });
  }
});

/* CONSULTAS */

app.post("/consultas", async (req, res) => {
  try {
    const {
      usuarioId,
      usuarioNome,
      especialidade,
      exame,
      data,
      horario,
      local,
      contato
    } = req.body;

    if (!usuarioId) {
      return res.status(400).json({
        mensagem: "Usuário não informado"
      });
    }

    const consulta = await Consulta.create({
      usuarioId,
      usuarioNome,
      especialidade,
      exame,
      data,
      horario,
      local,
      contato
    });

    res.status(201).json({
      mensagem: "Consulta cadastrada com sucesso",
      consulta
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao cadastrar consulta" });
  }
});

app.get("/consultas/usuario/:usuarioId", async (req, res) => {
  try {
    const consultas = await Consulta.find({
      usuarioId: req.params.usuarioId
    });

    res.json(consultas);

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar consultas" });
  }
});

app.delete("/consultas/:id/usuario/:usuarioId", async (req, res) => {
  try {
    const resultado = await Consulta.deleteOne({
      _id: req.params.id,
      usuarioId: req.params.usuarioId
    });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({
        mensagem: "Consulta não encontrada para este usuário"
      });
    }

    res.json({ mensagem: "Consulta removida com sucesso" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao remover consulta" });
  }
});

/* SAÚDE PREVENTIVA */

app.post("/saude", async (req, res) => {
  try {
    const {
      usuarioId,
      usuarioNome,
      nomeCompleto,
      idade,
      exercicioRegular,
      dietaEquilibrada,
      checkupsRegulares,
      vacinas,
      saudeMental,
      higiene
    } = req.body;

    if (!usuarioId) {
      return res.status(400).json({
        mensagem: "Usuário não informado"
      });
    }

    const dados = await Saude.create({
      usuarioId,
      usuarioNome,
      nomeCompleto,
      idade,
      exercicioRegular,
      dietaEquilibrada,
      checkupsRegulares,
      vacinas,
      saudeMental,
      higiene
    });

    res.status(201).json({
      mensagem: "Dados de saúde salvos com sucesso",
      dados
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao salvar dados de saúde" });
  }
});

app.get("/saude/usuario/:usuarioId", async (req, res) => {
  try {
    const dados = await Saude.find({
      usuarioId: req.params.usuarioId
    });

    res.json(dados);

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar dados de saúde" });
  }
});

app.delete("/saude/:id/usuario/:usuarioId", async (req, res) => {
  try {
    const resultado = await Saude.deleteOne({
      _id: req.params.id,
      usuarioId: req.params.usuarioId
    });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({
        mensagem: "Registro não encontrado para este usuário"
      });
    }

    res.json({ mensagem: "Registro removido com sucesso" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao remover registro" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando");
});