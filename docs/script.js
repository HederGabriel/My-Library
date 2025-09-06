const user = "HederGabriel";
const repo = "My-Library";
const branch = "main";
const folder = "Storage";

let livros = [];

// Detecta se está rodando local (file:// ou localhost)
const isLocal = location.hostname === "localhost" || location.protocol === "file:";

// Salvar livro (se local → usa Node, se remoto → só avisa)
async function salvarLivro() {
  const livro = {
    id: Date.now(),
    titulo: document.getElementById("titulo").value.trim(),
    autor: document.getElementById("autor").value.trim(),
    serie: document.getElementById("serie").value.trim(),
    numeroSerie: document.getElementById("numeroSerie").value,
    paginas: document.getElementById("paginas").value,
    sinopse: document.getElementById("sinopse").value.trim(),
    status: document.getElementById("status").value,
  };

  if (isLocal) {
    // Se local → envia para script Node
    await fetch("http://localhost:3000/salvar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(livro)
    });
  } else {
    alert("Somente leitura no GitHub Pages. Para adicionar livros, use o notebook.");
  }

  livros.push(livro);
  renderEstante();
  fecharCadastro();
}

// Carregar livros do repositório (sempre pelo GitHub)
async function carregarLivros() {
  const url = `https://api.github.com/repos/${user}/${repo}/contents/${folder}?ref=${branch}`;
  const response = await fetch(url);
  const files = await response.json();

  livros = [];
  for (let file of files) {
    if (file.name.endsWith(".json")) {
      const res = await fetch(file.download_url);
      const livro = await res.json();
      livros.push(livro);
    }
  }
  renderEstante();
}

// Renderizar estante
function renderEstante() {
  const estante = document.getElementById("estante");
  estante.innerHTML = "";
  livros.forEach(l => {
    const div = document.createElement("div");
    div.className = "livro";
    div.innerText = l.titulo;
    div.title = `${l.autor} • ${l.paginas} páginas`;
    estante.appendChild(div);
  });
}

function abrirCadastro() {
  document.getElementById("modalCadastro").style.display = "flex";
}

function fecharCadastro() {
  document.getElementById("modalCadastro").style.display = "none";
}

// Buscar livro no Google Books
function buscarLivro() {
  const query = document.getElementById("searchBook").value;
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
    .then(res => res.json())
    .then(data => {
      if (data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;
        document.getElementById("titulo").value = book.title || "";
        document.getElementById("autor").value = (book.authors || []).join(", ");
        document.getElementById("paginas").value = book.pageCount || "";
        document.getElementById("sinopse").value = book.description || "";
        abrirCadastro();
      } else {
        alert("Livro não encontrado, cadastre manualmente.");
        abrirCadastro();
      }
    });
}

carregarLivros();
