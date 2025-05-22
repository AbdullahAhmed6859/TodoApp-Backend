import { toCamelCase } from "../utils/toCamelCase";

export const generateSetQuery = (options: object) => {
  const updates: string[] = [];
  const values: any[] = [];
  let paramCounter = 1;

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined) {
      const dbColumnName = toCamelCase(key);
      updates.push(`${dbColumnName} = $${paramCounter++}`);
      values.push(value);
    }
  }

  return { updates, values, paramCounter };
};
