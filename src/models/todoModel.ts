import { z } from "zod";
import {
  createTodoSchema,
  patchUpdateTodoSchema,
  putUpdateTodoSchema,
} from "../zodSchemas/todoSchema";

export const getTodosOfAList = async (userId: number, listId: number) => [];

export const createTodoForAList = async (
  userId: number,
  listId: number,
  options: z.infer<typeof createTodoSchema>
) => [];

export const putUpdateTodoOfAList = async (
  userId: number,
  listId: number,
  todoId: number,
  options: z.infer<typeof putUpdateTodoSchema>
) => [];

export const patchUpdateTodoOfAList = async (
  userId: number,
  listId: number,
  todoId: number,
  options: z.infer<typeof patchUpdateTodoSchema>
) => [];

export const deleteTodoOfAList = async (
  userId: number,
  listId: number,
  todoId: number
) => [];
