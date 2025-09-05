let livros = JSON.parse(localStorage.getItem("livros")) || [];

function salvarLivro() {
  const livro = {
    id: Date.now(),
    titulo: document.getElementById("titulo").value,
    autor: document.getElementById("autor").value,
    serie: document.getElementById("serie").value,
    numeroSerie: document.getElementById("numeroSerie").value,
    paginas: document.getElementById("paginas").value,
    sinopse: document.getElementById("sinopse").value,
    status: document.getElementById("status").value,
  };
  livros.push(livro);
  localStorage.setItem("livros", JSON.stringify(livros));
  fecharCadastro();
  renderEstante();
}

function renderEstante() {
  const estante = document.getElementById("estante");
  estante.innerHTML = "";
  livros.forEach(l => {
    const div = document.createElement("div");
    div.className = "livro";
    div.innerText = l.titulo;
    estante.appendChild(div);
  });
}

function abrirCadastro() {
  document.getElementById("modalCadastro").style.display = "flex";
}

function fecharCadastro() {
  document.getElementById("modalCadastro").style.display = "none";
}

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
