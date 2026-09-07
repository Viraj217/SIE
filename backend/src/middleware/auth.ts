import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const configuredJwtSecret = process.env.ADMIN_JWT_SECRET;

if (process.env.NODE_ENV === 'production' && !configuredJwtSecret) {
  throw new Error('ADMIN_JWT_SECRET is required in production.');
}

const JWT_SECRET = configuredJwtSecret || 'local-development-only-secret';

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * Middleware that verifies a JWT token from the Authorization header.
 * Attaches the decoded user payload to req.user.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

export { JWT_SECRET };
