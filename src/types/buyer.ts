export type ProductCategory = 
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Spices'
  | 'Dairy'
  | 'Organic'
  | 'Seasonal Crops';

export interface BuyerProduct {
  id: string;
  name: string;
  hindiName?: string;
  category: ProductCategory;
  price: number;
  unit: string; // e.g. 'kg', 'quintal', 'box', 'litre'
  farmer: string;
  farmerId: string;
  location: string;
  mandi: string;
  state: string;
  rating: number;
  reviewsCount: number;
  stock: number; // in unit
  minOrderQty: number;
  image: string;
  description: string;
  isOrganic: boolean;
  harvestDate: string;
  grade: 'Grade A' | 'Grade B' | 'Export Quality' | 'Certified Organic';
  isFeatured?: boolean;
  isRecommended?: boolean;
}

export interface BuyerCategory {
  id: string;
  name: ProductCategory;
  hindiName: string;
  icon: string;
  count: number;
  description: string;
}

export interface BuyerCartItem {
  product: BuyerProduct;
  quantity: number;
}

export interface BuyerAddress {
  id: string;
  fullName: string;
  phone: string;
  houseStreet: string;
  villageCity: string;
  district: string;
  state: string;
  pinCode: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
}

export type OrderStatusType = 
  | 'Placed'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  product: BuyerProduct;
  quantity: number;
  price: number;
}

export interface BuyerOrder {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatusType;
  address: BuyerAddress;
  paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Cash on Delivery' | 'Net Banking';
  paymentStatus: 'Successful' | 'Pending' | 'Failed' | 'Refunded';
  deliveryPartner: string;
  deliveryDate: string;
  trackingNumber: string;
  farmerContact: string;
  timeline: {
    status: OrderStatusType;
    time: string;
    completed: boolean;
    description: string;
  }[];
}

export interface BuyerPaymentMethod {
  id: string;
  type: 'UPI' | 'Card';
  title: string;
  details: string;
  isDefault: boolean;
}

export interface BuyerTransaction {
  id: string;
  orderId: string;
  amount: number;
  date: string;
  status: 'Successful' | 'Pending' | 'Failed' | 'Refunded';
  method: string;
}

export interface BuyerNotification {
  id: string;
  title: string;
  message: string;
  category: 'Orders' | 'Delivery' | 'Payments' | 'Offers' | 'Product availability';
  timestamp: string;
  read: boolean;
  link?: string;
}
