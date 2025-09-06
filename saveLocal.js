import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = 3000;

// Configuração completa do CORS
app.use(cors({
  origin: "*",               // permite qualquer origem
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const storageDir = path.resolve("./Storage");

// Cria a pasta Storage se não existir
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir);
}

// Endpoint para salvar livro
app.post("/salvar", (req, res) => {
  const livro = req.body;
  const filePath = path.join(storageDir, `${livro.titulo}.json`);
  fs.writeFileSync(filePath, JSON.stringify(livro, null, 2));
  console.log(`Livro salvo: ${livro.titulo}`);
  res.setHeader("Access-Control-Allow-Origin", "*"); // reforço
  res.json({ ok: true });
});

// Responde ao preflight OPTIONS
app.options("/salvar", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
