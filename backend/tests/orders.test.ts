import { connectTestDB, disconnectTestDB, clearCollections } from './db.utils';
import { api, createUser, createAdmin, authHeader, createProductFor } from './helpers';
import Product from '../src/models/Product';

const address = {
  fullName: 'Buyer Name',
  phone: '9876543210',
  address: '123 Market Road',
  city: 'Lucknow',
  district: 'Lucknow',
  state: 'Uttar Pradesh',
  pinCode: '226001',
};

async function placeOrder(user: any, items: any[], shippingAddress = address) {
  return api
    .post('/api/orders')
    .set(authHeader(user))
    .send({ items, shippingAddress, paymentMethod: 'Cash on Delivery' });
}

beforeAll(async () => {
  await connectTestDB('orders');
  await clearCollections();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('Orders', () => {
  it('places an order and decrements stock atomically', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer, { price: 25, availableQuantity: 100, minimumOrderQuantity: 5 });

    const res = await placeOrder(buyer, [{ productId: product.id, quantity: 20 }]);
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveLength(1);

    const order = res.body.data[0];
    expect(order.orderNumber).toMatch(/^KK-\d{5}$/);
    expect(order.orderStatus).toBe('Pending');
    expect(order.paymentStatus).toBe('Pending');
    // Server-computed totals
    expect(order.subtotal).toBe(25 * 20);
    expect(order.totalAmount).toBe(25 * 20);
    expect(order.farmerNetPayout).toBe(25 * 20);
    expect(order.items[0].pricePerUnit).toBe(25);
    expect(order.farmerId).toBe(farmer.id);
    expect(order.buyerId).toBe(buyer.id);

    // Stock decremented
    const stored = await Product.findById(product.id);
    expect(stored!.availableQuantity).toBe(80);
  });

  it('splits a multi-farmer cart into one order per farmer', async () => {
    const farmerA = await createUser('FARMER');
    const farmerB = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const productA = await createProductFor(farmerA, { name: 'Crop A', availableQuantity: 50 });
    const productB = await createProductFor(farmerB, { name: 'Crop B', availableQuantity: 50 });

    const res = await placeOrder(buyer, [
      { productId: productA.id, quantity: 10 },
      { productId: productB.id, quantity: 10 },
    ]);
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveLength(2);
    const farmerIds = res.body.data.map((o: any) => o.farmerId.toString());
    expect(farmerIds).toContain(farmerA.id);
    expect(farmerIds).toContain(farmerB.id);
  });

  it('rejects orders exceeding available stock', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer, { availableQuantity: 10 });

    const res = await placeOrder(buyer, [{ productId: product.id, quantity: 11 }]);
    expect(res.status).toBe(400);

    const stored = await Product.findById(product.id);
    expect(stored!.availableQuantity).toBe(10);
  });

  it('rejects orders below the minimum order quantity', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer, { availableQuantity: 100, minimumOrderQuantity: 10 });

    const res = await placeOrder(buyer, [{ productId: product.id, quantity: 5 }]);
    expect(res.status).toBe(400);
  });

  it('rejects orders for inactive listings', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer, { status: 'Inactive', availableQuantity: 100 });

    const res = await placeOrder(buyer, [{ productId: product.id, quantity: 5 }]);
    expect(res.status).toBe(400);
  });

  it('rejects orders for nonexistent products', async () => {
    const buyer = await createUser('BUYER');
    const res = await placeOrder(buyer, [{ productId: '012345678901234567890123', quantity: 1 }]);
    expect(res.status).toBe(404);
  });

  it('rejects orders with an invalid shipping address', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer, { availableQuantity: 50 });

    const res = await placeOrder(buyer, [{ productId: product.id, quantity: 1 }], {
      ...address,
      phone: '12345',
    });
    expect(res.status).toBe(400);
  });

  it('rejects orders from farmers (buyers only)', async () => {
    const farmer = await createUser('FARMER');
    const product = await createProductFor(farmer, { availableQuantity: 50 });
    const res = await placeOrder(farmer, [{ productId: product.id, quantity: 1 }]);
    expect(res.status).toBe(403);
  });

  it('prevents overselling under concurrent orders for the last unit', async () => {
    const farmer = await createUser('FARMER');
    const buyerA = await createUser('BUYER');
    const buyerB = await createUser('BUYER');
    const product = await createProductFor(farmer, { availableQuantity: 1 });

    const [resA, resB] = await Promise.all([
      placeOrder(buyerA, [{ productId: product.id, quantity: 1 }]),
      placeOrder(buyerB, [{ productId: product.id, quantity: 1 }]),
    ]);

    const successes = [resA, resB].filter((r) => r.status === 201);
    const failures = [resA, resB].filter((r) => r.status !== 201);
    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(1);

    const stored = await Product.findById(product.id);
    expect(stored!.availableQuantity).toBe(0);
    expect(stored!.status).toBe('Out of Stock');
  }, 20000);

  it('marks the listing out of stock when fully purchased', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer, { availableQuantity: 10, minimumOrderQuantity: 1 });

    await placeOrder(buyer, [{ productId: product.id, quantity: 10 }]);
    const stored = await Product.findById(product.id);
    expect(stored!.status).toBe('Out of Stock');
  });

  it('shows the order in the buyer order history', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer);

    await placeOrder(buyer, [{ productId: product.id, quantity: 5 }]);

    const res = await api.get('/api/orders/mine').set(authHeader(buyer));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].buyerId).toBe(buyer.id);
  });

  it('shows the order in the farmer order list', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer);

    await placeOrder(buyer, [{ productId: product.id, quantity: 5 }]);

    const farmerRes = await api.get('/api/orders/farmer').set(authHeader(farmer));
    expect(farmerRes.status).toBe(200);
    expect(farmerRes.body.data.length).toBe(1);
    expect(farmerRes.body.data[0].farmerId).toBe(farmer.id);

    // Other farmers cannot see it
    const otherFarmer = await createUser('FARMER');
    const otherRes = await api.get('/api/orders/farmer').set(authHeader(otherFarmer));
    expect(otherRes.body.data.length).toBe(0);
  });

  it('retrieves an order by id for the buyer and farmer', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer);
    const placeRes = await placeOrder(buyer, [{ productId: product.id, quantity: 5 }]);
    const orderId = placeRes.body.data[0].id;

    const buyerRes = await api.get(`/api/orders/${orderId}`).set(authHeader(buyer));
    expect(buyerRes.status).toBe(200);

    const farmerRes = await api.get(`/api/orders/${orderId}`).set(authHeader(farmer));
    expect(farmerRes.status).toBe(200);

    const stranger = await createUser('BUYER');
    const strangerRes = await api.get(`/api/orders/${orderId}`).set(authHeader(stranger));
    expect(strangerRes.status).toBe(404);
  });

  it('allows the farmer to progress order status through valid transitions', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer);
    const placeRes = await placeOrder(buyer, [{ productId: product.id, quantity: 5 }]);
    const orderId = placeRes.body.data[0].id;

    const confirm = await api
      .patch(`/api/orders/${orderId}/status`)
      .set(authHeader(farmer))
      .send({ status: 'Confirmed' });
    expect(confirm.status).toBe(200);
    expect(confirm.body.data.orderStatus).toBe('Confirmed');
    expect(confirm.body.data.statusHistory).toHaveLength(2);

    const processRes = await api
      .patch(`/api/orders/${orderId}/status`)
      .set(authHeader(farmer))
      .send({ status: 'Processing' });
    expect(processRes.status).toBe(200);

    const shipRes = await api
      .patch(`/api/orders/${orderId}/status`)
      .set(authHeader(farmer))
      .send({ status: 'Shipped' });
    expect(shipRes.status).toBe(200);

    const deliverRes = await api
      .patch(`/api/orders/${orderId}/status`)
      .set(authHeader(farmer))
      .send({ status: 'Delivered' });
    expect(deliverRes.status).toBe(200);
  });

  it('rejects invalid status transitions', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer);
    const placeRes = await placeOrder(buyer, [{ productId: product.id, quantity: 5 }]);
    const orderId = placeRes.body.data[0].id;

    // Pending -> Shipped skips Confirmed/Processing
    const res = await api
      .patch(`/api/orders/${orderId}/status`)
      .set(authHeader(farmer))
      .send({ status: 'Shipped' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Invalid status transition/);
  });

  it('prevents a buyer from updating order status', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer);
    const placeRes = await placeOrder(buyer, [{ productId: product.id, quantity: 5 }]);
    const orderId = placeRes.body.data[0].id;

    const res = await api
      .patch(`/api/orders/${orderId}/status`)
      .set(authHeader(buyer))
      .send({ status: 'Confirmed' });
    expect(res.status).toBe(403);
  });

  it('lets a buyer cancel a pending order and restores stock', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer, { availableQuantity: 100 });
    const placeRes = await placeOrder(buyer, [{ productId: product.id, quantity: 30 }]);
    const orderId = placeRes.body.data[0].id;

    const cancelRes = await api
      .post(`/api/orders/${orderId}/cancel`)
      .set(authHeader(buyer))
      .send({ reason: 'Changed my mind' });
    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.data.orderStatus).toBe('Cancelled');

    const stored = await Product.findById(product.id);
    expect(stored!.availableQuantity).toBe(100);
    expect(stored!.status).toBe('Active');
  });

  it('prevents a buyer from cancelling a confirmed order', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer, { availableQuantity: 100 });
    const placeRes = await placeOrder(buyer, [{ productId: product.id, quantity: 5 }]);
    const orderId = placeRes.body.data[0].id;

    await api
      .patch(`/api/orders/${orderId}/status`)
      .set(authHeader(farmer))
      .send({ status: 'Confirmed' });

    const cancelRes = await api
      .post(`/api/orders/${orderId}/cancel`)
      .set(authHeader(buyer))
      .send({ reason: 'Too late' });
    expect(cancelRes.status).toBe(400);
  });

  it('lets a farmer cancel a pending order and restores stock', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer, { availableQuantity: 40 });
    const placeRes = await placeOrder(buyer, [{ productId: product.id, quantity: 10 }]);
    const orderId = placeRes.body.data[0].id;

    const cancelRes = await api
      .post(`/api/orders/${orderId}/cancel`)
      .set(authHeader(farmer))
      .send({ reason: 'Out of stock at farm gate' });
    expect(cancelRes.status).toBe(200);

    const stored = await Product.findById(product.id);
    expect(stored!.availableQuantity).toBe(40);
  });

  it('prevents cancelling a delivered order', async () => {
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer, { availableQuantity: 100 });
    const placeRes = await placeOrder(buyer, [{ productId: product.id, quantity: 5 }]);
    const orderId = placeRes.body.data[0].id;

    for (const status of ['Confirmed', 'Processing', 'Shipped', 'Delivered']) {
      await api
        .patch(`/api/orders/${orderId}/status`)
        .set(authHeader(farmer))
        .send({ status });
    }

    const cancelRes = await api
      .post(`/api/orders/${orderId}/cancel`)
      .set(authHeader(farmer))
      .send({ reason: 'nope' });
    expect(cancelRes.status).toBe(400);
  });

  it('allows an admin to list all orders with filters', async () => {
    const admin = await createAdmin();
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer);
    await placeOrder(buyer, [{ productId: product.id, quantity: 5 }]);

    const res = await api.get('/api/orders').set(authHeader(admin));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);

    const filtered = await api.get('/api/orders?status=Pending').set(authHeader(admin));
    expect(filtered.body.data.every((o: any) => o.orderStatus === 'Pending')).toBe(true);

    const search = await api.get(`/api/orders?search=${res.body.data[0].orderNumber}`).set(authHeader(admin));
    expect(search.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('prevents non-admins from listing all orders', async () => {
    const buyer = await createUser('BUYER');
    const res = await api.get('/api/orders').set(authHeader(buyer));
    expect(res.status).toBe(403);
  });

  it('allows an admin to update payment status', async () => {
    const admin = await createAdmin();
    const farmer = await createUser('FARMER');
    const buyer = await createUser('BUYER');
    const product = await createProductFor(farmer);
    const placeRes = await placeOrder(buyer, [{ productId: product.id, quantity: 5 }]);
    const orderId = placeRes.body.data[0].id;

    const res = await api
      .patch(`/api/orders/${orderId}/payment`)
      .set(authHeader(admin))
      .send({ paymentStatus: 'Paid' });
    expect(res.status).toBe(200);
    expect(res.body.data.paymentStatus).toBe('Paid');

    const farmerAttempt = await api
      .patch(`/api/orders/${orderId}/payment`)
      .set(authHeader(farmer))
      .send({ paymentStatus: 'Paid' });
    expect(farmerAttempt.status).toBe(403);
  });
});
