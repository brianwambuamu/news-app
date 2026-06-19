import { Request, Response } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';
import { generateTempPassword, hashPassword } from '../utils/password';
import { sendCredentialsEmail } from '../utils/email';
import { PublicUser } from '../types';

function toPublicUser(row: any): PublicUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    is_active: row.is_active,
    must_change_password: row.must_change_password,
    created_at: row.created_at,
  };
}

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Enter a valid email address.'),
  role: z.enum(['admin', 'reporter']).default('reporter'),
});

export async function createUser(req: Request, res: Response) {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0].message });
  }

  const { name, email, role } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [
      normalizedEmail,
    ]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const tempPassword = generateTempPassword();
    const passwordHash = await hashPassword(tempPassword);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, is_active, must_change_password)
       VALUES ($1, $2, $3, $4, TRUE, TRUE)
       RETURNING *`,
      [name, normalizedEmail, passwordHash, role]
    );

    const newUser = result.rows[0];

    try {
      await sendCredentialsEmail({
        to: normalizedEmail,
        name,
        email: normalizedEmail,
        password: tempPassword,
      });
    } catch (emailErr) {
      console.error('Failed to send credentials email:', emailErr);
      // The user is still created; surface a warning rather than failing the request.
      return res.status(201).json({
        user: toPublicUser(newUser),
        warning:
          'User created, but the credentials email could not be sent. Please share the password manually.',
        temporaryPassword: tempPassword,
      });
    }

    return res.status(201).json({ user: toPublicUser(newUser) });
  } catch (err) {
    console.error('Create user error:', err);
    return res.status(500).json({ message: 'Something went wrong while creating the user.' });
  }
}

export async function listUsers(req: Request, res: Response) {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE role = 'reporter' ORDER BY created_at DESC`
    );
    return res.json({ users: result.rows.map(toPublicUser) });
  } catch (err) {
    console.error('List users error:', err);
    return res.status(500).json({ message: 'Something went wrong while fetching users.' });
  }
}

export async function terminateUser(req: Request, res: Response) {
  const { id } = req.params;
  const userId = Number(id);

  if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: 'Invalid user id.' });
  }

  if (userId === req.user!.userId) {
    return res.status(400).json({ message: 'You cannot deactivate your own account.' });
  }

  try {
    const result = await pool.query(
      `UPDATE users SET is_active = FALSE, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ user: toPublicUser(result.rows[0]) });
  } catch (err) {
    console.error('Terminate user error:', err);
    return res.status(500).json({ message: 'Something went wrong while deactivating the user.' });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  const userId = Number(id);

  if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: 'Invalid user id.' });
  }

  if (userId === req.user!.userId) {
    return res.status(400).json({ message: 'You cannot delete your own account.' });
  }

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ message: 'User deleted.' });
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ message: 'Something went wrong while deleting the user.' });
  }
}
