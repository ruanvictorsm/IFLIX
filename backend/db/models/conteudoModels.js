import { pool } from "../conn.js";

// Buscar todos os conteúdos
export async function getAllConteudo() {
  try {
    const consulta = await pool.query("SELECT * FROM conteudo ORDER BY id_cont DESC");
    return consulta.rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Buscar um conteúdo por ID
export async function getConteudoById(id) {
  try {
    const consulta = await pool.query("SELECT * FROM conteudo WHERE id_cont = $1", [id]);
    return consulta.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Adicionar novo conteúdo 
export async function addConteudo(titulo, tipo, genero, matricula_ger, url, trailer, resenha) {
  try {
    const consulta = await pool.query(
      `INSERT INTO conteudo (titulo, tipo, genero, matricula_ger, url, trailer, resenha, descricao)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [titulo, tipo, genero, matricula_ger, url, trailer, resenha, descricao]
    );
    return consulta.rows[0];
  } catch (err) {
    console.error(err);
    return null; 
  }
}

// Atualizar conteúdo existente
export async function updateConteudo({ id, titulo, tipo, genero, matricula_ger, url, trailer, resenha, descricao }) {
  try {
    const consulta = await pool.query(
      `UPDATE conteudo SET
         titulo = COALESCE($1, titulo),
         tipo = COALESCE($2, tipo),
         genero = COALESCE($3, genero),
         matricula_ger = COALESCE($4, matricula_ger),
         url = COALESCE($5, url),
         trailer = COALESCE($6, trailer),
         resenha = COALESCE($7, resenha),
         descricao = COALESCE($8, descricao)
       WHERE id_cont = $9
       RETURNING *`,
      [titulo, tipo, genero, matricula_ger, url, trailer, resenha, descricao, id]
    );
    return consulta.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}


// Excluir conteúdo 
export async function excluirConteudo(id) {
  try {
    const consulta = await pool.query("DELETE FROM conteudo WHERE id_cont = $1", [id]);
    return consulta.rowCount > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}

