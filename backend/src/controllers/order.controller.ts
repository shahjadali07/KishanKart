import { Request, Response, NextFunction } from 'express';
import mongoose, { ClientSession, isValidObjectId } from 'mongoose';
import Order, { IOrder, OrderStatus, ORDER_TRANSITIONS, OrderModel } from '../models/Order';
import Product from '../models/Product';
import StockLog from '../models/StockLog';
import { parsePagination, parseSort } from '../middleware/validate.middleware';
import { NotFoundError, ForbiddenError, ValidationError, ApiError } from '../utils/errors';

const CANCELLABLE_BY_BUYER: OrderStatus[] = ['Pending'];
const CANCELLABLE_BY_FARMER: OrderStatus[] = ['Pending', 'Confirmed', 'Processing'];

function toOrderResponse(order: IOrder) {
  return {
    id: order._id,
    _id: order._id,
    orderNumber: order.orderNumber,
    buyerId: order.buyerId,
    buyerName: order.buyerName,
    farmerId: order.farmerId,
    farmerName: order.farmerName,
    farmerLocation: order.farmerLocation,
    items: order.items,
    subtotal: order.subtotal,
    deliveryCharges: order.deliveryCharges,
    discount: order.discount,
    commissionAmount: order.commissionAmount,
    farmerNetPayout: order.farmerNetPayout,
    totalAmount: order.totalAmount,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    statusHistory: order.statusHistory,
    timeline: order.statusHistory,
    cancelledReason: order.cancelledReason,
    cancellationInitiatedBy: order.cancellationInitiatedBy,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

interface OrderItemInput {
  productId: string;
  quantity: number;
}

interface ValidatedItem {
  productId: string;
  product: any;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
}

let transactionsSupported: boolean | undefined;

async function transactionsAvailable(): Promise<boolean> {
  if (transactionsSupported !== undefined) {
    return transactionsSupported;
  }
  let session: ClientSession | undefined;
  try {
    session = await mongoose.startSession();
    // Probe with a REAL operation: an empty transaction can succeed
    // without exercising transaction support on the server.
    await session.withTransaction(async () => {
      await mongoose.connection.db!
        .collection('_txn_probe')
        .insertOne({ _id: new mongoose.Types.ObjectId(), at: new Date() }, { session });
    });
    transactionsSupported = true;
  } catch {
    transactionsSupported = false;
  } finally {
    session?.endSession();
  }
  // Best-effort cleanup of the probe collection
  await mongoose.connection.db!.collection('_txn_probe').drop().catch(() => undefined);
  return transactionsSupported;
}

async function withTransaction<T>(fn: (session: ClientSession | null) => Promise<T>): Promise<T> {
  const useTxn = await transactionsAvailable();
  if (!useTxn) {
    return fn(null);
  }
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(() => fn(session));
  } finally {
    session.endSession();
  }
}

function buildOrderNumber(): string {
  return `KK-${Math.floor(10000 + Math.random() * 90000)}`;
}

const ADDRESS_FIELDS = ['fullName', 'phone', 'address', 'city', 'district', 'state', 'pinCode'] as const;

export const placeOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Validation failed', { items: ['At least one order item is required'] });
    }
    if (items.length > 50) {
      throw new ValidationError('Validation failed', { items: ['A single order can contain at most 50 items'] });
    }
    if (!shippingAddress || typeof shippingAddress !== 'object') {
      throw new ValidationError('Validation failed', { shippingAddress: ['Shipping address is required'] });
    }
    for (const field of ADDRESS_FIELDS) {
      if (!shippingAddress[field] || !String(shippingAddress[field]).trim()) {
        throw new ValidationError('Validation failed', {
          shippingAddress: [`shippingAddress.${field} is required`],
        });
      }
    }
    if (!shippingAddress.phone || !/^[6-9]\d{9}$/.test(String(shippingAddress.phone))) {
      throw new ValidationError('Validation failed', {
        shippingAddress: ['shippingAddress.phone must be a valid 10-digit mobile number'],
      });
    }

    const validated: ValidatedItem[] = [];
    for (const raw of items) {
      if (!raw || typeof raw !== 'object') {
        throw new ValidationError('Validation failed', { items: ['Each item must be an object'] });
      }
      const productId = String(raw.productId ?? '');
      const quantity = Number(raw.quantity);

      if (!isValidObjectId(productId)) {
        throw new ValidationError('Validation failed', { items: ['Each item requires a valid productId'] });
      }
      if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new ValidationError('Validation failed', { items: ['Each item requires a positive quantity'] });
      }

      const product = await Product.findById(productId);
      if (!product) {
        throw new NotFoundError(`Product ${productId} not found`);
      }
      if (product.status !== 'Active') {
        throw new ValidationError('Validation failed', {
          items: [`${product.name} is not currently available (status: ${product.status})`],
        });
      }
      if (quantity < product.minimumOrderQuantity) {
        throw new ValidationError('Validation failed', {
          items: [`${product.name} requires a minimum order of ${product.minimumOrderQuantity} ${product.unit}`],
        });
      }
      if (quantity > product.availableQuantity) {
        throw new ValidationError('Validation failed', {
          items: [`Insufficient stock for ${product.name}. Available: ${product.availableQuantity} ${product.unit}`],
        });
      }

      validated.push({
        productId,
        product,
        quantity,
        pricePerUnit: product.price,
        subtotal: Math.round(product.price * quantity * 100) / 100,
      });
    }

    // Group items by farmer: one order per farmer (split-order model)
    const groups = new Map<string, ValidatedItem[]>();
    for (const item of validated) {
      const farmerKey = item.product.farmerId.toString();
      if (!groups.has(farmerKey)) groups.set(farmerKey, []);
      groups.get(farmerKey)!.push(item);
    }

    const buyer = await mongoose.model('User').findById(req.user!.id);
    const buyerName = buyer?.name ?? 'Buyer';

    const attemptPlacement = async (): Promise<IOrder[]> => {
      return withTransaction(async (session) => {
        const orders: IOrder[] = [];

        for (const [farmerKey, farmerItems] of groups) {
          const farmer = await mongoose.model('User').findById(farmerKey).session(session ?? null);
          if (!farmer) {
            throw new NotFoundError('Seller account no longer exists');
          }

          // Atomic stock check + decrement per item (protects against overselling)
          for (const item of farmerItems) {
            const decremented = await Product.findOneAndUpdate(
              {
                _id: item.productId,
                farmerId: farmerKey,
                availableQuantity: { $gte: item.quantity },
              },
              { $inc: { availableQuantity: -item.quantity } },
              { new: true, session: session ?? undefined }
            );
            if (!decremented) {
              throw new ApiError(409, `Insufficient stock for ${item.product.name}. Please refresh and try again.`);
            }
            if (decremented.availableQuantity === 0) {
              await Product.findByIdAndUpdate(
                item.productId,
                { status: 'Out of Stock' },
                { new: true, session: session ?? undefined }
              );
            }
            await StockLog.create([{
              productId: item.productId,
              productName: item.product.name,
              farmerId: new mongoose.Types.ObjectId(farmerKey),
              changeType: 'SUBTRACT',
              changeAmount: item.quantity,
              previousStock: item.product.availableQuantity,
              newStock: decremented.availableQuantity,
              reason: 'Order placed',
              refModel: 'Order',
            }], { session: session ?? undefined });
          }

          const subtotal = farmerItems.reduce((sum, i) => sum + i.subtotal, 0);
          const total = Math.round(subtotal * 100) / 100;

          const order = new (Order as OrderModel)({
            orderNumber: buildOrderNumber(),
            buyerId: req.user!.id,
            buyerName,
            farmerId: farmerKey,
            farmerName: farmer.name,
            farmerLocation: farmer.location,
            items: farmerItems.map(i => ({
              productId: i.productId,
              productName: i.product.name,
              unit: i.product.unit,
              quantity: i.quantity,
              pricePerUnit: i.pricePerUnit,
              subtotal: i.subtotal,
              image: Array.isArray(i.product.images) && i.product.images.length ? i.product.images[0] : undefined,
            })),
            subtotal: subtotal,
            deliveryCharges: 0,
            discount: 0,
            commissionAmount: 0,
            farmerNetPayout: total,
            totalAmount: total,
            shippingAddress,
            paymentMethod: paymentMethod || 'Cash on Delivery',
            paymentStatus: 'Pending',
            orderStatus: 'Pending',
            // insertMany does not run pre-save hooks, so the
            // initial status entry is set explicitly here.
            statusHistory: [{ status: 'Pending', timestamp: new Date() }],
          });

          orders.push(order);
        }

        await (Order as OrderModel).insertMany(orders, { session: session ?? undefined, ordered: false } as any);
        return orders;
      });
    };

    let created: IOrder[];
    try {
      created = await attemptPlacement();
    } catch (error: any) {
      // Retry once on transient order-number collisions (unique index)
      if (error && error.code === 11000) {
        created = await attemptPlacement();
      } else {
        throw error;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: created.map(toOrderResponse),
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const { sortBy, order } = parseSort(req, ['createdAt', 'totalAmount'], 'createdAt');

    const filter: any = { buyerId: req.user!.id };
    const status = String(req.query.status ?? '').trim();
    if (status && ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      filter.orderStatus = status;
    }

    const [items, total] = await Promise.all([
      Order.find(filter).sort({ [sortBy]: order }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items.map(toOrderResponse),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: skip + items.length < total },
    });
  } catch (error) {
    next(error);
  }
};

export const getFarmerOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const { sortBy, order } = parseSort(req, ['createdAt', 'totalAmount'], 'createdAt');

    const filter: any = { farmerId: req.user!.id };
    const status = String(req.query.status ?? '').trim();
    if (status && ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      filter.orderStatus = status;
    }

    const [items, total] = await Promise.all([
      Order.find(filter).sort({ [sortBy]: order }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items.map(toOrderResponse),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: skip + items.length < total },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const { sortBy, order } = parseSort(req, ['createdAt', 'totalAmount'], 'createdAt');

    const filter: any = {};
    const status = String(req.query.status ?? '').trim();
    if (status && ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      filter.orderStatus = status;
    }
    const paymentStatus = String(req.query.paymentStatus ?? '').trim();
    if (paymentStatus && ['Pending', 'Paid', 'Failed', 'Refunded'].includes(paymentStatus)) {
      filter.paymentStatus = paymentStatus;
    }
    const search = String(req.query.search ?? '').trim();
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { buyerName: { $regex: search, $options: 'i' } },
        { farmerName: { $regex: search, $options: 'i' } },
      ];
    }
    const buyerId = String(req.query.buyerId ?? '').trim();
    if (isValidObjectId(buyerId)) filter.buyerId = buyerId;
    const farmerId = String(req.query.farmerId ?? '').trim();
    if (isValidObjectId(farmerId)) filter.farmerId = farmerId;

    const [items, total] = await Promise.all([
      Order.find(filter).sort({ [sortBy]: order }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items.map(toOrderResponse),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: skip + items.length < total },
    });
  } catch (error) {
    next(error);
  }
};

async function findOrderAccessible(id: string, userId: string, role: string): Promise<IOrder | null> {
  if (!isValidObjectId(id)) return null;
  if (role === 'ADMIN') {
    return Order.findById(id);
  }
  return Order.findOne({ _id: id, $or: [{ buyerId: userId }, { farmerId: userId }] });
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = String(req.params.id);
    const order = await findOrderAccessible(id, req.user!.id, req.user!.role);
    if (!order) {
      if (!isValidObjectId(id)) {
        throw new ValidationError('Invalid order id', { id: ['id must be a valid order id'] });
      }
      throw new NotFoundError('Order not found');
    }
    res.json({ success: true, data: toOrderResponse(order) });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, note } = req.body;

    if (!status || !(Object.keys(ORDER_TRANSITIONS) as string[]).includes(status)) {
      throw new ValidationError('Validation failed', {
        status: [`status must be one of: ${(Object.keys(ORDER_TRANSITIONS) as string[]).join(', ')}`],
      });
    }

    const order = await findOrderAccessible(String(req.params.id), req.user!.id, req.user!.role);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const isOwnerFarmer = order.farmerId.toString() === req.user!.id;
    const isAdmin = req.user!.role === 'ADMIN';
    if (!isOwnerFarmer && !isAdmin) {
      throw new ForbiddenError('Only the selling farmer or an admin can update order status');
    }

    const target = status as OrderStatus;
    const allowed = ORDER_TRANSITIONS[order.orderStatus] ?? [];
    if (!allowed.includes(target)) {
      throw new ValidationError(
        `Invalid status transition from ${order.orderStatus} to ${target}. Allowed: ${allowed.join(', ') || 'none'}`,
      );
    }

    order.orderStatus = target;
    order.statusHistory.push({
      status: target,
      timestamp: new Date(),
      note: note || `Order updated to ${target}`,
      updatedBy: req.user!.id,
    });
    await order.save();

    res.json({ success: true, message: `Order status updated to ${target}`, data: toOrderResponse(order) });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(String(req.params.id));
    if (!order) {
      if (!isValidObjectId(req.params.id)) {
        throw new ValidationError('Invalid order id', { id: ['id must be a valid order id'] });
      }
      throw new NotFoundError('Order not found');
    }

    const isBuyer = order.buyerId.toString() === req.user!.id;
    const isFarmer = order.farmerId.toString() === req.user!.id;
    const isAdmin = req.user!.role === 'ADMIN';

    if (!isBuyer && !isFarmer && !isAdmin) {
      throw new ForbiddenError('You do not have access to this order');
    }

    let cancellable = false;
    if (isAdmin) {
      cancellable = (ORDER_TRANSITIONS[order.orderStatus] ?? []).includes('Cancelled');
    } else if (isBuyer) {
      cancellable = CANCELLABLE_BY_BUYER.includes(order.orderStatus);
    } else {
      cancellable = CANCELLABLE_BY_FARMER.includes(order.orderStatus);
    }

    if (!cancellable) {
      throw new ValidationError(
        `Order cannot be cancelled from status ${order.orderStatus}. ` +
        (isBuyer ? 'Buyers may cancel only pending orders.' : 'This order is already finalised.'),
      );
    }

    // Restore stock for each item (idempotent guard: only run on state change)
    for (const item of order.items) {
      await Product.findOneAndUpdate(
        { _id: item.productId },
        {
          $inc: { availableQuantity: item.quantity },
          $set: { status: 'Active' },
        }
      );
      const product = await Product.findById(item.productId);
      await StockLog.create({
        productId: item.productId,
        productName: item.productName,
        farmerId: order.farmerId,
        changeType: 'ADD',
        changeAmount: item.quantity,
        previousStock: product ? product.availableQuantity - item.quantity : 0,
        newStock: product ? product.availableQuantity : item.quantity,
        reason: `Order ${order.orderNumber} cancelled`,
        refModel: 'Order',
        refId: order.orderNumber,
      });
    }

    order.orderStatus = 'Cancelled';
    order.cancelledReason = reason || (isBuyer ? 'Cancelled by buyer' : isFarmer ? 'Cancelled by farmer' : 'Cancelled by admin');
    order.cancellationInitiatedBy = req.user!.id;
    order.statusHistory.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: order.cancelledReason,
      updatedBy: req.user!.id,
    });
    await order.save();

    res.json({ success: true, message: 'Order cancelled and stock restored', data: toOrderResponse(order) });
  } catch (error) {
    next(error);
  }
};

export const updateOrderPaymentStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { paymentStatus } = req.body;

    if (!paymentStatus || !['Pending', 'Paid', 'Failed', 'Refunded'].includes(paymentStatus)) {
      throw new ValidationError('Validation failed', {
        paymentStatus: ['paymentStatus must be one of: Pending, Paid, Failed, Refunded'],
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('Only administrators can update payment status');
    }

    order.paymentStatus = paymentStatus as any;
    order.statusHistory.push({
      status: order.orderStatus,
      timestamp: new Date(),
      note: `Payment status changed to ${paymentStatus}`,
      updatedBy: req.user!.id,
    });
    await order.save();

    res.json({ success: true, data: toOrderResponse(order) });
  } catch (error) {
    next(error);
  }
};
