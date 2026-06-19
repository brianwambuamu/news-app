import { Request, Response } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';
import { comparePassword, hashPassword } from '../utils/password';
import { signToken } from '../utils/jwt';
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

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const { email, password } = parsed.data;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: 'This account has been deactivated.' });
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken({ userId: user.id, role: user.role });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    });

    return res.json({ user: toPublicUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Something went wrong while logging in.' });
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('token');
  return res.json({ message: 'Logged out.' });
}

export async function getMe(req: Request, res: Response) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [
      req.user!.userId,
    ]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ user: toPublicUser(user) });
  } catch (err) {
    console.error('Get me error:', err);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'New password must be at least 8 characters.'),
});

export async function changePassword(req: Request, res: Response) {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0].message });
  }

  const { currentPassword, newPassword } = parsed.data;

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [
      req.user!.userId,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const valid = await comparePassword(currentPassword, user.password_hash);
    if (!valid) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const newHash = await hashPassword(newPassword);

    await pool.query(
      `UPDATE users
       SET password_hash = $1, must_change_password = FALSE, updated_at = NOW()
       WHERE id = $2`,
      [newHash, user.id]
    );

    return res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ message: 'Something went wrong while updating your password.' });
  }
}
