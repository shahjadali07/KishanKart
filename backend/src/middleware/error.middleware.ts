import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';

interface ErrorWithStatus extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;
  kind?: string;
  path?: string;
  code?: number;
}

export function errorHandler(
  err: ErrorWithStatus,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (res.headersSent) {
    _next(err);
    return;
  }

  let statusCode = err.statusCode ?? 500;
  let message = err.message || 'Internal server error';
  const errors = err.errors;

  if (err.kind === 'ObjectId' || (err as { name?: string }).name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier';
  }

  if ((err as { name?: string }).name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry. A record with this value already exists.';
  }

  if (process.env.NODE_ENV !== 'production' && statusCode >= 500) {
    console.error(err);
  } else if (statusCode >= 500) {
    console.error(err.message);
  }

  const body: { success: false; message: string; errors?: Record<string, string[]> } = {
    success: false,
    message,
  };
  if (errors) {
    body.errors = errors;
  }

  res.status(statusCode).json(body);
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ success: false, message: 'Route not found' });
}
