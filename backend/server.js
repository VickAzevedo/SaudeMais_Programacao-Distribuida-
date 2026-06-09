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

app.post("/cadastro", async (req, res) => {
  const usuario = await Usuario.create(req.body);
  res.json(usuario);
});

app.get("/cadastro", async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

app.post("/login", async (req, res) => {
  const { nome, senha } = req.body;

  const usuario = await Usuario.findOne({ nome, senha });

  if (!usuario) {
    return res.status(401).json({ mensagem: "Usuário ou senha incorretos" });
  }

  res.json({ mensagem: "Login realizado", usuario });
});

app.post("/consultas", async (req, res) => {
  const consulta = await Consulta.create(req.body);
  res.json(consulta);
});

app.get("/consultas", async (req, res) => {
  const consultas = await Consulta.find();
  res.json(consultas);
});

app.delete("/consultas/:id", async (req, res) => {
  await Consulta.findByIdAndDelete(req.params.id);
  res.json({ mensagem: "Consulta removida" });
});

app.post("/saude", async (req, res) => {
  const dados = await Saude.create(req.body);
  res.json(dados);
});

app.get("/saude", async (req, res) => {
  const dados = await Saude.find();
  res.json(dados);
});

app.delete("/saude/:id", async (req, res) => {
  await Saude.findByIdAndDelete(req.params.id);
  res.json({ mensagem: "Registro removido" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando");
});