const socket = io("http://localhost:3000");

const matricula = localStorage.getItem("matricula");
const matriculaGer = localStorage.getItem("matricula_ger");

if (!matricula || !matriculaGer) {
  alert("Sessão inválida. Faça login novamente.");
  location.href = "/frontend/public_html/logingerente.html";
}

let chatId = null;
const mensagensDiv = document.getElementById("mensagens");
const input = document.getElementById("mensagemInput");

async function carregarChat() {
  const res = await fetch(`http://localhost:3000/api/chat/${matriculaGer}`);
  const dados = await res.json();

  mensagensDiv.innerHTML = "";

  dados.forEach(m => renderMensagem(m.remetente, m.mensagem));
}

function renderMensagem(remetente, texto) {
  const div = document.createElement("div");
  div.classList.add("msg");

  if (remetente === matricula) {
    div.classList.add("eu");
  } else {
    div.classList.add("outro");
  }

  div.textContent = texto;
  mensagensDiv.appendChild(div);
  mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
}

async function enviar() {
  const texto = input.value.trim();
  if (!texto) return;

  await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      matricula_ger: matriculaGer,
      remetente: matricula,
      mensagem: texto
    })
  });

  window.location.reload();
  
}

socket.on("nova_mensagem", (msg) => {
  renderMensagem(msg.remetente, msg.mensagem);
});

carregarChat();
