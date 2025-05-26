import { z } from "zod";
import { pool } from "../db/pool";
import {
  createListSchema,
  updateListSchema,
} from "../zod-schemas/todoListSchemas";
import { AppError } from "../utils/AppError";

export async function getTodoListsForUser(userId: number) {
  const result = await pool.query(
    `SELECT id, title FROM todo_lists WHERE user_id = $1;`,
    [userId]
  );
  return result.rows;
}

export const todoListBelongsToUser = async (userId: number, listId: number) => {
  const listCheck = await pool.query(
    `SELECT * FROM todo_lists WHERE id = $1 AND user_id = $2`,
    [listId, userId]
  );

  if ((listCheck.rowCount ?? 0) === 0) {
    throw new AppError(
      "Todo list not found or you don't have permission to access/update it",
      404
    );
  }
};

export async function createTodoListForUser(
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
  await todoListBelongsToUser(userId, listId);

  const result = await pool.query(
    `UPDATE todo_lists
    SET title = $3,
    updated_at = NOW()
    WHERE
      user_id = $1 AND
      id = $2
    RETURNING id, title;`,
    [userId, listId, options.title]
  );
  return result.rows[0];
}

export async function deleteTodoListForUser(userId: number, listId: number) {
  await todoListBelongsToUser(userId, listId);

  const result = await pool.query(
    `DELETE FROM todo_lists WHERE id = $1 AND user_id = $2`,
    [listId, userId]
  );
  return result.rows[0];
}
