import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server';
import User from '../src/models/User';

export const api = request(app);

let counter = 0;
function uniqueEmail(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}@test.local`;
}

export interface TestUser {
  id: string;
  email: string;
  token: string;
}

export async function createUser(
  role: 'FARMER' | 'BUYER',
  overrides: Record<string, any> = {}
): Promise<TestUser> {
  const email = uniqueEmail(role.toLowerCase());
  const password = 'password123';

  const registerRes = await api.post('/api/auth/register').send({
    name: overrides.name ?? `${role} Test`,
    email,
    phone: String(9000000000 + (counter % 9999999)).slice(0, 10),
    password,
    role,
    location: 'Lucknow',
    ...overrides,
  });

  if (registerRes.status !== 201) {
    throw new Error(`Setup failed: user registration failed: ${JSON.stringify(registerRes.body)}`);
  }

  const loginRes = await api.post('/api/auth/login').send({ email, password });
  if (loginRes.status !== 200) {
    throw new Error(`Setup failed: login failed: ${JSON.stringify(loginRes.body)}`);
  }

  return {
    id: loginRes.body.data._id,
    email,
    token: loginRes.body.data.token,
  };
}

export async function createAdmin(): Promise<TestUser> {
  const email = uniqueEmail('admin');
  const password = 'adminpassword123';
  await User.create({
    name: 'Admin Test',
    email,
    phone: '9999999999',
    password,
    role: 'ADMIN',
    location: 'HQ',
  });
  const loginRes = await api.post('/api/auth/login').send({ email, password });
  if (loginRes.status !== 200) {
    throw new Error(`Setup failed: admin login failed: ${JSON.stringify(loginRes.body)}`);
  }
  return { id: loginRes.body.data._id, email, token: loginRes.body.data.token };
}

export function authHeader(user: TestUser): Record<string, string> {
  return { Authorization: `Bearer ${user.token}` };
}

export async function createProductFor(farmer: TestUser, overrides: Record<string, any> = {}) {
  const availableQuantity = overrides.availableQuantity ?? 100;
  const res = await api
    .post('/api/products')
    .set(authHeader(farmer))
    .send({
      name: `Test Crop ${Date.now()}`,
      description: 'Fresh produce',
      category: 'Vegetables',
      price: 25,
      unit: 'kg',
      availableQuantity,
      minimumOrderQuantity: 1,
      lowStockThreshold: 10,
      isOrganic: false,
      grade: 'Grade A',
      location: 'Lucknow',
      ...overrides,
    });
  if (res.status !== 201) {
    throw new Error(`Setup failed: product creation failed: ${JSON.stringify(res.body)}`);
  }

  // The create endpoint always activates listings; apply an
  // explicit status override through the moderation endpoint.
  if (overrides.status && overrides.status !== res.body.data.status) {
    const statusRes = await api
      .patch(`/api/products/${res.body.data.id}/status`)
      .set(authHeader(farmer))
      .send({ status: overrides.status });
    if (statusRes.status !== 200) {
      throw new Error(`Setup failed: product status update failed: ${JSON.stringify(statusRes.body)}`);
    }
    res.body.data.status = statusRes.body.data.status;
  }

  return res.body.data;
}

export const isValidObjectId = (value: string): boolean =>
  /^[0-9a-fA-F]{24}$/.test(value);

export { mongoose };
