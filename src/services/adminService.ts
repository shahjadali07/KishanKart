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
  ProductCategory
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
    return this.farmers.find(f => f.id === id);
  }

  async updateFarmerStatus(id: string, status: FarmerStatus, rejectionReason?: string): Promise<boolean> {
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
    const idx = this.farmers.findIndex(f => f.id === id);
    if (idx !== -1) {
      this.farmers.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Buyers
  async getBuyers(query?: { search?: string; status?: string }): Promise<Buyer[]> {
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
    return this.buyers.find(b => b.id === id);
  }

  async updateBuyerStatus(id: string, status: 'ACTIVE' | 'BLOCKED'): Promise<boolean> {
    const buyer = this.buyers.find(b => b.id === id);
    if (!buyer) return false;
    buyer.status = status;
    return true;
  }

  async deleteBuyer(id: string): Promise<boolean> {
    const idx = this.buyers.findIndex(b => b.id === id);
    if (idx !== -1) {
      this.buyers.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Products
  async getProducts(query?: { search?: string; category?: string; status?: string }): Promise<Product[]> {
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
    const prod = this.products.find(p => p.id === id);
    if (!prod) return false;
    prod.status = status;
    return true;
  }

  async deleteProduct(id: string): Promise<boolean> {
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
    return this.orders.find(o => o.id === id);
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
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
