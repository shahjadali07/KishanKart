import { connectTestDB, disconnectTestDB, clearCollections } from './db.utils';
import { api, createUser, createAdmin, authHeader, createProductFor } from './helpers';

const address = {
  fullName: 'Buyer Name',
  phone: '9876543210',
  address: '123 Market Road',
  city: 'Lucknow',
  district: 'Lucknow',
  state: 'Uttar Pradesh',
  pinCode: '226001',
};

beforeAll(async () => {
  await connectTestDB('dashboards');
  await clearCollections();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('Role-specific dashboards', () => {
  it('returns farmer dashboard statistics', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    await createProductFor(farmer, { availableQuantity: 100 });
    await createProductFor(farmer, { availableQuantity: 50 });
    const product = await createProductFor(farmer, { availableQuantity: 10, lowStockThreshold: 20 });

    await api
      .post('/api/orders')
      .set(authHeader(buyer))
      .send({ items: [{ productId: product.id, quantity: 4 }], shippingAddress: address });

    const res = await api.get('/api/dashboard/farmer').set(authHeader(farmer));
    expect(res.status).toBe(200);
    expect(res.body.data.totalProducts).toBe(3);
    expect(res.body.data.activeProducts).toBe(3);
    expect(res.body.data.availableStock).toBe(100 + 50 + 6);
    expect(res.body.data.lowStockCount).toBe(1);
    expect(res.body.data.activeOrders).toBe(1);
    expect(res.body.data.orderStatusCounts.Pending).toBe(1);
  });

  it('returns buyer dashboard statistics', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer, { price: 10, availableQuantity: 100 });

    await api
      .post('/api/orders')
      .set(authHeader(buyer))
      .send({ items: [{ productId: product.id, quantity: 2 }], shippingAddress: address });
    await api
      .post('/api/orders')
      .set(authHeader(buyer))
      .send({ items: [{ productId: product.id, quantity: 3 }], shippingAddress: address });

    const res = await api.get('/api/dashboard/buyer').set(authHeader(buyer));
    expect(res.status).toBe(200);
    expect(res.body.data.totalOrders).toBe(2);
    expect(res.body.data.activeOrders).toBe(2);
    expect(res.body.data.orderStatusCounts.Pending).toBe(2);
  });

  it('prevents cross-role dashboard access', async () => {
    const farmer = await createUser('FARMER');
    const buyerRes = await api.get('/api/dashboard/buyer').set(authHeader(farmer));
    expect(buyerRes.status).toBe(403);
  });

  it('requires authentication for dashboards', async () => {
    const res = await api.get('/api/dashboard/farmer');
    expect(res.status).toBe(401);
  });
});

describe('Admin dashboard and management', () => {
  it('returns admin dashboard statistics', async () => {
    const admin = await createAdmin();
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    await createProductFor(farmer, { availableQuantity: 10 });
    const product = await createProductFor(farmer, { price: 30, availableQuantity: 100 });
    await api
      .post('/api/orders')
      .set(authHeader(buyer))
      .send({ items: [{ productId: product.id, quantity: 2 }], shippingAddress: address });

    const res = await api.get('/api/dashboard/admin').set(authHeader(admin));
    expect(res.status).toBe(200);
    expect(res.body.data.totalUsers).toBeGreaterThanOrEqual(3);
    expect(res.body.data.totalFarmers).toBeGreaterThanOrEqual(1);
    expect(res.body.data.totalBuyers).toBeGreaterThanOrEqual(1);
    expect(res.body.data.activeProducts).toBeGreaterThanOrEqual(2);
    expect(res.body.data.totalOrders).toBeGreaterThanOrEqual(1);
    expect(res.body.data.pendingOrdersCount).toBeGreaterThanOrEqual(1);
  });

  it('keeps the legacy /api/admin/stats endpoint working', async () => {
    const admin = await createAdmin();
    const res = await api.get('/api/admin/stats').set(authHeader(admin));
    expect(res.status).toBe(200);
    expect(res.body.data.totalUsers).toBeDefined();
    expect(res.body.data.totalFarmers).toBeDefined();
    expect(res.body.data.totalBuyers).toBeDefined();
    expect(res.body.data.activeUsers).toBeDefined();
  });

  it('prevents non-admins from accessing the admin dashboard', async () => {
    const farmer = await createUser('FARMER');
    const res = await api.get('/api/dashboard/admin').set(authHeader(farmer));
    expect(res.status).toBe(403);
  });

  it('lists users with role and status filters', async () => {
    const admin = await createAdmin();
    await createUser('FARMER');
    await createUser('BUYER');

    const res = await api.get('/api/admin/users').set(authHeader(admin));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);
    expect(res.body.pagination).toBeDefined();

    const farmers = await api.get('/api/admin/users?role=FARMER').set(authHeader(admin));
    expect(farmers.body.data.every((u: any) => u.role === 'FARMER')).toBe(true);

    const search = await api.get('/api/admin/users?search=Test').set(authHeader(admin));
    expect(search.status).toBe(200);
  });

  it('retrieves a user with computed stats', async () => {
    const admin = await createAdmin();
    const farmer = await createUser('FARMER');
    await createProductFor(farmer);
    await createProductFor(farmer);

    const res = await api.get(`/api/admin/users/${farmer.id}`).set(authHeader(admin));
    expect(res.status).toBe(200);
    expect(res.body.data.stats.productsCount).toBe(2);
  });

  it('blocks and unblocks a user', async () => {
    const admin = await createAdmin();
    const user = await createUser('BUYER');

    const block = await api
      .patch(`/api/admin/users/${user.id}/status`)
      .set(authHeader(admin))
      .send({ status: 'BLOCKED', reason: 'Violated terms' });
    expect(block.status).toBe(200);
    expect(block.body.data.status).toBe('BLOCKED');

    // Blocked user cannot log in
    const login = await api
      .post('/api/auth/login')
      .send({ email: user.email, password: 'password123' });
    expect(login.status).toBe(403);

    const unblock = await api
      .patch(`/api/admin/users/${user.id}/status`)
      .set(authHeader(admin))
      .send({ status: 'ACTIVE' });
    expect(unblock.status).toBe(200);

    const loginAgain = await api
      .post('/api/auth/login')
      .send({ email: user.email, password: 'password123' });
    expect(loginAgain.status).toBe(200);
  });

  it('prevents users from blocking themselves', async () => {
    const admin = await createAdmin();
    const res = await api
      .patch(`/api/admin/users/${admin.id}/status`)
      .set(authHeader(admin))
      .send({ status: 'BLOCKED' });
    expect(res.status).toBe(403);
  });

  it('prevents non-admins from blocking users', async () => {
    const farmer = await createUser('FARMER');
    const target = await createUser('BUYER');
    const res = await api
      .patch(`/api/admin/users/${target.id}/status`)
      .set(authHeader(farmer))
      .send({ status: 'BLOCKED' });
    expect(res.status).toBe(403);
  });

  it('verifies and rejects farmer KYC', async () => {
    const admin = await createAdmin();
    const farmer = await createUser('FARMER');

    const approve = await api
      .patch(`/api/admin/users/${farmer.id}/kyc`)
      .set(authHeader(admin))
      .send({ kycStatus: 'APPROVED' });
    expect(approve.status).toBe(200);
    expect(approve.body.data.kycStatus).toBe('APPROVED');

    const reject = await api
      .patch(`/api/admin/users/${farmer.id}/kyc`)
      .set(authHeader(admin))
      .send({ kycStatus: 'REJECTED', reason: 'Invalid documents' });
    expect(reject.status).toBe(200);
    expect(reject.body.data.kycStatus).toBe('REJECTED');
    expect(reject.body.data.rejectionReason).toBe('Invalid documents');
  });

  it('rejects KYC updates for non-farmer accounts', async () => {
    const admin = await createAdmin();
    const buyer = await createUser('BUYER');
    const res = await api
      .patch(`/api/admin/users/${buyer.id}/kyc`)
      .set(authHeader(admin))
      .send({ kycStatus: 'APPROVED' });
    expect(res.status).toBe(400);
  });

  it('returns the farmer profile with products and sales', async () => {
    const admin = await createAdmin();
    const farmer = await createUser('FARMER');
    await createProductFor(farmer);
    await createProductFor(farmer);

    const res = await api.get(`/api/admin/farmers/${farmer.id}`).set(authHeader(admin));
    expect(res.status).toBe(200);
    expect(res.body.data.stats.productsCount).toBe(2);
    expect(res.body.data.products).toHaveLength(2);
  });

  it('lists all products for moderation', async () => {
    const admin = await createAdmin();
    const farmer = await createUser('FARMER');
    await createProductFor(farmer, { name: 'Moderation Crop' });

    const res = await api.get('/api/admin/products').set(authHeader(admin));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);

    const pending = await api
      .get('/api/admin/products?status=Pending%20Approval')
      .set(authHeader(admin));
    expect(pending.status).toBe(200);
  });

  it('deletes a user with related records', async () => {
    const admin = await createAdmin();
    const farmer = await createUser('FARMER');
    await createProductFor(farmer);

    const res = await api.delete(`/api/admin/users/${farmer.id}`).set(authHeader(admin));
    expect(res.status).toBe(200);

    const users = await api.get('/api/admin/users').set(authHeader(admin));
    expect(users.body.data.some((u: any) => u.id === farmer.id)).toBe(false);
  });

  it('prevents deleting admin accounts', async () => {
    const admin = await createAdmin();
    const otherAdmin = await createAdmin();
    const res = await api.delete(`/api/admin/users/${otherAdmin.id}`).set(authHeader(admin));
    expect(res.status).toBe(403);
  });

  it('prevents deleting your own account', async () => {
    const admin = await createAdmin();
    const res = await api.delete(`/api/admin/users/${admin.id}`).set(authHeader(admin));
    expect(res.status).toBe(403);
  });
});
