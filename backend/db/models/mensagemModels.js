import { pool } from "../conn.js";

export async function listarMensagens(chatId) {
  const result = await pool.query(
    "SELECT * FROM mensagens WHERE id_chat = $1 ORDER BY data",
    [chatId]
  );
  return result.rows;
}

export async function enviarMensagem(chatId, remetente, mensagem) {
  await pool.query(
    "INSERT INTO mensagens (id_chat, remetente, mensagem) VALUES ($1, $2, $3)",
    [chatId, remetente, mensagem]
  );
}
