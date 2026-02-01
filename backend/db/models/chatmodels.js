import { pool } from "../conn.js";

export async function getChatId(matricula_ger, admin_id) {
  // tenta achar o chat
  const result = await pool.query(
    `SELECT id_chat 
     FROM chat 
     WHERE matricula_ger = $1 AND matricula_admin = $2`,
    [matricula_ger, admin_id]
  );

  if (result.rows.length > 0) {
    return result.rows[0].id_chat;
  }

  // se não existir, cria
  const novoChat = await pool.query(
    `INSERT INTO chat (matricula_ger, matricula_admin)
     VALUES ($1, $2)
     RETURNING id_chat`,
    [matricula_ger, admin_id]
  );

  return novoChat.rows[0].id_chat;
}

export async function enviarMensagem(chatId, remetente, mensagem) {
  await pool.query(
    `INSERT INTO mensagens (id_chat, remetente, mensagem)
     VALUES ($1, $2, $3)`,
    [chatId, remetente, mensagem]
  );
}
