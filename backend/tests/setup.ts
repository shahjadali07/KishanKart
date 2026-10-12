import dotenv from 'dotenv';
import path from 'path';

// Load backend .env for tests
dotenv.config({ path: path.resolve(__dirname, '../.env') });

process.env.NODE_ENV = 'test';
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-for-unit-tests-only';
}
