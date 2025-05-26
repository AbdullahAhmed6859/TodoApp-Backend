import { z } from "zod";
import { pool } from "../db/pool";
import { hash } from "bcrypt";
import {
  patchUserSchema,
  putUserSchema,
  signupSchema,
} from "../zod-schemas/userSchemas";
import { generateSetQuery } from "../db/generateSetQuery";

export async function createUser(userDetails: z.infer<typeof signupSchema>) {
  const { firstName, lastName, email, password } = userDetails;
  const hashedPassword = await hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id, first_name, last_name, email;`,
    [firstName, lastName, email, hashedPassword]
  );
  console.log(result.rows[0]);
  return result.rows[0];
}

export async function findUserByEmail(email: string) {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1;`, [
    email,
  ]);
  return result.rows[0];
}

export const userWithEmailExists = async (email: string) =>
  Boolean(await findUserByEmail(email));

export async function findUserById(id: number) {
  const result = await pool.query(
    `SELECT id, first_name, last_name, email FROM users WHERE id = $1;`,
    [id]
  );
  return result.rows[0];
}

export async function putUpdateUserById(
  id: number,
  options: z.infer<typeof putUserSchema>
) {
  const { firstName, lastName } = options;
  const result = await pool.query(
    `UPDATE users SET
    updated_at = NOW(),
    first_name = $1,
    last_name = $2
    WHERE id = $3
    RETURNING id, first_name, last_name, email;`,
    [firstName, lastName, id]
  );
  return result.rows[0];
}

export async function patchUpdateUserById(
  id: number,
  options: z.infer<typeof patchUserSchema>
) {
  // If no fields to update, return the current user
  if (Object.keys(options).length === 0) {
    return findUserById(id);
  }
  const { updates, values, paramCounter } = generateSetQuery(options);
  values.push(id);

  // Construct and execute the query
  const query = `
    UPDATE users
    SET updated_at = NOW(),
    ${updates.join(", ")}
    WHERE id = $${paramCounter}
    RETURNING id, first_name, last_name, email;
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}
