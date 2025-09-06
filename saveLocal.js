import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());

const storageDir = path.resolve("./Storage");

// Cria a pasta Storage se não existir
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir);
}

app.post("/salvar", (req, res) => {
  const livro = req.body;
  const filePath = path.join(storageDir, `${livro.titulo}.json`);
  fs.writeFileSync(filePath, JSON.stringify(livro, null, 2));
  console.log(`Livro salvo: ${livro.titulo}`);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
