import { z } from "zod";

export const createListSchema = z.object({
  title: z
    .string()
    .min(4, "A list title must have Atleast 4 charachter")
    .max(100, "A list title must have Atmost 100 charachter"),
});
