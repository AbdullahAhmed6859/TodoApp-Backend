import { pool } from "./pool";
import console from "console";

export async function initDB() {
  try {
    console.log("Initializing DB...");
    await pool.query(initQuery);
    console.log("✅ DB Initialised");
  } catch (err) {
    console.error("❌ DB init error:", err);
  }
}

const initQuery = `
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'todo_status') THEN
    	CREATE TYPE TODO_STATUS AS ENUM ('pending', 'done');
	END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS todo_lists (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	title VARCHAR(100) NOT NULL,
	created_at TIMESTAMPTZ DEFAULT now(),
 	updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS todos (
	id SERIAL PRIMARY KEY,
	list_id INTEGER NOT NULL REFERENCES todo_lists(id) ON DELETE CASCADE,
	title VARCHAR(100) NOT NULL,
	description TEXT,
	status TODO_STATUS DEFAULT 'pending',
	created_at TIMESTAMPTZ DEFAULT now(),
  	updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE VIEW user_todos AS
SELECT
  U.id AS user_id,
  U.first_name,
  U.last_name,
  U.email,
  L.id AS list_id,
  L.title AS list_title,
  T.id AS todo_id,
  T.title AS todo_title,
  T.description AS todo_description,
  T.status AS todo_status,
  T.created_at AS todo_created_at,
  T.updated_at AS todo_updated_at
FROM users U
JOIN todo_lists L ON U.id = L.user_id
JOIN todos T ON T.list_id = L.id;
`;
