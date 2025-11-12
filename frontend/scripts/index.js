var formlogin = document.querySelector('#login')
var formcadastrar = document.querySelector('#cadastrar')
var botaocor = document.querySelector('.botaocor')

document.querySelector('#botaologin')
    .addEventListener('click', () => {
        login.style.left = "25px"
        cadastrar.style.left = "450px"
        botaocor.style.left = "0px"

    })
document.querySelector('#botaocadastre')
    .addEventListener('click', () => {
        login.style.left = "-450px"
        cadastrar.style.left = "25px"
        botaocor.style.left = "110px"

    })

const login = document.getElementById("login");
const loginMatricula = document.getElementById("bm");
const loginSenha = document.getElementById("bs");

login.addEventListener("submit", async (e) => {
  e.preventDefault();

  const matricula = loginMatricula.value.trim();
  const senha = loginSenha.value;

  if (!matricula || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matricula, senha })
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.mensagem || "Matrícula ou senha incorreta!");
      return;
    }

    localStorage.setItem("usuarioLogado", JSON.stringify(result.usuario));

    alert("Login realizado com sucesso!");
    window.location.href = "projeto.html";

  } catch (err) {
    console.error("Erro no login:", err);
    alert("Erro ao tentar fazer login. Verifique o servidor.");
  }
});



const cadastrar = document.getElementById("cadastrar");
const bm = document.getElementById("bmc");
const bn = document.getElementById("bnc");
const bs = document.getElementById("bsc");

cadastrar.addEventListener('submit', function (e) {
    e.preventDefault();

    // Pega o radio marcado no momento do submit
    const pergunta = document.querySelector('input[name="pergunta1"]:checked');

    if (!pergunta) {
        alert("Por favor, selecione o período.");
        return;
    }

    const novoUsuario = {
        matricula: bm.value.trim(),
        nome: bn.value.trim(),
        senha: bs.value,
        ano: pergunta.value,
        matricula_ger: 2023
    };

    // Verifica campos obrigatórios
    if (!novoUsuario.matricula || !novoUsuario.nome || !novoUsuario.senha) {
        alert("Por favor, preencha Matrícula, Nome e Senha.");
        return;
    }

    fetch('http://localhost:3000/api/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario)
    })
        .then(res => {
            if (!res.ok) {
                return res.json().then(error => { throw new Error(error.mensagem || "Falha ao adicionar usuário."); });
            }
            return res.json();
        })
        .then(data => {
            cadastrar.reset();
            alert(`Seja bem-vindo ao IFLIX, usuário(a) ${data.nome}: Realize o login e descubra os melhores repertórios socioculturais para a sua redação!`);
            window.location.href = 'index.html';
        })
        .catch(err => {
            console.error("Erro no envio do POST:", err.message);
            alert(`Erro ao adicionar usuário: ${err.message}`);
        });
});
