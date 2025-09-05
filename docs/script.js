const user = "HederGabriel";   // seu usuário GitHub
const repo = "My-Library";     // repositório
const branch = "main";         // branch
const folder = "Storage";      // pasta dos livros
const token = "SEU_GITHUB_TOKEN"; // ⚠️ coloque seu Personal Access Token com permissão de escrita

let livros = [];

// Salvar livro no GitHub (um JSON por livro)
async function salvarLivroNoGitHub(livro) {
  const path = `${folder}/${livro.titulo}.json`;
  const url = `https://api.github.com/repos/${user}/${repo}/contents/${encodeURIComponent(path)}`;

  const conteudo = btoa(JSON.stringify(livro, null, 2)); // JSON → Base64

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Adicionando livro ${livro.titulo}`,
      content: conteudo
    })
  });

  if (!response.ok) {
    const erro = await response.json();
    console.error("Erro ao salvar:", erro);
    alert("Erro ao salvar livro no GitHub");
    return;
  }

  return await response.json();
}

function salvarLivro() {
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

  // salva no remoto (GitHub)
  salvarLivroNoGitHub(livro).then(() => {
    livros.push(livro);
    localStorage.setItem("livros", JSON.stringify(livros));
    fecharCadastro();
    renderEstante();
  });
}

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

// Buscar livro pelo Google Books
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

renderEstante();
