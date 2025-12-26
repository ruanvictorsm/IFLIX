const formcont = document.getElementById("form-cont");
const inputTitulo = document.getElementById("titulo");
const inputGenero = document.getElementById("selectgen");
const inputUrl = document.getElementById("poster");
const inpuTrailer = document.getElementById("trailer");
const inputResenha = document.getElementById("resenha");
const selectTipo = document.getElementById("select");
const textarea = document.getElementById("descricao");
const temas = document.getElementById("tema");

// Adicionar conteúdos
formcont.addEventListener('submit', function (e) {
    e.preventDefault();

    const plataformasSelecionadas = [...document.querySelectorAll('input[name="pergunta1"]:checked')]
        .map(e => e.value);

    const novoConteudo = {
        titulo: inputTitulo.value.trim(),
        genero: inputGenero.value,
        tipo: selectTipo.value,
        url: inputUrl.value.trim(),
        trailer: inpuTrailer.value.trim(),
        resenha: inputResenha.value.trim(),
        descricao: textarea.value.trim(),
        temas: temas.value,
        plataformas: plataformasSelecionadas,
        matricula_ger: 2023
    };


    if (
        !novoConteudo.titulo ||
        !novoConteudo.tipo ||
        !novoConteudo.genero ||
        !novoConteudo.url ||
        !novoConteudo.trailer ||
        !novoConteudo.resenha ||
        !novoConteudo.descricao ||
        !novoConteudo.temas ||
        novoConteudo.plataformas.length === 0
    ) {
        alert("Por favor, preencha todos os campos necessários.");
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











