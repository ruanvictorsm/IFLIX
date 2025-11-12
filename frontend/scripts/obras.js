const tbody = document.querySelector("#conteudos tbody");

function carregarConteudo() {
    tbody.innerHTML = "";
    fetch('http://localhost:3000/api/conteudo')
        .then(res => res.json())
        .then(data => {
            data.forEach(conteudo => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${conteudo.titulo}</td>
                    <td>${conteudo.genero}</td>
                    <td>${conteudo.tipo}</td>
                    <td><img src="${conteudo.url}" width="300" height="300"></td>
                    <td><button class="editar" style="background-color:green; color:white; border-radius:10px; cursor:pointer;">Editar</button></td>
                    <td><button class="excluir" style="background-color:red; color:white; border-radius:10px; cursor:pointer;"">Excluir</button></td>
                `;
                
                
                tr.querySelector(".editar").addEventListener("click", () => editarConteudo(conteudo));

                
                tr.querySelector(".excluir").addEventListener("click", () => excluirConteudo(conteudo.id_cont));

                tbody.appendChild(tr);
            });
        })
        .catch(err => console.error("Erro ao carregar conteúdos:", err));
}

function excluirConteudo(id_cont) {
    if (!confirm("Tem certeza que deseja excluir este conteúdo?")) return;

    fetch(`http://localhost:3000/api/conteudo/${id_cont}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || "Conteúdo excluído com sucesso!");
        carregarConteudo();
    })
    .catch(err => console.error("Erro:", err));
}

// === EDITAR CONTEÚDO ===
function editarConteudo(conteudo) {
  const novoTitulo = prompt("Novo título:", conteudo.titulo);
  if (novoTitulo === null) return;

  const novoGenero = prompt("Novo gênero:", conteudo.genero);
  if (novoGenero === null) return;

  const novoTipo = prompt("Novo tipo:", conteudo.tipo);
  if (novoTipo === null) return;

  const novaUrl = prompt("Nova URL do poster:", conteudo.url);
  if (novaUrl === null) return;

  const novoTrailer = prompt("Nova Url do trailer/resumo:", conteudo.trailer);
  if (novoTrailer === null) return;

  const novaResenha = prompt("Nova Url do filme/resenha/audiobook/análise:", conteudo.resenha);
  if (novaResenha === null) return;

  const novaDescricao = prompt("Nova descrição da obra:", conteudo.descricao);
  if (novaDescricao === null) return;


  const dadosAtualizados = {
    titulo: novoTitulo,
    genero: novoGenero,
    tipo: novoTipo,
    url: novaUrl,
    trailer: novoTrailer,
    resenha: novaResenha,
    descricao: novaDescricao,
    matricula_ger: conteudo.matricula_ger || 2023,
  };

  fetch(`http://localhost:3000/api/conteudo/${conteudo.id_cont}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAtualizados),
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao atualizar conteúdo");
      return res.json();
    })
    .then(data => {
      alert(`Obra atualizada com sucesso!`);
      carregarConteudo();
    })
    .catch(err => {
      console.error("Erro na atualização:", err);
      alert("Falha ao atualizar conteúdo.");
    });
}

carregarConteudo();
