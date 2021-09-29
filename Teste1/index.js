// Instanciando os módulos

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const mongoose = require("mongoose");

// Conectando à base de dados
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/Teste1");

//Criando o esquema da base de dados
let alunosSchema = new mongoose.Schema({
  nome: String,
  email: String,
  nascimento: Date,
  matricula: String
});

// Criando o modelo da base de dados
let Aluno = mongoose.model("Aluno", alunosSchema);

// Criando uma variável global para receber os dados do arquivo JSON
//let alunos = "";

// Criando o app com express
const app = express();

// Preparando o bodyParser

app.use(bodyParser.urlencoded({
  extend: true
}));

// Criando a rota base
app.get("/aluno/cadastrar", function(req, res) {
  res.sendFile(__dirname + "/cadastrar.html");
});

// Criando a rota post
app.post("/aluno/cadastrar", function(req, res) {

  // Criando um objeto com as informações de cadastro
  const aluno = {
    nome: req.body.nome,
    email: req.body.email,
    nascimento: req.body.dataDeNascimento,
    matricula: req.body.matricula
  };

  // Criando um novo esquema com os dados do aluno
  let novoAluno = new Aluno(aluno);

  // Salvando o item na base de dados
  novoAluno.save()
    .then(item => {
      res.send("item saved to database")
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });



  // Transformando o objeto em string
  //const json = JSON.stringify(aluno);

  // Criando o arquivo json com as informações do cadastro
  //fs.appendFile("alunos.json", json, 'utf8', (err) => {
  //  if (err) throw err;
  //  console.log('O arquivo foi salvo!');
  //  return;
  //});

});

//Criando a rota para acessar a lista de alunos
app.get("/aluno/listar", function(req, res) {

  // Listando os alunos cadastrados na base de dados
  Aluno.find({}, function(err, docs) {
    res.send("<p>" + docs + "</p>");
  })

  // Lendo o arquivo e exibindo no browser
  //fs.readFile(__dirname + "/alunos.json", "utf8", (err, data) => {
  //  if (err) throw err;
  //  alunos = data;s
  //});

  //  res.send(alunos);
});



app.listen(3000, function() {
  console.log("Servidor iniciado na porta 3000");
})
