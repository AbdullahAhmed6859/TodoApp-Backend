import { pool } from "../db/pool";

export async function getTodoListsByUser(userId: number) {
  const result = await pool.query(
    `SELECT id, title FROM todo_lists WHERE user_id = $1;`,
    [userId]
  );
  return result.rows;
}

export async function createTodoList(userId: number, listTitle: string) {
  const result = await pool.query(
    `INSERT INTO todo_lists (user_id, title) VALUES ($1, $2)
    RETURNING id, title;`,
    [userId, listTitle]
  );
  return result.rows[0];
}

export async function deleteTodoList(userId: number, listId: number) {
  const result = await pool.query(
    `DELETE FROM todo_lists WHERE id = $1 AND user_id = $2
    RETURNING title;`,
    [listId, userId]
  );
  return result.rows[0];
}
