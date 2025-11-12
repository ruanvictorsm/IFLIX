import { pool } from "../conn.js";

export async function getAllUsers(){
    try{
        const consulta = await pool.query("SELECT * FROM usuario");
        const result = consulta.rows;

        return result;
    }catch(err){
        console.log(err)

        return [];
    }
}



// Buscar um usuário por matrícula
export async function getUsuarioById(id) {
  try {
    const consulta = await pool.query("SELECT * FROM usuario WHERE matricula = $1", [id]);
    return consulta.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Adicionar novo usuário
export async function addUsuario(matricula, nome, senha, matricula_ger, ano) {
  try {
    const consulta = await pool.query(
      `INSERT INTO usuario (matricula, nome, senha, matricula_ger, ano)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [matricula, nome, senha, matricula_ger, ano]
    );
    return consulta.rows[0];
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Atualizar usuário existente
export async function updateUsuario(matricula, nome, senha, matricula_ger, ano) {
  try {
    const consulta = await pool.query(
      `UPDATE usuario SET
         matricula = COALESCE($1, matricula),
         nome = COALESCE($2, nome),
         senha = COALESCE($3, senha),
         matricula_ger = COALESCE($4, matricula_ger),
         ano = COALESCE($5, ano)
       WHERE id_cont = $6
       RETURNING *`,
      [matricula ?? null, nome ?? null, senha ?? null, matricula_ger ?? null, nome ?? null, id]
    );
    return consulta.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Excluir usuário
export async function excluirUsuario(matricula) {
  try {
    const result = await pool.query(
      "DELETE FROM usuario WHERE matricula = $1",
      [matricula]
    );
    return result; // retorna o resultado do pg (contém rowCount)
  } catch (err) {
    console.error("Erro ao excluir do banco:", err);
    throw err;
  }
}


