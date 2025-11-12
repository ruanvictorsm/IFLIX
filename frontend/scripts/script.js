let senhah = document.getElementById("senhah"); 
let nomeh = document.getElementById("nomeh");
let matriculah = document.getElementById("matriculah");
let anoh = document.getElementById("anoh");

const tbody = document.querySelector("#usuarios tbody");


async function carregarUsuarios(ano = "") {
  let url = "http://localhost:3000/api/usuarios";
  if (ano) url += `?ano=${encodeURIComponent(ano)}`;

  tbody.innerHTML = "";

  try {
    const res = await fetch(url);
    const data = await res.json();

    data.forEach(usuario => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${usuario.matricula}</td>
        <td>${usuario.nome}</td>
        <td>${usuario.senha}</td>
        <td>${usuario.ano}</td>
        <td>
          <button 
            class="excluir" 
            style="background-color:red; color:white; border-radius:10px; cursor:pointer;"
            onclick="excluirUsuario('${usuario.matricula}')">
            Excluir
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
  }
}



function excluirUsuario(matricula, recarregar = true) {
  if (!confirm("Tem certeza que deseja excluir esta conta?")) return;

  fetch(`http://localhost:3000/api/usuarios/${matricula}`, {
    method: "DELETE"
  })
    .then(async (res) => {
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: "Erro inesperado no servidor." };
      }

      if (!res.ok) {
        alert(data.message || "Erro ao excluir usuário");
        return;
      }

      alert(data.message);

      // Se for a tela do admin (tem a função carregarUsuarios)
      if (recarregar && typeof carregarUsuarios === "function") {
        carregarUsuarios(); 
      } else {
        // Se for a tela do usuário comum
        localStorage.removeItem("usuarioLogado");
        window.location.href = "/frontend/index.html";
      }
    })
    .catch(err => console.error("Erro ao excluir usuário:", err));
}

// Só chama carregarUsuarios se existir no contexto (admin)
document.addEventListener("DOMContentLoaded", () => {
  if (tbody) {
    carregarUsuarios();
  }
});


