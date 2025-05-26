import { z } from "zod";
import {
  createTodoSchema,
  patchUpdateTodoSchema,
  putUpdateTodoSchema,
} from "../zod-schemas/todoSchema";
import { pool } from "../db/pool";
import { todoListBelongsToUser } from "./todoListsModel";
import { generateSetQuery } from "../db/generateSetQuery";

export const getTodosOfAList = async (userId: number, listId: number) => {
  const todos = await pool.query(
    `
    SELECT t.id, t.title, t.description, t.done FROM todos AS t
    INNER JOIN todo_lists AS l ON t.list_id = l.id 
    INNER JOIN users AS u ON l.user_id = u.id
    WHERE u.id = $1 AND l.id = $2;`,
    [userId, listId]
  );
  return todos.rows;
};

export const createTodoForAList = async (
  userId: number,
  listId: number,
  options: z.infer<typeof createTodoSchema>
) => {
  const { title, description } = options;

  const newTodo = await pool.query(
    `INSERT INTO todos (title, description, list_id)
           VALUES ($1, $2, $3)
           RETURNING id, title, description, done`,
    [title, description, listId]
  );

  return newTodo.rows[0];
};

export const putUpdateTodoOfAList = async (
  userId: number,
  listId: number,
  todoId: number,
  options: z.infer<typeof putUpdateTodoSchema>
) => {
  const { title, description, done } = options;
  const updatedTodo = await pool.query(
    `UPDATE todos 
    SET title = $1, description = $2, done = $3
    WHERE id = $4 AND list_id = $5
    RETURNING id, title, description, done`,
    [title, description, done, todoId, listId]
  );

  return updatedTodo.rows[0];
};
export const patchUpdateTodoOfAList = async (
  userId: number,
  listId: number,
  todoId: number,
  options: z.infer<typeof patchUpdateTodoSchema>
) => {
  const { updates, values, paramCounter } = generateSetQuery(options);

  values.push(todoId);
  values.push(listId);

  // Execute the update query
  const updatedTodo = await pool.query(
    `UPDATE todos 
         SET ${updates.join(", ")} 
         WHERE id = $${paramCounter} AND list_id = $${paramCounter + 1}
         RETURNING id, title, description, done`,
    values
  );

  return updatedTodo.rows[0];
};

export const deleteTodoOfAList = async (
  userId: number,
  listId: number,
  todoId: number
) => {
  const result = await pool.query(
    `DELETE FROM todos 
    WHERE id = $1 AND list_id = $2
    RETURNING id, title, description, done`,
    [todoId, listId]
  );
  return result.rows[0];
};

export const todoBelongsToUser = async (
  userId: number,
  listId: number,
  todoId: number
) => {
  const todoCheck = await pool.query(
    `SELECT t.id FROM todos AS t
    INNER JOIN todo_lists AS l ON t.list_id = l.id
    WHERE t.id = $1 AND t.list_id = $2 AND l.user_id = $3`,
    [todoId, listId, userId]
  );

  return (todoCheck.rowCount ?? 0) === 0;
};
