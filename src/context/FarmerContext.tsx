'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FarmerProduct,
  FarmerOrder,
  StockHistoryItem,
  FarmerCustomer,
  FarmerTransaction,
  FarmerDeliveryItem,
  FarmerOffer,
  FarmerNotification,
  FarmerProfile,
  FarmerDashboardStats,
  FarmerOrderStatus
} from '@/types/farmer';
import {
  initialFarmerProfile,
  initialFarmerProducts,
  initialFarmerOrders,
  initialStockHistory,
  initialFarmerCustomers,
  initialFarmerTransactions,
  initialFarmerDeliveries,
  initialFarmerOffers,
  initialFarmerNotifications
} from '@/data/farmerMockData';

interface FarmerContextType {
  // Profile
  profile: FarmerProfile;
  updateProfile: (updated: Partial<FarmerProfile>) => void;

  // Products
  products: FarmerProduct[];
  addProduct: (product: Omit<FarmerProduct, 'id' | 'farmerId' | 'createdAt' | 'updatedAt'>) => FarmerProduct;
  updateProduct: (id: string, updated: Partial<FarmerProduct>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => FarmerProduct | undefined;

  // Inventory
  stockHistory: StockHistoryItem[];
  updateStock: (productId: string, newStock: number, reason: string) => void;
  adjustStock: (productId: string, delta: number, reason: string) => void;
  lowStockProducts: FarmerProduct[];

  // Orders
  orders: FarmerOrder[];
  updateOrderStatus: (orderId: string, newStatus: FarmerOrderStatus, note?: string) => boolean;
  getOrderById: (orderId: string) => FarmerOrder | undefined;

  // Customers
  customers: FarmerCustomer[];
  getCustomerById: (customerId: string) => FarmerCustomer | undefined;

  // Transactions & Earnings
  transactions: FarmerTransaction[];
  totalEarnings: number;

  // Delivery
  deliveries: FarmerDeliveryItem[];
  updateDeliveryStatus: (deliveryId: string, status: FarmerDeliveryItem['deliveryStatus']) => void;

  // Offers
  offers: FarmerOffer[];
  addOffer: (offer: Omit<FarmerOffer, 'id' | 'farmerId' | 'timesUsed'>) => void;
  updateOffer: (offerId: string, updated: Partial<FarmerOffer>) => void;
  deleteOffer: (offerId: string) => void;

  // Notifications
  notifications: FarmerNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Stats
  stats: FarmerDashboardStats;
}

const FarmerContext = createContext<FarmerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'kisankart_farmer_profile',
  PRODUCTS: 'kisankart_farmer_products',
  ORDERS: 'kisankart_farmer_orders',
  STOCK_HISTORY: 'kisankart_farmer_stock_history',
  CUSTOMERS: 'kisankart_farmer_customers',
  TRANSACTIONS: 'kisankart_farmer_transactions',
  DELIVERIES: 'kisankart_farmer_deliveries',
  OFFERS: 'kisankart_farmer_offers',
  NOTIFICATIONS: 'kisankart_farmer_notifications'
};

export function FarmerProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<FarmerProfile>(initialFarmerProfile);
  const [products, setProducts] = useState<FarmerProduct[]>(initialFarmerProducts);
  const [orders, setOrders] = useState<FarmerOrder[]>(initialFarmerOrders);
  const [stockHistory, setStockHistory] = useState<StockHistoryItem[]>(initialStockHistory);
  const [customers, setCustomers] = useState<FarmerCustomer[]>(initialFarmerCustomers);
  const [transactions, setTransactions] = useState<FarmerTransaction[]>(initialFarmerTransactions);
  const [deliveries, setDeliveries] = useState<FarmerDeliveryItem[]>(initialFarmerDeliveries);
  const [offers, setOffers] = useState<FarmerOffer[]>(initialFarmerOffers);
  const [notifications, setNotifications] = useState<FarmerNotification[]>(initialFarmerNotifications);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const p = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (p) setProfile(JSON.parse(p));

      const pr = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (pr) setProducts(JSON.parse(pr));

      const o = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (o) setOrders(JSON.parse(o));

      const sh = localStorage.getItem(STORAGE_KEYS.STOCK_HISTORY);
      if (sh) setStockHistory(JSON.parse(sh));

      const c = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (c) setCustomers(JSON.parse(c));

      const t = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (t) setTransactions(JSON.parse(t));

      const d = localStorage.getItem(STORAGE_KEYS.DELIVERIES);
      if (d) setDeliveries(JSON.parse(d));

      const of = localStorage.getItem(STORAGE_KEYS.OFFERS);
      if (of) setOffers(JSON.parse(of));

      const n = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (n) setNotifications(JSON.parse(n));
    } catch (e) {
      console.error('Error loading farmer stored state:', e);
    }
  }, []);

  // Sync mutations to LocalStorage
  const save = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to sync farmer state:', e);
    }
  };

  // Profile
  const updateProfile = (updated: Partial<FarmerProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updated };
      save(STORAGE_KEYS.PROFILE, next);
      return next;
    });
  };

  // Products
  const addProduct = (productData: Omit<FarmerProduct, 'id' | 'farmerId' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: FarmerProduct = {
      ...productData,
      id: `prod_f${Date.now()}`,
      farmerId: profile.id,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    save(STORAGE_KEYS.PRODUCTS, updated);

    // Add initial stock record
    if (newProduct.availableQuantity > 0) {
      const newHistory: StockHistoryItem = {
        id: `stk_${Date.now()}`,
        productId: newProduct.id,
        productName: newProduct.name,
        changeType: 'SET',
        changeAmount: newProduct.availableQuantity,
        previousStock: 0,
        newStock: newProduct.availableQuantity,
        reason: 'Initial lot listing',
        timestamp: new Date().toISOString()
      };
      const updatedHistory = [newHistory, ...stockHistory];
      setStockHistory(updatedHistory);
      save(STORAGE_KEYS.STOCK_HISTORY, updatedHistory);
    }

    return newProduct;
  };

  const updateProduct = (id: string, updatedFields: Partial<FarmerProduct>) => {
    const updated = products.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updatedFields,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    });
    setProducts(updated);
    save(STORAGE_KEYS.PRODUCTS, updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    save(STORAGE_KEYS.PRODUCTS, updated);
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  // Inventory Updates
  const updateStock = (productId: string, newStock: number, reason: string) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;

    const prevStock = target.availableQuantity;
    const nextStatus = newStock === 0 ? 'Out of Stock' : target.status === 'Out of Stock' ? 'Active' : target.status;

    updateProduct(productId, {
      availableQuantity: newStock,
      status: nextStatus
    });

    const historyItem: StockHistoryItem = {
      id: `stk_${Date.now()}`,
      productId,
      productName: target.name,
      changeType: 'SET',
      changeAmount: newStock - prevStock,
      previousStock: prevStock,
      newStock,
      reason,
      timestamp: new Date().toISOString()
    };
    const updatedHistory = [historyItem, ...stockHistory];
    setStockHistory(updatedHistory);
    save(STORAGE_KEYS.STOCK_HISTORY, updatedHistory);

    // Generate low stock or out of stock notification if applicable
    if (newStock === 0) {
      addNotification({
        type: 'Out of Stock',
        title: `Out of Stock: ${target.name}`,
        message: `${target.name} has reached 0 ${target.unit}. Update stock to resume active orders.`,
        link: '/farmer/inventory'
      });
    } else if (newStock <= target.lowStockThreshold && prevStock > target.lowStockThreshold) {
      addNotification({
        type: 'Low Stock',
        title: `Low Stock Alert: ${target.name}`,
        message: `Available stock for ${target.name} is now ${newStock} ${target.unit} (below threshold ${target.lowStockThreshold} ${target.unit}).`,
        link: '/farmer/inventory'
      });
    }
  };

  const adjustStock = (productId: string, delta: number, reason: string) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const newStock = Math.max(0, target.availableQuantity + delta);
    updateStock(productId, newStock, reason);
  };

  // Orders Workflow
  const VALID_TRANSITIONS: Record<FarmerOrderStatus, FarmerOrderStatus[]> = {
    Pending: ['Confirmed', 'Cancelled'],
    Confirmed: ['Processing', 'Cancelled'],
    Processing: ['Shipped', 'Cancelled'],
    Shipped: ['Delivered'],
    Delivered: [],
    Cancelled: []
  };

  const updateOrderStatus = (orderId: string, newStatus: FarmerOrderStatus, note?: string): boolean => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    // Validate transition
    const allowed = VALID_TRANSITIONS[order.orderStatus] || [];
    if (!allowed.includes(newStatus)) {
      console.warn(`Invalid order transition from ${order.orderStatus} to ${newStatus}`);
      return false;
    }

    const nextTimeline = [
      ...order.timeline,
      {
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: note || `Order updated to ${newStatus}`
      }
    ];

    // If marked delivered, update payment to Paid and create transaction
    let nextPaymentStatus = order.paymentStatus;
    if (newStatus === 'Delivered') {
      nextPaymentStatus = 'Paid';
      const newTxn: FarmerTransaction = {
        id: `txn_${Date.now()}`,
        farmerId: profile.id,
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: order.subtotal,
        date: new Date().toISOString(),
        paymentStatus: 'Paid',
        paymentMethod: 'Instant UPI Payout',
        bankRefNumber: `UPI/${Date.now().toString().slice(-6)}`
      };
      const updatedTxns = [newTxn, ...transactions];
      setTransactions(updatedTxns);
      save(STORAGE_KEYS.TRANSACTIONS, updatedTxns);
    }

    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          orderStatus: newStatus,
          paymentStatus: nextPaymentStatus,
          timeline: nextTimeline
        };
      }
      return o;
    });

    setOrders(updatedOrders);
    save(STORAGE_KEYS.ORDERS, updatedOrders);

    // Send notification
    addNotification({
      type: 'Order Status Changed',
      title: `Order #${order.orderNumber} ${newStatus}`,
      message: `Status updated to ${newStatus}.`,
      link: `/farmer/orders/${order.id}`
    });

    return true;
  };

  const getOrderById = (orderId: string) => {
    return orders.find(o => o.id === orderId);
  };

  // Customers
  const getCustomerById = (customerId: string) => {
    return customers.find(c => c.id === customerId);
  };

  // Delivery
  const updateDeliveryStatus = (deliveryId: string, status: FarmerDeliveryItem['deliveryStatus']) => {
    const updated = deliveries.map(d => (d.id === deliveryId ? { ...d, deliveryStatus: status } : d));
    setDeliveries(updated);
    save(STORAGE_KEYS.DELIVERIES, updated);
  };

  // Offers
  const addOffer = (offerData: Omit<FarmerOffer, 'id' | 'farmerId' | 'timesUsed'>) => {
    const newOffer: FarmerOffer = {
      ...offerData,
      id: `off_${Date.now()}`,
      farmerId: profile.id,
      timesUsed: 0
    };
    const updated = [newOffer, ...offers];
    setOffers(updated);
    save(STORAGE_KEYS.OFFERS, updated);
  };

  const updateOffer = (offerId: string, updatedFields: Partial<FarmerOffer>) => {
    const updated = offers.map(o => (o.id === offerId ? { ...o, ...updatedFields } : o));
    setOffers(updated);
    save(STORAGE_KEYS.OFFERS, updated);
  };

  const deleteOffer = (offerId: string) => {
    const updated = offers.filter(o => o.id !== offerId);
    setOffers(updated);
    save(STORAGE_KEYS.OFFERS, updated);
  };

  // Notifications
  const addNotification = (item: Omit<FarmerNotification, 'id' | 'farmerId' | 'timestamp' | 'isRead'>) => {
    const newNotif: FarmerNotification = {
      ...item,
      id: `notif_${Date.now()}`,
      farmerId: profile.id,
      timestamp: 'Just now',
      isRead: false
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    save(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map(n => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    save(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  const markAllNotificationsAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    save(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  // Computed Values
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const lowStockProducts = products.filter(
    p => p.availableQuantity <= p.lowStockThreshold && p.status !== 'Out of Stock'
  );

  const totalEarnings = transactions
    .filter(t => t.paymentStatus === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const activeOrdersCount = orders.filter(
    o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled'
  ).length;

  const totalStockCount = products.reduce((sum, p) => sum + p.availableQuantity, 0);

  const stats: FarmerDashboardStats = {
    totalProducts: products.length,
    activeOrders: activeOrdersCount,
    totalRevenue: totalEarnings || 148250,
    availableStock: totalStockCount,
    revenueGrowth: 18.4,
    lowStockCount: lowStockProducts.length
  };

  return (
    <FarmerContext.Provider
      value={{
        profile,
        updateProfile,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        stockHistory,
        updateStock,
        adjustStock,
        lowStockProducts,
        orders,
        updateOrderStatus,
        getOrderById,
        customers,
        getCustomerById,
        transactions,
        totalEarnings,
        deliveries,
        updateDeliveryStatus,
        offers,
        addOffer,
        updateOffer,
        deleteOffer,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        stats
      }}
    >
      {children}
    </FarmerContext.Provider>
  );
}

export function useFarmer() {
  const context = useContext(FarmerContext);
  if (!context) {
    throw new Error('useFarmer must be used within a FarmerProvider');
  }
  return context;
}
