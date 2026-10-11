export type FarmerStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'BLOCKED';
export type KYCStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_SUBMITTED';
export type BuyerStatus = 'ACTIVE' | 'BLOCKED' | 'PENDING';
export type ProductStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'OUT_OF_STOCK';
export type ProductCategory = 
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Spices'
  | 'Dairy'
  | 'Organic Products'
  | 'Seeds';

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export type PaymentStatus = 'Paid' | 'Pending' | 'Escrow_Locked' | 'Refunded' | 'Failed';
export type DeliveryStatus = 
  | 'Assigned' 
  | 'Pending'
  | 'Pending_Pickup'
  | 'Dispatched' 
  | 'In_Transit' 
  | 'Out_For_Delivery' 
  | 'Delivered' 
  | 'Failed' 
  | 'Failed_Attempt';
export type ComplaintStatus = 'Open' | 'In Review' | 'Resolved' | 'Rejected';
export type ComplaintType = 'Product issue' | 'Delivery issue' | 'Payment issue' | 'Farmer issue' | 'Buyer issue' | 'Other';

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location: string;
  state: string;
  district: string;
  village: string;
  farmSize: string;
  crops: string[];
  productsCount: number;
  ordersCount: number;
  totalSales: number;
  kycStatus: KYCStatus;
  status: FarmerStatus;
  registeredDate: string;
  rejectionReason?: string;
  kycDocuments?: {
    type: string;
    documentNumber: string;
    submittedDate: string;
    verifiedDate?: string;
  }[];
  bankDetails?: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
    upiId: string;
  };
}

export interface Buyer {
  id: string;
  name: string;
  businessName: string;
  businessType: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  state: string;
  address: string;
  gstNumber?: string;
  fssaiNumber?: string;
  totalOrders: number;
  totalSpent: number;
  status: BuyerStatus;
  registeredDate: string;
}

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  grade: 'Grade A' | 'Grade B' | 'Organic';
  price: number;
  unit: string;
  stock: number;
  harvestDate: string;
  status: ProductStatus;
  createdAt: string;
  image?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerBusiness: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  items: OrderItem[];
  totalAmount: number;
  commissionAmount: number;
  farmerNetPayout: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  orderDate: string;
  deliveryDate?: string;
  shippingAddress: string;
  deliveryPartner?: string;
  timeline: {
    status: string;
    time: string;
    completed: boolean;
  }[];
}

export interface Transaction {
  id: string;
  orderId: string;
  buyerName: string;
  farmerName: string;
  amount: number;
  paymentMethod: 'UPI' | 'NetBanking' | 'Escrow_Auto' | 'Card';
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  date: string;
}

export interface Payout {
  id: string;
  farmerId: string;
  farmerName: string;
  orderId: string;
  grossAmount: number;
  commission: number;
  netPayout: number;
  status: 'Completed' | 'Pending' | 'In_Review';
  date: string;
  upiVpa: string;
}

export interface Refund {
  id: string;
  orderId: string;
  buyerName: string;
  amount: number;
  reason: string;
  status: 'Processed' | 'Pending' | 'Rejected';
  date: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  buyerName: string;
  farmerName: string;
  deliveryPartner: string;
  pickupLocation: string;
  destinationLocation: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  status: DeliveryStatus;
  expectedDelivery: string;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  type: ComplaintType;
  raisedBy: string;
  raisedByRole: 'Farmer' | 'Buyer';
  targetParty?: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  adminResponse?: string;
  resolvedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  audience: 'ALL' | 'FARMERS' | 'BUYERS' | 'SPECIFIC';
  targetUser?: string;
  sentAt: string;
  readCount: number;
}

export interface CategoryItem {
  id: string;
  name: ProductCategory;
  description: string;
  itemCount: number;
  active: boolean;
  iconName: string;
}

export interface AIInsight {
  id: string;
  type: 'DEMAND_SURGE' | 'SUPPLY_SHORTAGE' | 'PRICE_VOLATILITY' | 'SEASONAL_HARVEST';
  crop: string;
  headline: string;
  prediction: string;
  confidenceScore: number;
  timeframe: string;
  suggestedAction: string;
  isDemo: true;
}

export interface AdminStats {
  totalFarmers: number;
  farmersChange: string;
  totalBuyers: number;
  buyersChange: string;
  activeProducts: number;
  productsChange: string;
  totalOrders: number;
  ordersChange: string;
  todaySales: number;
  salesChange: string;
  pendingOrdersCount: number;
  pendingFarmerApprovalsCount: number;
  platformRevenue: number;
  revenueChange: string;
}
