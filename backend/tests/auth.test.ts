import request from 'supertest';
import app from '../src/server';
import User from '../src/models/User';
import { connectTestDB, disconnectTestDB, clearCollections } from './db.utils';
import { api, createUser, createAdmin, authHeader } from './helpers';

beforeAll(async () => {
  await connectTestDB('auth');
  await clearCollections();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('Authentication', () => {
  it('registers a new farmer and returns a JWT', async () => {
    const res = await api.post('/api/auth/register').send({
      name: 'New Farmer',
      email: 'farmer-a@test.local',
      phone: '9876543210',
      password: 'password123',
      role: 'FARMER',
      location: 'Lucknow',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.role).toBe('FARMER');
    expect(res.body.data.password).toBeUndefined();
  });

  it('rejects duplicate email registration', async () => {
    const res = await api.post('/api/auth/register').send({
      name: 'Duplicate',
      email: 'farmer-a@test.local',
      phone: '9876543210',
      password: 'password123',
      role: 'FARMER',
      location: 'Lucknow',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects registration with invalid email', async () => {
    const res = await api.post('/api/auth/register').send({
      name: 'Bad Email',
      email: 'not-an-email',
      phone: '9876543210',
      password: 'password123',
      role: 'FARMER',
      location: 'Lucknow',
    });
    expect(res.status).toBe(400);
  });

  it('rejects registration with invalid phone number', async () => {
    const res = await api.post('/api/auth/register').send({
      name: 'Bad Phone',
      email: 'badphone@test.local',
      phone: '12345',
      password: 'password123',
      role: 'FARMER',
      location: 'Lucknow',
    });
    expect(res.status).toBe(400);
  });

  it('rejects registration with short password', async () => {
    const res = await api.post('/api/auth/register').send({
      name: 'Short Password',
      email: 'short@test.local',
      phone: '9876543210',
      password: '123',
      role: 'FARMER',
      location: 'Lucknow',
    });
    expect(res.status).toBe(400);
  });

  it('rejects registration with missing required fields', async () => {
    const res = await api.post('/api/auth/register').send({
      email: 'missing@test.local',
      role: 'FARMER',
    });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('never allows public registration to create an ADMIN account', async () => {
    const res = await api.post('/api/auth/register').send({
      name: 'Hacker',
      email: 'hacker@test.local',
      phone: '9876543299',
      password: 'password123',
      role: 'ADMIN',
      location: 'HQ',
    });
    expect(res.status).toBe(403);
    const adminCount = await User.countDocuments({ email: 'hacker@test.local', role: 'ADMIN' });
    expect(adminCount).toBe(0);
  });

  it('rejects unknown roles', async () => {
    const res = await api.post('/api/auth/register').send({
      name: 'Unknown Role',
      email: 'unknown@test.local',
      phone: '9876543298',
      password: 'password123',
      role: 'SUPERUSER',
      location: 'HQ',
    });
    expect(res.status).toBe(400);
  });

  it('logs in with valid credentials', async () => {
    const user = await createUser('FARMER');
    const res = await api
      .post('/api/auth/login')
      .send({ email: user.email, password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.role).toBe('FARMER');
  });

  it('rejects login with invalid password', async () => {
    const user = await createUser('FARMER');
    const res = await api
      .post('/api/auth/login')
      .send({ email: user.email, password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects login with non-existent email', async () => {
    const res = await api
      .post('/api/auth/login')
      .send({ email: 'nobody@test.local', password: 'password123' });
    expect(res.status).toBe(401);
  });

  it('returns the authenticated user profile from /me', async () => {
    const user = await createUser('FARMER');
    const res = await api.get('/api/auth/me').set(authHeader(user));
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(user.id);
    expect(res.body.data.role).toBe('FARMER');
    expect(res.body.data.password).toBeUndefined();
  });

  it('rejects /me without a token', async () => {
    const res = await api.get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects /me with an invalid token', async () => {
    const res = await api.get('/api/auth/me').set('Authorization', 'Bearer invalid.token.here');
    expect(res.status).toBe(401);
  });

  it('rejects an expired token', async () => {
    const jwt = require('jsonwebtoken');
    const expired = jwt.sign(
      { id: '012345678901234567890123', role: 'FARMER' },
      process.env.JWT_SECRET as string,
      { expiresIn: '1ms' }
    );
    await new Promise((resolve) => setTimeout(resolve, 10));
    const res = await api.get('/api/auth/me').set('Authorization', `Bearer ${expired}`);
    expect(res.status).toBe(401);
  });

  it('updates the user profile (allowed fields only)', async () => {
    const user = await createUser('FARMER');
    const res = await api
      .patch('/api/auth/me')
      .set(authHeader(user))
      .send({ name: 'Updated Farmer Name', location: 'Kanpur' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Updated Farmer Name');
    expect(res.body.data.location).toBe('Kanpur');
  });

  it('prevents role and email escalation through profile update', async () => {
    const user = await createUser('FARMER');
    const res = await api
      .patch('/api/auth/me')
      .set(authHeader(user))
      .send({ role: 'ADMIN', email: 'hacker@evil.local' });
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('FARMER');
    expect(res.body.data.email).toBe(user.email);
    const stored = await User.findById(user.id);
    expect(stored!.role).toBe('FARMER');
    expect(stored!.email).toBe(user.email);
  });

  it('supports the password reset flow with a token', async () => {
    const user = await createUser('BUYER');
    const forgot = await api.post('/api/auth/forgot-password').send({ identifier: user.email });
    expect(forgot.status).toBe(200);
    const resetToken = forgot.body.data.resetToken;
    expect(resetToken).toBeDefined();

    const res = await api.post('/api/auth/reset-password').send({
      token: resetToken,
      password: 'newpassword456',
    });
    expect(res.status).toBe(200);

    const loginRes = await api
      .post('/api/auth/login')
      .send({ email: user.email, password: 'newpassword456' });
    expect(loginRes.status).toBe(200);
  });

  it('does not reveal whether an email exists during forgot-password', async () => {
    const res = await api
      .post('/api/auth/forgot-password')
      .send({ identifier: 'does-not-exist@test.local' });
    expect(res.status).toBe(200);
    expect(res.body.data).toBeUndefined();
  });

  it('rejects password reset with an invalid token', async () => {
    const res = await api.post('/api/auth/reset-password').send({
      token: 'invalid-token',
      password: 'anotherpassword',
    });
    expect(res.status).toBe(401);
  });

  it('responds to logout', async () => {
    const user = await createUser('FARMER');
    const res = await api.post('/api/auth/logout').set(authHeader(user));
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Security headers and health check', () => {
  it('sets security headers', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
  });

  it('does not expose the X-Powered-By header', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});

describe('Rate limiting', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('blocks repeated registration attempts beyond the limit', async () => {
    process.env.NODE_ENV = 'development';
    let lastStatus = 0;
    for (let i = 0; i < 15; i++) {
      const res = await api.post('/api/auth/register').send({
        name: 'Rate Tester',
        email: `rate-${Date.now()}-${i}@test.local`,
        phone: '9876543210',
        password: 'password123',
        role: 'BUYER',
        location: 'Lucknow',
      });
      lastStatus = res.status;
      if (res.status === 429) {
        break;
      }
    }
    expect(lastStatus).toBe(429);
  });
});
