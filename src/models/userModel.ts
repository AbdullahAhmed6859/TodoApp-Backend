import { pool } from "../db/pool";
import { hash } from "bcrypt";

export async function createUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  const hashedPassword = await hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id, first_name, last_name, email`,
    [firstName, lastName, email, hashedPassword]
  );
  console.log(result.rows[0]);
  return result.rows[0];
}

export async function findUserByEmail(email: string) {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return result.rows[0]; // undefined if not found
}
