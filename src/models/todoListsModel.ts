import { z } from "zod";
import { pool } from "../db/pool";
import {
  createListSchema,
  updateListSchema,
} from "../zodSchemas/todoListsSchemas";

export async function getTodoListsByUserId(userId: number) {
  const result = await pool.query(
    `SELECT id, title FROM todo_lists WHERE user_id = $1;`,
    [userId]
  );
  return result.rows;
}

export async function createTodoList(
  userId: number,
  options: z.infer<typeof createListSchema>
) {
  const result = await pool.query(
    `INSERT INTO todo_lists (user_id, title) VALUES ($1, $2)
    RETURNING id, title;`,
    [userId, options.title]
  );
  return result.rows[0];
}

export async function updateTodoListForUser(
  userId: number,
  listId: number,
  options: z.infer<typeof updateListSchema>
) {
  const result = await pool.query(
    `UPDATE todo_lists
    SET title = $3
    WHERE
      user_id = $1 AND
      id = $2
    RETURNING id, title;`,
    [userId, listId, options.title]
  );
  return result.rows;
}

export async function deleteTodoList(userId: number, listId: number) {
  const result = await pool.query(
    `DELETE FROM todo_lists WHERE id = $1 AND user_id = $2
    RETURNING title;`,
    [listId, userId]
  );
  return result.rows[0];
}
