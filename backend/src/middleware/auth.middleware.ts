import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors';

export interface JwtPayload {
  id: string;
  role: 'FARMER' | 'BUYER' | 'ADMIN';
  iat?: number;
  exp?: number;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

type JwtExpiry = NonNullable<jwt.SignOptions['expiresIn']>;

export function generateToken(id: string, role: JwtPayload['role']): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id, role }, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '30d') as JwtExpiry,
  });
}

export function protect(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    next(new UnauthorizedError('Not authorized, no token'));
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    const decoded = jwt.verify(token, secret) as JwtPayload;
    if (!decoded.id || !decoded.role) {
      throw new Error('Malformed token');
    }
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    next(new UnauthorizedError('Not authorized, token failed'));
  }
}

export function authorize(...roles: JwtPayload['role'][]): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    if (!req.user) {
      next(new UnauthorizedError('Not authorized'));
      return;
    }
    if (!roles.includes(req.user.role)) {
      const err = new Error(
        `User role ${req.user.role} is not authorized to access this route`
      ) as Error & { statusCode: number };
      err.statusCode = 403;
      next(err);
      return;
    }
    next();
  };
}

export function optionalProtect(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];
    try {
      const secret = process.env.JWT_SECRET;
      if (secret) {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        if (decoded.id && decoded.role) {
          req.user = { id: decoded.id, role: decoded.role };
        }
      }
    } catch {
      // Invalid token: continue as anonymous
    }
  }
  next();
}
