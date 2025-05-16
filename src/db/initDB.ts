import { pool } from "./pool";

export async function initDB() {
  try {
    console.log("Initializing DB...");

    // 1. Create ENUM
    await pool.query(`
          DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'todo_status') THEN
              CREATE TYPE TODO_STATUS AS ENUM ('pending', 'done');
            END IF;
          END $$;
        `);

    // 2. Create tables
    await pool.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(120) UNIQUE NOT NULL,
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
        `);

    // 3. Create View
    await pool.query(`
          CREATE OR REPLACE VIEW user_todos AS
          SELECT
            u.id AS user_id,
            u.first_name,
            u.last_name,
            u.email,
            l.id AS list_id,
            l.title AS list_title,
            t.id AS todo_id,
            t.title AS todo_title,
            t.description AS todo_description,
            t.status AS todo_status,
            t.created_at AS todo_created_at,
            t.updated_at AS todo_updated_at
          FROM users u
          JOIN todo_lists l ON u.id = l.user_id
          JOIN todos t ON t.list_id = l.id;
        `);
    console.log("✅ DB Initialised");
  } catch (err) {
    console.error("❌ DB init error:", err);
  }
}
