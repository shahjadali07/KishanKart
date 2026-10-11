export type FarmerProductCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Spices'
  | 'Dairy'
  | 'Organic'
  | 'Seasonal Crops'
  | 'Seeds';

export type FarmerProductStatus =
  | 'Active'
  | 'Inactive'
  | 'Out of Stock'
  | 'Pending Approval';

export interface FarmerProduct {
  id: string;
  farmerId: string;
  name: string;
  hindiName?: string;
  description: string;
  category: FarmerProductCategory;
  images: string[];
  price: number;
  unit: string; // 'kg', 'quintal', 'box', 'litre'
  availableQuantity: number;
  minimumOrderQuantity: number;
  lowStockThreshold: number;
  isOrganic: boolean;
  location: string;
  mandi: string;
  grade: 'Grade A' | 'Grade B' | 'Export Quality' | 'Certified Organic';
  status: FarmerProductStatus;
  harvestDate: string;
  createdAt: string;
  updatedAt: string;
}

export type FarmerOrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type FarmerPaymentStatus =
  | 'Pending'
  | 'Processing'
  | 'Paid'
  | 'Failed'
  | 'Refunded';

export interface FarmerOrderItem {
  productId: string;
  productName: string;
  image?: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  subtotal: number;
}

export interface FarmerOrder {
  id: string;
  farmerId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  items: FarmerOrderItem[];
  subtotal: number;
  deliveryCharges: number;
  totalAmount: number;
  deliveryAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    state: string;
    pinCode: string;
  };
  orderDate: string;
  paymentStatus: FarmerPaymentStatus;
  orderStatus: FarmerOrderStatus;
  logisticsPartner?: string;
  trackingNumber?: string;
  expectedDeliveryDate?: string;
  timeline: {
    status: FarmerOrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface StockHistoryItem {
  id: string;
  productId: string;
  productName: string;
  changeType: 'ADD' | 'SUBTRACT' | 'SET';
  changeAmount: number;
  previousStock: number;
  newStock: number;
  reason: string;
  timestamp: string;
}

export interface FarmerCustomer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  location: string;
  businessType?: string;
  totalOrders: number;
  totalSpending: number;
  lastOrderDate: string;
  registeredDate: string;
}

export interface FarmerTransaction {
  id: string;
  farmerId: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  date: string;
  paymentStatus: FarmerPaymentStatus;
  paymentMethod: string;
  bankRefNumber?: string;
}

export interface FarmerDeliveryItem {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  deliveryAddress: string;
  pickupStatus: 'Ready for Pickup' | 'Pickup Scheduled' | 'Picked Up';
  deliveryStatus: 'Ready for Pickup' | 'Pickup Scheduled' | 'In Transit' | 'Delivered';
  expectedDelivery: string;
  logisticsPartner: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
}

export interface FarmerOffer {
  id: string;
  farmerId: string;
  offerName: string;
  productId: string;
  productName: string;
  discountType: 'Percentage' | 'Fixed Amount';
  discountValue: number;
  startDate: string;
  endDate: string;
  maximumUsage: number;
  timesUsed: number;
  status: 'Active' | 'Inactive' | 'Expired';
}

export type FarmerNotificationType =
  | 'New Order'
  | 'Order Status Changed'
  | 'Payment Received'
  | 'Low Stock'
  | 'Out of Stock'
  | 'Product Approved'
  | 'Product Rejected'
  | 'Admin Announcement';

export interface FarmerNotification {
  id: string;
  farmerId: string;
  type: FarmerNotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface FarmerProfile {
  id: string;
  farmerName: string;
  profileImage?: string;
  email: string;
  phone: string;
  farmName: string;
  farmAddress: string;
  village: string;
  district: string;
  state: string;
  pinCode: string;
  farmType: string; // 'Organic Certified', 'Traditional APMC', 'Greenhouse', etc.
  farmSize: string; // e.g. '5.5 Acres'
  kycStatus: 'Pending' | 'Verified' | 'Rejected';
  soilHealthGrade: string;
  bankAccount?: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    holderName: string;
    upiId: string;
  };
}

export interface FarmerDashboardStats {
  totalProducts: number;
  activeOrders: number;
  totalRevenue: number;
  availableStock: number;
  revenueGrowth: number;
  lowStockCount: number;
}
