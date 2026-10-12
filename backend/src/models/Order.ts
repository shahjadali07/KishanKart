import mongoose from 'mongoose';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface OrderItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  unit: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  updatedBy?: string;
}

export interface IOrder extends mongoose.Document {
  orderNumber: string;
  buyerId: mongoose.Types.ObjectId;
  buyerName: string;
  farmerId: mongoose.Types.ObjectId;
  farmerName: string;
  farmerLocation?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharges: number;
  discount: number;
  commissionAmount: number;
  farmerNetPayout: number;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  cancelledReason?: string;
  cancellationInitiatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Processing', 'Cancelled'],
  Processing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

function buildOrderNumber(): string {
  return `KK-${Math.floor(10000 + Math.random() * 90000)}`;
}

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true, trim: true },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0.0001 },
  pricePerUnit: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 },
  image: String,
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  phone: { type: String, required: true, trim: true, maxlength: 15 },
  address: { type: String, trim: true, maxlength: 500 },
  city: { type: String, trim: true, maxlength: 120 },
  district: { type: String, trim: true, maxlength: 120 },
  state: { type: String, trim: true, maxlength: 120 },
  pinCode: { type: String, trim: true, maxlength: 10 },
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: String,
  updatedBy: String,
}, { _id: false });

const orderSchema = new mongoose.Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true, index: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  buyerName: { type: String, trim: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  farmerName: { type: String, trim: true },
  farmerLocation: { type: String, trim: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true, min: 0 },
  deliveryCharges: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  commissionAmount: { type: Number, default: 0, min: 0 },
  farmerNetPayout: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  shippingAddress: { type: shippingAddressSchema, required: true },
  paymentMethod: { type: String, trim: true, maxlength: 60 },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending',
    index: true,
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
    index: true,
  },
  statusHistory: [statusHistorySchema],
  cancelledReason: String,
  cancellationInitiatedBy: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

orderSchema.pre<IOrder>('save', function () {
  if (!this.orderNumber) {
    this.orderNumber = buildOrderNumber();
  }
  if (!this.statusHistory || this.statusHistory.length === 0) {
    this.statusHistory = [{ status: this.orderStatus, timestamp: new Date() }];
  }
});

orderSchema.statics.canTransition = function (from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_TRANSITIONS[from]?.includes(to) ?? false;
};

export default mongoose.model<IOrder>('Order', orderSchema);
export type OrderModel = mongoose.Model<IOrder> & {
  canTransition(from: OrderStatus, to: OrderStatus): boolean;
};
