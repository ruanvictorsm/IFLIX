import { pool } from "../conn.js";

export async function getAllgerentes(){
    try{
        const consulta = await pool.query("SELECT * FROM gerente");
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
    const consulta = await pool.query("SELECT * FROM gerente WHERE matricula_ger = $1", [id]);
    return consulta.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Adicionar novo gerente
export async function addGerente(matricula_ger) {
  try {
    const consulta = await pool.query(
      `INSERT INTO gerente (matricula_ger)
       VALUES ($1)
       RETURNING *`,
      [matricula_ger]
    );
    return consulta.rows[0];
  } catch (err) {
    console.error(err);
    return null;
  }
}