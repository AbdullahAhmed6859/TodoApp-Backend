import { z } from "zod";

export const id = z.preprocess((x: unknown) => Number(x), z.number());

export const idParams = z.object({ id });

export const patchRefine = (data: object) =>
  Object.keys(data).some((key) => data[key as keyof typeof data] !== undefined);
