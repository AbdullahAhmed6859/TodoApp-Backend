import { z } from "zod";

const title = z
  .string()
  .min(4, "A list title must have Atleast 4 charachter")
  .max(100, "A list title must have Atmost 100 charachter");

export const createListSchema = z.object({ title });

export const updateListSchema = z.object({ title });
