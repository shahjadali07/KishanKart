import { connectTestDB, disconnectTestDB, clearCollections } from './db.utils';
import { api, createUser, createAdmin, authHeader, createProductFor } from './helpers';

beforeAll(async () => {
  await connectTestDB('products');
  await clearCollections();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('Product / Produce Listings', () => {
  it('allows a farmer to create a listing', async () => {
    const farmer = await createUser('FARMER');
    const res = await createProductFor(farmer);
    expect(res.id).toBeDefined();
    expect(res.name).toMatch(/^Test Crop/);
    expect(res.price).toBe(25);
    expect(res.availableQuantity).toBe(100);
    expect(res.status).toBe('Active');
    expect(res.farmerId).toBe(farmer.id);
    expect(res.farmerName).toBe('FARMER Test');
  });

  it('validates product data on creation', async () => {
    const farmer = await createUser('FARMER');
    const res = await api
      .post('/api/products')
      .set(authHeader(farmer))
      .send({
        name: '',
        category: 'InvalidCategory',
        price: -5,
        unit: 'tonnes',
        availableQuantity: -1,
      });
    expect(res.status).toBe(400);
  });

  it('rejects product creation without authentication', async () => {
    const res = await api.post('/api/products').send({
      name: 'No Auth Crop',
      category: 'Vegetables',
      price: 10,
      unit: 'kg',
      availableQuantity: 5,
    });
    expect(res.status).toBe(401);
  });

  it('rejects product creation by a buyer', async () => {
    const buyer = await createUser('BUYER');
    const res = await api
      .post('/api/products')
      .set(authHeader(buyer))
      .send({
        name: 'Buyer Crop',
        category: 'Vegetables',
        price: 10,
        unit: 'kg',
        availableQuantity: 5,
      });
    expect(res.status).toBe(403);
  });

  it('lists only active listings publicly', async () => {
    const farmer = await createUser('FARMER');
    await createProductFor(farmer, { name: 'Public Wheat Crop', category: 'Grains' });
    await createProductFor(farmer, { name: 'Hidden Crop', status: 'Inactive' });

    const res = await api.get('/api/products');
    expect(res.status).toBe(200);
    const names = res.body.data.map((p: any) => p.name);
    expect(names).toContain('Public Wheat Crop');
    expect(names).not.toContain('Hidden Crop');
    expect(res.body.pagination).toBeDefined();
  });

  it('supports search by name', async () => {
    const farmer = await createUser('FARMER');
    await createProductFor(farmer, { name: 'Organic Basmati Rice' });
    await createProductFor(farmer, { name: 'Red Garlic' });

    const res = await api.get('/api/products?search=basmati');
    expect(res.status).toBe(200);
    expect(res.body.data.every((p: any) => p.name === 'Organic Basmati Rice')).toBe(true);
  });

  it('supports filtering by category, price range, and organic flag', async () => {
    const farmer = await createUser('FARMER');
    await createProductFor(farmer, { name: 'Premium Tomatoes', category: 'Vegetables', price: 40, isOrganic: true });
    await createProductFor(farmer, { name: 'Cheap Onions', category: 'Vegetables', price: 10, isOrganic: false });
    await createProductFor(farmer, { name: 'Mango', category: 'Fruits', price: 60 });

    const categoryRes = await api.get('/api/products?category=Vegetables');
    expect(categoryRes.body.data.every((p: any) => p.category === 'Vegetables')).toBe(true);

    const priceRes = await api.get('/api/products?minPrice=20&maxPrice=50');
    expect(priceRes.body.data.every((p: any) => p.price >= 20 && p.price <= 50)).toBe(true);

    const organicRes = await api.get('/api/products?isOrganic=true');
    expect(organicRes.body.data.every((p: any) => p.isOrganic === true)).toBe(true);
  });

  it('supports pagination', async () => {
    const farmer = await createUser('FARMER');
    for (let i = 0; i < 5; i++) {
      await createProductFor(farmer, { name: `Paginated Crop ${i}` });
    }

    const res = await api.get('/api/products?page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body.pagination.limit).toBe(2);
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(5);
    expect(res.body.pagination.totalPages).toBeGreaterThanOrEqual(3);
  });

  it('retrieves a single listing by id', async () => {
    const farmer = await createUser('FARMER');
    const product = await createProductFor(farmer);

    const res = await api.get(`/api/products/${product.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(product.id);
  });

  it('returns 404 for a nonexistent product', async () => {
    const res = await api.get('/api/products/012345678901234567890123');
    expect(res.status).toBe(404);
  });

  it('returns 400 for an invalid product id', async () => {
    const res = await api.get('/api/products/not-an-id');
    expect(res.status).toBe(400);
  });

  it('allows the owning farmer to update a listing', async () => {
    const farmer = await createUser('FARMER');
    const product = await createProductFor(farmer);

    const res = await api
      .patch(`/api/products/${product.id}`)
      .set(authHeader(farmer))
      .send({ price: 30, availableQuantity: 80 });
    expect(res.status).toBe(200);
    expect(res.body.data.price).toBe(30);
    expect(res.body.data.availableQuantity).toBe(80);
  });

  it('prevents another farmer from updating a listing', async () => {
    const farmerA = await createUser('FARMER');
    const farmerB = await createUser('FARMER');
    const product = await createProductFor(farmerA);

    const res = await api
      .patch(`/api/products/${product.id}`)
      .set(authHeader(farmerB))
      .send({ price: 999 });
    expect(res.status).toBe(403);
  });

  it('prevents buyers from updating listings', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer);

    const res = await api
      .patch(`/api/products/${product.id}`)
      .set(authHeader(buyer))
      .send({ price: 999 });
    expect(res.status).toBe(403);
  });

  it('allows the owning farmer to deactivate a listing', async () => {
    const farmer = await createUser('FARMER');
    const product = await createProductFor(farmer);

    const res = await api
      .patch(`/api/products/${product.id}/status`)
      .set(authHeader(farmer))
      .send({ status: 'Inactive' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Inactive');

    const listRes = await api.get('/api/products');
    expect(listRes.body.data.some((p: any) => p.id === product.id)).toBe(false);
  });

  it('allows the owning farmer to delete a listing', async () => {
    const farmer = await createUser('FARMER');
    const product = await createProductFor(farmer);

    const res = await api.delete(`/api/products/${product.id}`).set(authHeader(farmer));
    expect(res.status).toBe(200);

    const getRes = await api.get(`/api/products/${product.id}`);
    expect(getRes.status).toBe(404);
  });

  it('adjusts stock and records a stock log entry', async () => {
    const farmer = await createUser('FARMER');
    const product = await createProductFor(farmer, { availableQuantity: 50 });

    const res = await api
      .post(`/api/products/${product.id}/stock`)
      .set(authHeader(farmer))
      .send({ changeType: 'ADD', changeAmount: 25, reason: 'New harvest lot' });
    expect(res.status).toBe(200);
    expect(res.body.data.availableQuantity).toBe(75);

    const historyRes = await api
      .get(`/api/products/${product.id}/stock`)
      .set(authHeader(farmer));
    expect(historyRes.status).toBe(200);
    expect(historyRes.body.data.length).toBeGreaterThanOrEqual(2);
    const lastLog = historyRes.body.data[0];
    expect(lastLog.changeType).toBe('ADD');
    expect(lastLog.newStock).toBe(75);
  });

  it('prevents negative stock when subtracting more than available', async () => {
    const farmer = await createUser('FARMER');
    const product = await createProductFor(farmer, { availableQuantity: 10 });

    const res = await api
      .post(`/api/products/${product.id}/stock`)
      .set(authHeader(farmer))
      .send({ changeType: 'SUBTRACT', changeAmount: 50 });
    expect(res.status).toBe(200);
    // Clamps to zero and marks out of stock
    expect(res.body.data.availableQuantity).toBe(0);
    expect(res.body.data.status).toBe('Out of Stock');
  });

  it('returns farmer listings including inactive from /mine', async () => {
    const farmer = await createUser('FARMER');
    await createProductFor(farmer, { name: 'Mine Active Crop' });
    await createProductFor(farmer, { name: 'Mine Inactive Crop', status: 'Inactive' });

    const res = await api.get('/api/products/mine').set(authHeader(farmer));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it('allows an admin to moderate listings', async () => {
    const farmer = await createUser('FARMER');
    const admin = await createAdmin();
    const product = await createProductFor(farmer);

    const res = await api
      .patch(`/api/products/${product.id}/status`)
      .set(authHeader(admin))
      .send({ status: 'Pending Approval', rejectionReason: 'Awaiting grading reports' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Pending Approval');
    expect(res.body.data.rejectionReason).toBe('Awaiting grading reports');
  });

  it('prevents activating a listing with zero stock', async () => {
    const farmer = await createUser('FARMER');
    const product = await createProductFor(farmer, { availableQuantity: 0 });

    const res = await api
      .patch(`/api/products/${product.id}/status`)
      .set(authHeader(farmer))
      .send({ status: 'Active' });
    expect(res.status).toBe(400);
  });
});
