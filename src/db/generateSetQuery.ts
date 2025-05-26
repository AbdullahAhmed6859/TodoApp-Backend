import { toSnakeCase } from "../utils/casingCast";

export const generateSetQuery = (options: object) => {
  const updates: string[] = [];
  const values: any[] = [];
  let paramCounter = 1;

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined) {
      const dbColumnName = toSnakeCase(key);
      updates.push(`${dbColumnName} = $${paramCounter++}`);
      values.push(value);
    }
  }

  return { updates, values, paramCounter };
};
