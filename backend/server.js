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
  especialidade: String,
  exame: String,
  data: String,
  horario: String,
  local: String,
  contato: String
});

const saudeSchema = new mongoose.Schema({
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

app.post("/cadastro", async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao cadastrar usuario" });
  }
});

app.get("/cadastro", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar usuarios" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { nome, senha } = req.body;
    const usuario = await Usuario.findOne({ nome, senha });
    if (!usuario) {
      return res.status(401).json({ mensagem: "Usuario ou senha incorretos" });
    }
    res.json({ mensagem: "Login realizado", usuario });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao fazer login" });
  }
});

app.post("/consultas", async (req, res) => {
  try {
    const consulta = await Consulta.create(req.body);
    res.json(consulta);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao cadastrar consulta" });
  }
});

app.get("/consultas", async (req, res) => {
  try {
    const consultas = await Consulta.find();
    res.json(consultas);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar consultas" });
  }
});

app.delete("/consultas/:id", async (req, res) => {
  try {
    await Consulta.findByIdAndDelete(req.params.id);
    res.json({ mensagem: "Consulta removida" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao remover consulta" });
  }
});

app.post("/saude", async (req, res) => {
  try {
    const dados = await Saude.create(req.body);
    res.json(dados);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao salvar dados de saude" });
  }
});

app.get("/saude", async (req, res) => {
  try {
    const dados = await Saude.find();
    res.json(dados);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar dados de saude" });
  }
});

app.delete("/saude/:id", async (req, res) => {
  try {
    await Saude.findByIdAndDelete(req.params.id);
    res.json({ mensagem: "Registro removido" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao remover registro" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando");
});
