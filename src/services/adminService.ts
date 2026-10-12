import {
  Farmer,
  Buyer,
  Product,
  Order,
  Transaction,
  Payout,
  Refund,
  Delivery,
  Complaint,
  NotificationItem,
  CategoryItem,
  AIInsight,
  AdminStats,
  FarmerStatus,
  ProductStatus,
  ComplaintStatus,
  OrderStatus,
  ProductCategory,
  KYCStatus
} from '@/types/admin';
import {
  mockAdminStats,
  mockFarmers,
  mockBuyers,
  mockProducts,
  mockOrders,
  mockTransactions,
  mockPayouts,
  mockRefunds,
  mockDeliveries,
  mockComplaints,
  mockNotifications,
  mockCategories,
  mockAIInsights
} from './adminMockData';
import { apiFetch } from './api';

// ---- API -> admin type mappers ----

const KYC_MAP: Record<string, KYCStatus> = {
  PENDING: 'PENDING',
  APPROVED: 'VERIFIED',
  REJECTED: 'REJECTED',
  NOT_SUBMITTED: 'NOT_SUBMITTED',
};

const FARMER_STATUS_MAP: Record<string, FarmerStatus> = {
  ACTIVE: 'APPROVED',
  BLOCKED: 'BLOCKED',
};

const REVERSE_FARMER_STATUS: Record<string, string> = {
  APPROVED: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  PENDING: 'ACTIVE',
  REJECTED: 'ACTIVE',
};

const ADMIN_PRODUCT_STATUS: Record<string, ProductStatus> = {
  Active: 'APPROVED',
  Inactive: 'REJECTED',
  'Out of Stock': 'OUT_OF_STOCK',
  'Pending Approval': 'PENDING',
};

const REVERSE_PRODUCT_STATUS: Record<string, string> = {
  APPROVED: 'Active',
  PENDING: 'Pending Approval',
  REJECTED: 'Inactive',
  OUT_OF_STOCK: 'Out of Stock',
};

const ADMIN_PAYMENT_STATUS: Record<string, string> = {
  Pending: 'Escrow_Locked',
  Paid: 'Paid',
  Failed: 'Failed',
  Refunded: 'Refunded',
};

function apiUserToFarmer(u: any, stats?: any): Farmer {
  const farm = u.farmDetails ?? {};
  return {
    id: (u.id ?? u._id ?? '').toString(),
    name: u.name ?? 'Farmer',
    phone: String(u.phone ?? ''),
    email: u.email,
    location: u.location ?? farm.district ?? '',
    state: farm.state ?? '',
    district: farm.district ?? '',
    village: farm.village ?? '',
    farmSize: farm.farmSize ?? '',
    crops: Array.isArray(farm.crops) ? farm.crops : [],
    productsCount: Number(stats?.productsCount ?? 0),
    ordersCount: Number(stats?.ordersCount ?? 0),
    totalSales: Number(stats?.totalSales ?? 0),
    kycStatus: KYC_MAP[u.kycStatus] ?? 'NOT_SUBMITTED',
    status: FARMER_STATUS_MAP[u.status] ?? 'APPROVED',
    registeredDate: u.createdAt ?? new Date().toISOString(),
    rejectionReason: u.rejectionReason,
  };
}

function apiUserToBuyer(u: any, stats?: any): Buyer {
  const biz = u.businessDetails ?? {};
  return {
    id: (u.id ?? u._id ?? '').toString(),
    name: u.name ?? 'Buyer',
    businessName: biz.businessName ?? u.name ?? 'Buyer',
    businessType: biz.businessType ?? '',
    phone: String(u.phone ?? ''),
    email: u.email ?? '',
    city: biz.city ?? u.location ?? '',
    district: '',
    state: '',
    address: biz.address ?? '',
    gstNumber: biz.gstNumber,
    totalOrders: Number(stats?.ordersCount ?? 0),
    totalSpent: Number(stats?.totalSpent ?? 0),
    status: u.status === 'BLOCKED' ? 'BLOCKED' : 'ACTIVE',
    registeredDate: u.createdAt ?? new Date().toISOString(),
  };
}

function apiProductToAdminProduct(p: any): Product {
  return {
    id: (p.id ?? p._id ?? '').toString(),
    title: p.name ?? 'Produce',
    category: (p.category ?? 'Vegetables') as ProductCategory,
    farmerId: (p.farmerId ?? '').toString(),
    farmerName: p.farmerName ?? '',
    farmerLocation: p.farmerLocation ?? p.location ?? '',
    grade: (p.grade ?? 'Grade A') as any,
    price: Number(p.price ?? 0),
    unit: p.unit ?? 'kg',
    stock: Number(p.availableQuantity ?? 0),
    harvestDate: p.harvestDate ?? '',
    status: ADMIN_PRODUCT_STATUS[p.status] ?? 'PENDING',
    createdAt: p.createdAt ?? new Date().toISOString(),
    image: Array.isArray(p.images) && p.images.length ? p.images[0] : undefined,
  };
}

function apiOrderToAdminOrder(o: any): Order {
  const addr = o.shippingAddress ?? {};
  const shippingAddress = addr.address
    ? `${addr.address}, ${addr.city ?? ''}, ${addr.district ?? ''}, ${addr.state ?? ''} ${addr.pinCode ?? ''}`
    : '';
  return {
    id: (o.id ?? o._id ?? '').toString(),
    buyerId: (o.buyerId ?? '').toString(),
    buyerName: o.buyerName ?? '',
    buyerBusiness: '',
    farmerId: (o.farmerId ?? '').toString(),
    farmerName: o.farmerName ?? '',
    farmerLocation: o.farmerLocation ?? '',
    items: (o.items ?? []).map((item: any) => ({
      productId: (item.productId ?? '').toString(),
      productName: item.productName ?? '',
      quantity: Number(item.quantity ?? 0),
      pricePerUnit: Number(item.pricePerUnit ?? 0),
      totalPrice: Number(item.subtotal ?? 0),
    })),
    totalAmount: Number(o.totalAmount ?? 0),
    commissionAmount: Number(o.commissionAmount ?? 0),
    farmerNetPayout: Number(o.farmerNetPayout ?? 0),
    paymentStatus: (ADMIN_PAYMENT_STATUS[o.paymentStatus] ?? 'Pending') as any,
    orderStatus: (o.orderStatus ?? 'Pending') as OrderStatus,
    orderDate: o.createdAt ?? new Date().toISOString(),
    shippingAddress,
    timeline: (o.statusHistory ?? []).map((h: any) => ({
      status: h.status ?? '',
      time: h.timestamp ? new Date(h.timestamp).toLocaleString('en-GB') : '',
      completed: true,
    })),
  };
}

function apiDashboardToAdminStats(d: any): AdminStats {
  return {
    ...mockAdminStats,
    totalFarmers: Number(d.totalFarmers ?? mockAdminStats.totalFarmers),
    totalBuyers: Number(d.totalBuyers ?? mockAdminStats.totalBuyers),
    activeProducts: Number(d.activeProducts ?? mockAdminStats.activeProducts),
    totalOrders: Number(d.totalOrders ?? mockAdminStats.totalOrders),
    todaySales: Number(d.todaySales ?? mockAdminStats.todaySales),
    pendingOrdersCount: Number(d.pendingOrdersCount ?? mockAdminStats.pendingOrdersCount),
    pendingFarmerApprovalsCount: Number(
      d.pendingFarmerApprovalsCount ?? mockAdminStats.pendingFarmerApprovalsCount
    ),
    platformRevenue: Number(d.platformRevenue ?? mockAdminStats.platformRevenue),
  };
}

// Persistent memory layer for admin session mutations
class AdminDataService {
  private farmers: Farmer[] = [...mockFarmers];
  private buyers: Buyer[] = [...mockBuyers];
  private products: Product[] = [...mockProducts];
  private orders: Order[] = [...mockOrders];
  private transactions: Transaction[] = [...mockTransactions];
  private payouts: Payout[] = [...mockPayouts];
  private refunds: Refund[] = [...mockRefunds];
  private deliveries: Delivery[] = [...mockDeliveries];
  private complaints: Complaint[] = [...mockComplaints];
  private notifications: NotificationItem[] = [...mockNotifications];
  private categories: CategoryItem[] = [...mockCategories];

  // Stats
  async getDashboardStats(): Promise<AdminStats> {
    const res = await apiFetch('/api/dashboard/admin');
    if (res.ok && res.data?.success && res.data.data) {
      return apiDashboardToAdminStats(res.data.data);
    }

    const pendingFarmers = this.farmers.filter(f => f.status === 'PENDING').length;
    const pendingOrders = this.orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;
    const activeProducts = this.products.filter(p => p.status === 'APPROVED').length;

    return {
      ...mockAdminStats,
      pendingFarmerApprovalsCount: pendingFarmers,
      pendingOrdersCount: pendingOrders,
      activeProducts,
    };
  }

  // Farmers
  async getFarmers(query?: { search?: string; status?: string; kyc?: string; state?: string }): Promise<Farmer[]> {
    const res = await apiFetch('/api/admin/users?role=FARMER&limit=200');
    if (res.ok && res.data?.success && Array.isArray(res.data.data)) {
      let list: Farmer[] = res.data.data.map((u: any) => apiUserToFarmer(u));
      if (query?.search) {
        const q = query.search.toLowerCase();
        list = list.filter(f => f.name.toLowerCase().includes(q) || f.phone.includes(q) || f.location.toLowerCase().includes(q));
      }
      if (query?.kyc && query.kyc !== 'ALL') {
        list = list.filter(f => f.kycStatus === query.kyc);
      }
      if (query?.state && query.state !== 'ALL') {
        list = list.filter(f => f.state === query.state);
      }
      if (query?.status && query.status !== 'ALL') {
        list = list.filter(f => f.status === query.status);
      }
      return list;
    }

    let list = [...this.farmers];
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q) || f.phone.includes(q) || f.location.toLowerCase().includes(q));
    }
    if (query?.status && query.status !== 'ALL') {
      list = list.filter(f => f.status === query.status);
    }
    if (query?.kyc && query.kyc !== 'ALL') {
      list = list.filter(f => f.kycStatus === query.kyc);
    }
    if (query?.state && query.state !== 'ALL') {
      list = list.filter(f => f.state === query.state);
    }
    return list;
  }

  async getFarmerById(id: string): Promise<Farmer | undefined> {
    const res = await apiFetch(`/api/admin/farmers/${id}`);
    if (res.ok && res.data?.success && res.data.data) {
      return apiUserToFarmer(res.data.data.user ?? res.data.data, res.data.data.stats);
    }
    return this.farmers.find(f => f.id === id);
  }

  async updateFarmerStatus(id: string, status: FarmerStatus, rejectionReason?: string): Promise<boolean> {
    const res = await apiFetch(`/api/admin/users/${id}/status`, {
      method: 'PATCH',
      body: { status: REVERSE_FARMER_STATUS[status] ?? 'ACTIVE', reason: rejectionReason },
    });
    if (res.ok) return true;

    const farmer = this.farmers.find(f => f.id === id);
    if (!farmer) return false;
    farmer.status = status;
    if (status === 'APPROVED') {
      farmer.kycStatus = 'VERIFIED';
    } else if (status === 'REJECTED') {
      farmer.kycStatus = 'REJECTED';
      farmer.rejectionReason = rejectionReason || 'Documentation failed verification checks.';
    }
    return true;
  }

  async updateFarmerKYC(id: string, kycStatus: 'VERIFIED' | 'REJECTED', reason?: string): Promise<boolean> {
    const res = await apiFetch(`/api/admin/users/${id}/kyc`, {
      method: 'PATCH',
      body: { kycStatus: kycStatus === 'VERIFIED' ? 'APPROVED' : 'REJECTED', reason },
    });
    if (res.ok) return true;

    const farmer = this.farmers.find(f => f.id === id);
    if (!farmer) return false;
    farmer.kycStatus = kycStatus;
    if (kycStatus === 'VERIFIED') farmer.status = 'APPROVED';
    if (kycStatus === 'REJECTED') {
      farmer.status = 'REJECTED';
      farmer.rejectionReason = reason;
    }
    return true;
  }

  async deleteFarmer(id: string): Promise<boolean> {
    const res = await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (res.ok) return true;

    const idx = this.farmers.findIndex(f => f.id === id);
    if (idx !== -1) {
      this.farmers.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Buyers
  async getBuyers(query?: { search?: string; status?: string }): Promise<Buyer[]> {
    const res = await apiFetch('/api/admin/users?role=BUYER&limit=200');
    if (res.ok && res.data?.success && Array.isArray(res.data.data)) {
      let list: Buyer[] = res.data.data.map((u: any) => apiUserToBuyer(u));
      if (query?.search) {
        const q = query.search.toLowerCase();
        list = list.filter(b => b.name.toLowerCase().includes(q) || b.businessName.toLowerCase().includes(q) || b.city.toLowerCase().includes(q));
      }
      if (query?.status && query.status !== 'ALL') {
        list = list.filter(b => b.status === query.status);
      }
      return list;
    }

    let list = [...this.buyers];
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(b => b.name.toLowerCase().includes(q) || b.businessName.toLowerCase().includes(q) || b.city.toLowerCase().includes(q));
    }
    if (query?.status && query.status !== 'ALL') {
      list = list.filter(b => b.status === query.status);
    }
    return list;
  }

  async getBuyerById(id: string): Promise<Buyer | undefined> {
    const res = await apiFetch(`/api/admin/users/${id}`);
    if (res.ok && res.data?.success && res.data.data) {
      return apiUserToBuyer(res.data.data.user ?? res.data.data, res.data.data.stats);
    }
    return this.buyers.find(b => b.id === id);
  }

  async updateBuyerStatus(id: string, status: 'ACTIVE' | 'BLOCKED'): Promise<boolean> {
    const res = await apiFetch(`/api/admin/users/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
    if (res.ok) return true;

    const buyer = this.buyers.find(b => b.id === id);
    if (!buyer) return false;
    buyer.status = status;
    return true;
  }

  async deleteBuyer(id: string): Promise<boolean> {
    const res = await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (res.ok) return true;

    const idx = this.buyers.findIndex(b => b.id === id);
    if (idx !== -1) {
      this.buyers.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Products
  async getProducts(query?: { search?: string; category?: string; status?: string }): Promise<Product[]> {
    const res = await apiFetch('/api/admin/products?limit=200');
    if (res.ok && res.data?.success && Array.isArray(res.data.data)) {
      let list: Product[] = res.data.data.map(apiProductToAdminProduct);
      if (query?.search) {
        const q = query.search.toLowerCase();
        list = list.filter(p => p.title.toLowerCase().includes(q) || p.farmerName.toLowerCase().includes(q));
      }
      if (query?.category && query.category !== 'ALL') {
        list = list.filter(p => p.category === query.category);
      }
      if (query?.status && query.status !== 'ALL') {
        list = list.filter(p => p.status === query.status);
      }
      return list;
    }

    let list = [...this.products];
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.farmerName.toLowerCase().includes(q));
    }
    if (query?.category && query.category !== 'ALL') {
      list = list.filter(p => p.category === query.category);
    }
    if (query?.status && query.status !== 'ALL') {
      list = list.filter(p => p.status === query.status);
    }
    return list;
  }

  async updateProductStatus(id: string, status: ProductStatus): Promise<boolean> {
    const res = await apiFetch(`/api/products/${id}/status`, {
      method: 'PATCH',
      body: { status: REVERSE_PRODUCT_STATUS[status] ?? 'Active' },
    });
    if (res.ok) return true;

    const prod = this.products.find(p => p.id === id);
    if (!prod) return false;
    prod.status = status;
    return true;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const res = await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) return true;

    const idx = this.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.products.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Categories
  async getCategories(): Promise<CategoryItem[]> {
    return [...this.categories];
  }

  async addCategory(name: ProductCategory, description: string): Promise<CategoryItem> {
    const newCat: CategoryItem = {
      id: 'CAT-' + (this.categories.length + 1),
      name,
      description,
      itemCount: 0,
      active: true,
      iconName: 'Sprout',
    };
    this.categories.push(newCat);
    return newCat;
  }

  async toggleCategoryStatus(id: string): Promise<boolean> {
    const cat = this.categories.find(c => c.id === id);
    if (!cat) return false;
    cat.active = !cat.active;
    return true;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.categories.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Orders
  async getOrders(query?: { search?: string; status?: string; paymentStatus?: string }): Promise<Order[]> {
    const res = await apiFetch('/api/orders?limit=200');
    if (res.ok && res.data?.success && Array.isArray(res.data.data)) {
      let list: Order[] = res.data.data.map(apiOrderToAdminOrder);
      if (query?.search) {
        const q = query.search.toLowerCase();
        list = list.filter(o => o.id.toLowerCase().includes(q) || o.buyerName.toLowerCase().includes(q) || o.farmerName.toLowerCase().includes(q));
      }
      if (query?.status && query.status !== 'ALL') {
        list = list.filter(o => o.orderStatus === query.status);
      }
      if (query?.paymentStatus && query.paymentStatus !== 'ALL') {
        list = list.filter(o => o.paymentStatus === query.paymentStatus);
      }
      return list;
    }

    let list = [...this.orders];
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(o => o.id.toLowerCase().includes(q) || o.buyerName.toLowerCase().includes(q) || o.farmerName.toLowerCase().includes(q));
    }
    if (query?.status && query.status !== 'ALL') {
      list = list.filter(o => o.orderStatus === query.status);
    }
    if (query?.paymentStatus && query.paymentStatus !== 'ALL') {
      list = list.filter(o => o.paymentStatus === query.paymentStatus);
    }
    return list;
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const res = await apiFetch(`/api/orders/${id}`);
    if (res.ok && res.data?.success && res.data.data) {
      return apiOrderToAdminOrder(res.data.data);
    }
    return this.orders.find(o => o.id === id);
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
    const res = await apiFetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
    if (res.ok) return true;

    const order = this.orders.find(o => o.id === id);
    if (!order) return false;
    order.orderStatus = status;
    order.timeline.push({
      status: `Status updated to ${status} by Admin`,
      time: 'Just now',
      completed: true,
    });
    return true;
  }

  // Payments & Financials
  async getTransactions(): Promise<Transaction[]> {
    return [...this.transactions];
  }

  async getPayouts(): Promise<Payout[]> {
    return [...this.payouts];
  }

  async approvePayout(id: string): Promise<boolean> {
    const p = this.payouts.find(item => item.id === id);
    if (!p) return false;
    p.status = 'Completed';
    return true;
  }

  async getRefunds(): Promise<Refund[]> {
    return [...this.refunds];
  }

  async approveRefund(id: string): Promise<boolean> {
    const r = this.refunds.find(item => item.id === id);
    if (!r) return false;
    r.status = 'Processed';
    return true;
  }

  // Logistics
  async getDeliveries(): Promise<Delivery[]> {
    return [...this.deliveries];
  }

  async reassignDeliveryPartner(id: string, partner: string, driver: string, phone: string): Promise<boolean> {
    const del = this.deliveries.find(d => d.id === id);
    if (!del) return false;
    del.deliveryPartner = partner;
    del.driverName = driver;
    del.driverPhone = phone;
    return true;
  }

  // Complaints
  async getComplaints(query?: { status?: string; type?: string }): Promise<Complaint[]> {
    let list = [...this.complaints];
    if (query?.status && query.status !== 'ALL') {
      list = list.filter(c => c.status === query.status);
    }
    if (query?.type && query.type !== 'ALL') {
      list = list.filter(c => c.type === query.type);
    }
    return list;
  }

  async resolveComplaint(id: string, responseText: string, status: ComplaintStatus): Promise<boolean> {
    const comp = this.complaints.find(c => c.id === id);
    if (!comp) return false;
    comp.status = status;
    comp.adminResponse = responseText;
    if (status === 'Resolved') {
      comp.resolvedAt = 'Just now';
    }
    return true;
  }

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    return [...this.notifications];
  }

  async createNotification(title: string, message: string, audience: 'ALL' | 'FARMERS' | 'BUYERS' | 'SPECIFIC', targetUser?: string): Promise<NotificationItem> {
    const newNotif: NotificationItem = {
      id: 'NOTIF-' + (this.notifications.length + 901),
      title,
      message,
      audience,
      targetUser,
      sentAt: 'Just now',
      readCount: 1,
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }

  // AI Insights
  async getAIInsights(): Promise<AIInsight[]> {
    return [...mockAIInsights];
  }

  // Global Search
  async globalSearch(term: string) {
    const q = term.toLowerCase().trim();
    if (!q) return { farmers: [], buyers: [], products: [], orders: [] };

    const matchedFarmers = this.farmers.filter(f => f.name.toLowerCase().includes(q) || f.phone.includes(q) || f.location.toLowerCase().includes(q));
    const matchedBuyers = this.buyers.filter(b => b.name.toLowerCase().includes(q) || b.businessName.toLowerCase().includes(q) || b.city.toLowerCase().includes(q));
    const matchedProducts = this.products.filter(p => p.title.toLowerCase().includes(q) || p.farmerName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    const matchedOrders = this.orders.filter(o => o.id.toLowerCase().includes(q) || o.buyerName.toLowerCase().includes(q) || o.farmerName.toLowerCase().includes(q));

    return {
      farmers: matchedFarmers.slice(0, 5),
      buyers: matchedBuyers.slice(0, 5),
      products: matchedProducts.slice(0, 5),
      orders: matchedOrders.slice(0, 5),
    };
  }
}

export const adminService = new AdminDataService();
