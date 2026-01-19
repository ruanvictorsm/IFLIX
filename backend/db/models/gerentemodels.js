import { pool } from "../conn.js";

export async function getAllgerentes(){
    try{
        const consulta = await pool.query("SELECT * FROM matricula_ger");
        const result = consulta.rows;

        return result;
    }catch(err){
        console.log(err)

        return [];
    }
}



// Buscar um gerente por matricula
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