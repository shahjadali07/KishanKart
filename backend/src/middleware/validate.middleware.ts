import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

export type ValidationRule = {
  field: string;
  required?: boolean;
  isEmail?: boolean;
  isPhone?: boolean;
  minLength?: number;
  maxLength?: number;
  isInt?: boolean;
  min?: number;
  max?: number;
  in?: string[];
  isMongoId?: boolean;
  custom?: (value: any, body: any) => string | null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;
const MONGO_ID_RE = /^[0-9a-fA-F]{24}$/;

function getPathValue(body: any, field: string): any {
  return field.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), body);
}

export function validate(rules: ValidationRule[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const body = req.body ?? {};
    const failures: Record<string, string[]> = {};

    for (const rule of rules) {
      const value = getPathValue(body, rule.field);
      const add = (msg: string) => {
        failures[rule.field] = [...(failures[rule.field] ?? []), msg];
      };

      if (value === undefined || value === null || value === '') {
        if (rule.required) {
          add(`${rule.field} is required`);
        }
        continue;
      }

      if (typeof value === 'string') {
        if (rule.isEmail && !EMAIL_RE.test(value)) add(`${rule.field} must be a valid email address`);
        if (rule.isPhone && !PHONE_RE.test(value)) add(`${rule.field} must be a valid 10-digit mobile number`);
        if (rule.isMongoId && !MONGO_ID_RE.test(value)) add(`${rule.field} must be a valid id`);
        if (rule.minLength !== undefined && value.length < rule.minLength) {
          add(`${rule.field} must be at least ${rule.minLength} characters`);
        }
        if (rule.maxLength !== undefined && value.length > rule.maxLength) {
          add(`${rule.field} must be at most ${rule.maxLength} characters`);
        }
      }

      if (rule.in && !rule.in.includes(value)) {
        add(`${rule.field} must be one of: ${rule.in.join(', ')}`);
      }

      if (rule.isInt || rule.min !== undefined || rule.max !== undefined) {
        const num = Number(value);
        if (!Number.isFinite(num) || !Number.isInteger(num)) {
          add(`${rule.field} must be a whole number`);
        } else {
          if (rule.min !== undefined && num < rule.min) add(`${rule.field} must be at least ${rule.min}`);
          if (rule.max !== undefined && num > rule.max) add(`${rule.field} must be at most ${rule.max}`);
        }
      }

      if (rule.custom) {
        const msg = rule.custom(value, body);
        if (msg) add(msg);
      }
    }

    if (Object.keys(failures).length > 0) {
      next(new ValidationError('Validation failed', failures));
      return;
    }
    next();
  };
}

export function parsePagination(req: Request): { page: number; limit: number; skip: number } {
  const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit ?? '20'), 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

export function parseSort<T extends string>(req: Request, allowed: T[], defaultSort: T): { sortBy: T; order: 1 | -1 } {
  const sortBy = (String(req.query.sortBy ?? defaultSort) as T);
  const order = String(req.query.order ?? 'desc').toLowerCase() === 'asc' ? 1 : -1;
  return {
    sortBy: allowed.includes(sortBy) ? sortBy : defaultSort,
    order,
  };
}
