import express from "express";
import { addUsuario, getAllUsers, excluirUsuario } from "./db/models/userModels.js";
import { getAllConteudo, addConteudo, excluirConteudo, updateConteudo } from "./db/models/conteudoModels.js";
import cors from 'cors';

const APP = express();
const PORT = 3000;

APP.use(express.json());
APP.use(cors());

//  Rota Padrão: Listar Usuários
APP.get("/api/usuarios", async (req, res) => {
  try {
    const usuarios = await getAllUsers();
    res.json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar usuários." });
  }
});


// POST: Adicionar novo Usuário 
APP.post("/api/usuario", async (req, res) => {
    // Se req.body estiver undefined, o middleware express.json() não foi executado.
    const { matricula, nome, senha, matricula_ger, ano } = req.body;

    if (!matricula || !nome || !senha || !matricula_ger || !ano) {
        // Log para depuração
        console.error("Dados faltantes no POST:", req.body); 
        return res.status(400).json({ mensagem: "Matrícula, Nome, Senha, ano e Matrícula do Gerente são obrigatórios." });
    }

    try {
        const novo = await addUsuario(matricula, nome, senha, matricula_ger, ano);
        if (novo) {
             res.status(201).json(novo);
        } else {
             res.status(500).json({ mensagem: "Falha ao inserir no banco de dados." });
        }
       
    } catch (err) {
        console.error(err);
        res.status(500).json({mensagem: "Erro interno do servidor ao adicionar conteúdo."});
    }
});

// POST: Login
APP.post("/api/login", async (req, res) => {
    const { matricula, senha } = req.body;

    if (!matricula || !senha) {
        return res.status(400).json({ mensagem: "Matrícula e senha são obrigatórios." });
    }

    try {
        // Função que busca usuário por matrícula
        const users = await getAllUsers();
        const usuario = users.find(u => u.matricula === matricula && u.senha === senha);

        if (!usuario) {
            return res.status(401).json({ mensagem: "Matrícula ou senha incorretos." });
        }

        // retornar dados do usuário
        res.status(200).json({ mensagem: "Login realizado com sucesso!", usuario });
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensagem: "Erro interno ao realizar login." });
    }
});

// Rota DELETE usando a função importada
APP.delete("/api/usuarios/:matricula", async (req, res) => {
  const { matricula } = req.params;

  try {
    const resultado = await excluirUsuario(matricula);

    // Se o model retorna rowCount (do pg)
    if (resultado && resultado.rowCount === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json({ message: "Usuário excluído com sucesso!" });
  } catch (err) {
    console.error("Erro ao excluir usuário:", err);
    res.status(500).json({ message: "Erro ao excluir usuário" });
  }
});


// ----------------------------------------------------------------------------------------------------------------------------------------------


// GET: Listar todos os Conteúdos
APP.get("/api/conteudo", async (req, res) => {
    try {
        const conteudos = await getAllConteudo();
        res.json(conteudos);
    } catch (err) {
        console.error(err);
        res.status(500).json({mensagem: "Erro ao buscar conteúdos"});
    }
});

//  POST: Adicionar novo Conteúdo 
APP.post("/api/conteudo", async (req, res) => {
    const { titulo, tipo, genero, url, trailer, resenha, descricao, matricula_ger } = req.body;

    if (!titulo || !tipo || !genero || !url || !trailer || !resenha || !descricao || !matricula_ger) {
        console.error("Dados faltantes no POST:", req.body); 
        return res.status(400).json({ mensagem: "Título, Tipo, Gênero, Url do poster, Url da trailer, Url da resenha, descrição e Matrícula do Gerente são obrigatórios." });
    }

    try {
        const novo = await addConteudo(titulo, tipo, genero, matricula_ger, url, trailer, resenha, descricao);
        if (novo) {
             res.status(201).json(novo);
        } else {
             res.status(500).json({ mensagem: "Falha ao inserir no banco de dados." });
        }
       
    } catch (err) {
        console.error(err);
        res.status(500).json({mensagem: "Erro interno do servidor ao adicionar conteúdo."});
    }
});

// Rota DELETE usando a função importada
APP.delete("/api/conteudo/:id_cont", async (req, res) => {
  const { id_cont } = req.params;

  try {
    const sucesso = await excluirConteudo(id_cont);

    res.json({ message: "Conteudo excluído com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao excluir Conteudo" });
  }
});

// Atualizar conteúdo existente 
APP.put("/api/conteudo/:id_cont", async (req, res) => {
  const id = req.params.id_cont;
  const { titulo, tipo, genero, matricula_ger, url, trailer, resenha, descricao } = req.body;

  try {
    const conteudoAtualizado = await updateConteudo({
      id,
      titulo,
      tipo,
      genero,
      matricula_ger,
      url,
      trailer,
      resenha,
      descricao
    });

    if (!conteudoAtualizado) {
      return res.status(404).json({ mensagem: "Conteúdo não encontrado." });
    }

    res.json({
      mensagem: "Conteúdo atualizado com sucesso!",
      conteudo: conteudoAtualizado,
    });
  } catch (err) {
    console.error("Erro ao atualizar conteúdo:", err);
    res.status(500).json({ mensagem: "Erro interno ao atualizar conteúdo." });
  }
});


// Inicialização do Servidor (Única vez) 
APP.listen(PORT, () => {
    console.log("Servidor rodando em:", "http://localhost:" + PORT);
});