const formcont = document.getElementById("form-cont");
const inputTitulo = document.getElementById("titulo");
const inputGenero = document.getElementById("selectgen");
const inputUrl = document.getElementById("poster");
const inpuTrailer = document.getElementById("trailer");
const inputResenha = document.getElementById("resenha");
const selectTipo = document.getElementById("select");
const textarea = document.getElementById("descricao");

// Adicionar conteúdos
formcont.addEventListener('submit', function(e) {
    e.preventDefault();

    const novoConteudo = {
        titulo: inputTitulo.value,
        genero: inputGenero.value,
        tipo: selectTipo.value,
        url: inputUrl.value,
        trailer: inpuTrailer.value,
        resenha: inputResenha.value,
        descricao: textarea.value,
        matricula_ger: 2023
    };

    if (!novoConteudo.titulo || !novoConteudo.tipo || !novoConteudo.genero || !novoConteudo.url || !novoConteudo.trailer || !novoConteudo.resenha || !novoConteudo.descricao) {
        alert("Por favor, preencha Título, Gênero, Tipo, Url do poster, Url da trailer, Url do resumo/resenha/filme e a descrição.");
        return;
    }

    fetch('http://localhost:3000/api/conteudo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoConteudo)
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(error => { throw new Error(error.mensagem || "Falha ao adicionar conteúdo."); });
        }
        return res.json();
    })
    .then(data => {
        console.log("Conteúdo adicionado com sucesso:", data);
        alert(`Obra "${data.titulo}" adicionada!`);
        formcont.reset();
    })
    .catch(err => {
        console.error("Erro no envio do POST:", err.message);
        alert(`Erro ao adicionar obra: ${err.message}`);
    });
});











