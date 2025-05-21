import { z } from "zod";

export const id = z.preprocess((x: unknown) => Number(x), z.number());
export const idParams = z.object({ id });
