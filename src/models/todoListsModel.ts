import { pool } from "../db/pool";

export async function findListsByUserId(userId: number) {
  const result = await pool.query(
    `SELECT id, title FROM todo_lists WHERE user_id = $1;`,
    [userId]
  );
  return result.rows;
}

export async function insertList(userId: number, listTitle: string) {
  const result = await pool.query(
    `INSERT INTO todo_lists (user_id, title) VALUES ($1, $2)
    RETURNING id, title;`,
    [userId, listTitle]
  );
  return result.rows[0];
}
