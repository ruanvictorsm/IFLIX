import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import {
  addUsuario,
  getAllUsers,
  excluirUsuario,
  updateUsuario
} from "./db/models/userModels.js";

import {
  getAllConteudo,
  addConteudo,
  excluirConteudo,
  updateConteudo
} from "./db/models/conteudoModels.js";

import * as Chat from "./db/models/chatmodels.js";

const { getChatId } = Chat;
import * as Mensagem from "./db/models/mensagemModels.js";

const { listarMensagens, enviarMensagem } = Mensagem;

const APP = express();
const PORT = 3000;

const server = http.createServer(APP);
const io = new Server(server, {
  cors: { origin: "*" }
});

APP.use(express.json());
APP.use(cors());


APP.get("/api/usuarios", async (req, res) => {
  try {
    const usuarios = await getAllUsers();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar usuários." });
  }
});

APP.post("/api/usuario", async (req, res) => {
  const { matricula, nome, senha, matricula_ger, ano } = req.body;

  if (!matricula || !nome || !senha || !matricula_ger || !ano) {
    return res.status(400).json({ mensagem: "Campos obrigatórios ausentes." });
  }

  try {
    const novo = await addUsuario(matricula, nome, senha, matricula_ger, ano);
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao adicionar usuário." });
  }
});

APP.post("/api/login", async (req, res) => {
  const { matricula, senha } = req.body;

  if (!matricula || !senha) {
    return res.status(400).json({ mensagem: "Matrícula e senha obrigatórios." });
  }

  try {
    const users = await getAllUsers();
    const usuario = users.find(
      u => u.matricula === matricula && u.senha === senha
    );

    if (!usuario) {
      return res.status(401).json({ mensagem: "Login inválido." });
    }

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro no login." });
  }
});

APP.delete("/api/usuarios/:matricula", async (req, res) => {
  try {
    await excluirUsuario(req.params.matricula);
    res.json({ message: "Usuário excluído com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao excluir usuário" });
  }
});

APP.put("/api/usuarios/:matricula", async (req, res) => {
  try {
    const atualizado = await updateUsuario(
      req.params.matricula,
      req.body.nome,
      req.body.senha,
      req.body.ano
    );
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao atualizar usuário." });
  }
});

APP.get("/api/conteudo", async (req, res) => {
  try {
    const conteudos = await getAllConteudo();
    res.json(conteudos);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar conteúdos" });
  }
});

APP.post("/api/conteudo", async (req, res) => {
  try {
    const novo = await addConteudo(
      req.body.titulo,
      req.body.tipo,
      req.body.genero,
      req.body.matricula_ger,
      req.body.url,
      req.body.trailer,
      req.body.resenha,
      req.body.descricao,
      req.body.plataformas,
      req.body.temas
    );
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao adicionar conteúdo." });
  }
});

APP.delete("/api/conteudo/:id_cont", async (req, res) => {
  try {
    await excluirConteudo(req.params.id_cont);
    res.json({ message: "Conteúdo excluído com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao excluir conteúdo" });
  }
});

APP.put("/api/conteudo/:id_cont", async (req, res) => {
  try {
    const atualizado = await updateConteudo({
      id: req.params.id_cont,
      ...req.body
    });
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao atualizar conteúdo." });
  }
});


const ADMIN_ID = "20231214010013";

APP.get("/api/chat/:matricula_ger", async (req, res) => {
  try {
    const chatId = await getChatId(req.params.matricula_ger, ADMIN_ID);

    if (!chatId) {
      return res.status(404).json({ mensagem: "Chat não encontrado." });
    }

    const mensagens = await listarMensagens(chatId);
    res.json(mensagens);

  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar mensagens." });
  }
});

APP.post("/api/chat", async (req, res) => {
  console.log("BODY RECEBIDO:", req.body);

  const { matricula_ger, remetente, mensagem } = req.body;

  try {
    const chatId = await getChatId(matricula_ger, "20231214010013");
    console.log("CHAT ID:", chatId);

    await enviarMensagem(chatId, remetente, mensagem);
    res.status(201).json({ ok: true });

  } catch (err) {
    console.error("ERRO REAL:", err);
    res.status(500).json({ erro: "Falha ao enviar mensagem" });
  }
});

io.on("connection", (socket) => {
  console.log("🟢 Conectado:", socket.id);

  socket.on("entrar_chat", (chatId) => {
    socket.join("chat_" + chatId);
  });

  socket.on("enviar_mensagem", async ({ chatId, remetente, mensagem }) => {
    await enviarMensagem(chatId, remetente, mensagem);

    io.to("chat_" + chatId).emit("nova_mensagem", {
      remetente,
      mensagem
    });
  });


  socket.on("disconnect", () => {
    console.log("🔴 Desconectado:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Servidor rodando em http://localhost:" + PORT);
});
