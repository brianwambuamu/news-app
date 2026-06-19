import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { pool } from './pool';

dotenv.config();

async function seed() {
  const email = process.env.INITIAL_ADMIN_EMAIL;
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  const name = process.env.INITIAL_ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.error(
      'INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD must be set in .env to seed an admin.'
    );
    process.exitCode = 1;
    return;
  }

  try {
    const existing = await pool.query(
      `SELECT id FROM users WHERE role = 'admin' LIMIT 1`
    );

    if (existing.rows.length > 0) {
      console.log('An admin account already exists. Skipping seed.');
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password_hash, role, is_active, must_change_password)
       VALUES ($1, $2, $3, 'admin', TRUE, FALSE)`,
      [name, email.toLowerCase(), passwordHash]
    );

    console.log(`Admin account created: ${email}`);
    console.log('You can now log in with this email and the password set in .env.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
