import dotenv from "dotenv";
dotenv.config();
import { pool } from "../db/pool";

(async function () {
  try {
    console.log("Seeding DB...");

    // Seed if empty
    const res = await pool.query("SELECT COUNT(*) FROM users");
    const userCount = parseInt(res.rows[0].count);

    if (userCount === 0) {
      const { rows: users } = await pool.query(`
        INSERT INTO users (first_name, last_name, email, password)
        VALUES
          ('Alice', 'Smith', 'alice.smith@example.com', 'password123'),
          ('Bob', 'Johnson', 'bob.johnson@example.com', 'password456')
        RETURNING id;
      `);

      const { rows: lists } = await pool.query(`
        INSERT INTO todo_lists (user_id, title)
        VALUES
          (${users[0].id}, 'Alice Work Todos'),
          (${users[1].id}, 'Bob Personal Todos')
        RETURNING id;
      `);

      await pool.query(`
        INSERT INTO todos (list_id, title, description, status)
        VALUES
          (${lists[0].id}, 'Finish project', 'Due next week', 'pending'),
          (${lists[0].id}, 'Email team', 'Summary of updates', 'done'),
          (${lists[1].id}, 'Buy groceries', 'Eggs, Milk, Bread', 'pending');
      `);

      console.log("✅ Seed data inserted");
    } else {
      console.log("⚠️ Tables already seeded");
    }
  } catch (err) {
    console.error("❌ DB seed error:", err);
  }
  await pool.end();
})();
