import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { JwtPayload, UserRole } from '../types';
import { pool } from '../db/pool';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    const payload = verifyToken(token);

    // Confirm the user still exists and is active on every request.
    // This is what makes "terminate a user" take effect immediately,
    // even if they already have a valid token.
    const result = await pool.query(
      'SELECT id, role, is_active FROM users WHERE id = $1',
      [payload.userId]
    );

    const dbUser = result.rows[0];

    if (!dbUser || !dbUser.is_active) {
      res.clearCookie('token');
      return res.status(401).json({ message: 'Account is inactive or no longer exists.' });
    }

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired session.' });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to do this.' });
    }
    next();
  };
}
