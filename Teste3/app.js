// Requerendo os pacotes
const cheerio = require("cheerio");

const rp = require("request-promise");

const fs = require("fs");

const PDFMerger = require("pdf-merger-js");

const express = require("express");

// Definindo as variáveis que serão usadas
const url = "http://omnissolucoes.com/teste3/"

let nomes = [];

let urls = [];

let codigos = [];

var merger = new PDFMerger();

const app = express();

// Definindo a função para fazer download dos pdfs
async function downloadPDF(pdfURL, outputFilename) {
  let pdfBuffer = await rp.get({
    uri: pdfURL,
    encoding: null
  });
  console.log("Writing downloaded PDF file to " + outputFilename + "...");
  fs.writeFileSync(outputFilename, pdfBuffer);
}

// Começando o webscraping
rp(url)
  .then(function(html) {
    const $ = cheerio.load(html);

    $('li').each(function() {
      const nome = ($(this).text());
      nomes.push(nome);
    });

    $('a').each(function() {
      const codigo = ($(this).attr('codigo'));
      codigos.push(codigo);

      const urlLink = url + ($(this).attr('href'));

// Fazendo download dos pdfs
      downloadPDF(urlLink, ($(this).attr('href')));
      urls.push(urlLink);
    });
  });

// Unindo os pdfs
  (async () => {
    merger.add("FT1.pdf");
    merger.add("FH1.pdf");
    merger.add("AXL.pdf");
    merger.add("ZTT.pdf");
    merger.add("FTR.pdf");
    merger.add("AAA.pdf");
    await merger.save('merged.pdf');
  })();

// Criando o servidor para disponibilizar o link
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Disponibilizando o link
app.get("/download", function(req, res) {
  res.download("merged.pdf");
})
app.listen(3000, function(){
  console.log("Servidor iniciado na porta 3000.");
});
