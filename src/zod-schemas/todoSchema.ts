import { z } from "zod";
import { id, patchRefine } from "./common";

const title = z
  .string()
  .min(1, "Tittle is required")
  .max(100, "Tittle can be a maximum of 100 characters");

const description = z
  .string()
  .max(1000, "A description can be max 1000 characters")
  .default("");

const done = z.boolean();

export const todoIdParams = z.object({
  listId: id,
  todoId: id,
});

export const createTodoSchema = z.object({
  title,
  description,
});

export const putUpdateTodoSchema = z.object({ title, description, done });

export const patchUpdateTodoSchema = putUpdateTodoSchema
  .partial()
  .refine(patchRefine, { message: "Atleast one field must be present" });
