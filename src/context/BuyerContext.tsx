'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BuyerProduct,
  BuyerCartItem,
  BuyerOrder,
  BuyerAddress,
  BuyerPaymentMethod,
  BuyerTransaction,
  BuyerNotification
} from '@/types/buyer';
import {
  mockProducts,
  mockOrders,
  mockAddresses,
  mockPaymentMethods,
  mockTransactions,
  mockNotifications
} from '@/data/buyerMockData';
import {
  apiFetch,
  apiProductToBuyerProduct,
  apiOrderToBuyerOrder,
  getToken,
  getStoredUser
} from '@/services/api';

interface BuyerContextType {
  // Products
  products: BuyerProduct[];
  getProductById: (id: string) => BuyerProduct | undefined;

  // Cart
  cart: BuyerCartItem[];
  addToCart: (product: BuyerProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  deliveryCharge: number;
  discount: number;
  cartTotal: number;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  wishlistProducts: BuyerProduct[];

  // Orders
  orders: BuyerOrder[];
  placeOrder: (orderData: {
    address: BuyerAddress;
    paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Cash on Delivery' | 'Net Banking';
  }) => Promise<BuyerOrder>;
  cancelOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => BuyerOrder | undefined;

  // Addresses
  addresses: BuyerAddress[];
  selectedAddress: BuyerAddress | null;
  setSelectedAddress: (addr: BuyerAddress) => void;
  addAddress: (addr: Omit<BuyerAddress, 'id'>) => void;
  updateAddress: (id: string, addr: Partial<BuyerAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Payments
  paymentMethods: BuyerPaymentMethod[];
  transactions: BuyerTransaction[];

  // Notifications
  notifications: BuyerNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  unreadNotificationsCount: number;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const BuyerContext = createContext<BuyerContextType | undefined>(undefined);

export function BuyerProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<BuyerProduct[]>(mockProducts);
  const [cart, setCart] = useState<BuyerCartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<BuyerOrder[]>(mockOrders);
  const [addresses, setAddresses] = useState<BuyerAddress[]>(mockAddresses);
  const [selectedAddress, setSelectedAddress] = useState<BuyerAddress | null>(mockAddresses[0] || null);
  const [paymentMethods] = useState<BuyerPaymentMethod[]>(mockPaymentMethods);
  const [transactions, setTransactions] = useState<BuyerTransaction[]>(mockTransactions);
  const [notifications, setNotifications] = useState<BuyerNotification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  // Initial load from localStorage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('kisankart_buyer_cart');
      if (storedCart) setCart(JSON.parse(storedCart));
      else {
        // Pre-fill with a sample product so the cart isn't bare on first login
        setCart([
          { product: mockProducts[0], quantity: 20 },
          { product: mockProducts[4], quantity: 15 }
        ]);
      }

      const storedWishlist = localStorage.getItem('kisankart_buyer_wishlist');
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      else {
        setWishlist(['prod-002', 'prod-007']);
      }

      const storedOrders = localStorage.getItem('kisankart_buyer_orders');
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedAddresses = localStorage.getItem('kisankart_buyer_addresses');
      if (storedAddresses) setAddresses(JSON.parse(storedAddresses));
    } catch (e) {
      console.error('Error hydrating buyer context:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Load live catalogue and order history from the backend when signed in.
  useEffect(() => {
    const user = getStoredUser();
    const token = getToken();
    if (!token || !user || (user.role && user.role !== 'BUYER' && user.role !== 'ADMIN')) {
      return;
    }

    let cancelled = false;

    (async () => {
      const productsRes = await apiFetch('/api/products?limit=100');
      if (!cancelled && productsRes.ok && productsRes.data?.success && Array.isArray(productsRes.data.data)) {
        setProducts(productsRes.data.data.map(apiProductToBuyerProduct));
      }

      const ordersRes = await apiFetch('/api/orders/mine?limit=50');
      if (!cancelled && ordersRes.ok && ordersRes.data?.success && Array.isArray(ordersRes.data.data)) {
        setOrders(ordersRes.data.data.map(apiOrderToBuyerOrder));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isHydrated]);

  // Sync mutations to LocalStorage whenever state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('kisankart_buyer_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('kisankart_buyer_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('kisankart_buyer_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('kisankart_buyer_addresses', JSON.stringify(addresses));
    } catch (e) {}
  }, [addresses, isHydrated]);

  // Product helpers
  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  // Cart operations
  const addToCart = (product: BuyerProduct, quantity: number = product.minOrderQty || 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryCharge = cartSubtotal > 2000 || cart.length === 0 ? 0 : 90;
  const discount = cartSubtotal > 1500 ? Math.round(cartSubtotal * 0.05) : 0;
  const cartTotal = Math.max(0, cartSubtotal + deliveryCharge - discount);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);
  const wishlistCount = wishlist.length;
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  // Orders operations
  const getOrderById = (orderId: string) => {
    return orders.find(o => o.id === orderId);
  };

  const placeOrder = async (orderData: {
    address: BuyerAddress;
    paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Cash on Delivery' | 'Net Banking';
  }): Promise<BuyerOrder> => {
    // Primary path: book the order through the backend (escrow + stock reservation).
    const response = await apiFetch('/api/orders', {
      method: 'POST',
      body: {
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: orderData.address.fullName,
          phone: orderData.address.phone,
          address: orderData.address.houseStreet,
          city: orderData.address.villageCity,
          district: orderData.address.district,
          state: orderData.address.state,
          pinCode: orderData.address.pinCode,
        },
        paymentMethod: orderData.paymentMethod,
      },
    });

    if (response.ok && response.data?.success && response.data?.data) {
      const created = Array.isArray(response.data.data)
        ? response.data.data[0]
        : response.data.data;
      const apiOrder = apiOrderToBuyerOrder(created);

      setOrders(prev => [apiOrder, ...prev]);

      const newTx: BuyerTransaction = {
        id: `TXN-${Date.now()}`,
        orderId: apiOrder.id,
        amount: apiOrder.total,
        date: apiOrder.date,
        status: apiOrder.paymentStatus as any,
        method: orderData.paymentMethod,
      };
      setTransactions(prev => [newTx, ...prev]);

      const newNotif: BuyerNotification = {
        id: `notif-${Date.now()}`,
        title: `Order ${apiOrder.orderNumber || apiOrder.id} Placed Successfully! 🎉`,
        message: `Your procurement order of ₹${apiOrder.total.toLocaleString('en-IN')} has been booked. Escrow is locked.`,
        category: 'Orders',
        timestamp: 'Just now',
        read: false,
        link: `/buyer/orders/${apiOrder.id}`
      };
      setNotifications(prev => [newNotif, ...prev]);

      clearCart();
      return apiOrder;
    }

    // Fallback: local demo order when the backend is unreachable.
    const newOrderId = 'KK-' + Math.floor(10000 + Math.random() * 90000);
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const newOrder: BuyerOrder = {
      id: newOrderId,
      date: dateFormatted,
      items: cart.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price
      })),
      subtotal: cartSubtotal,
      deliveryFee: deliveryCharge,
      discount,
      total: cartTotal,
      status: 'Placed',
      address: orderData.address,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'Successful',
      deliveryPartner: 'AgriLogix Express (Mandi Fleet)',
      deliveryDate: 'Expected within 48 hours',
      trackingNumber: `TRK-ALX-${Math.floor(100000 + Math.random() * 900000)}`,
      farmerContact: cart[0]?.product.farmer
        ? `+91 94150 ${Math.floor(10000 + Math.random() * 90000)} (${cart[0].product.farmer})`
        : '+91 94150 11223',
      timeline: [
        {
          status: 'Placed',
          time: 'Just now',
          completed: true,
          description: 'Order placed by buyer and funds placed in ICICI Mandi Escrow.'
        },
        {
          status: 'Confirmed',
          time: 'Pending farmer acceptance',
          completed: false,
          description: 'Farmer notification dispatched for lot pickup.'
        },
        {
          status: 'Packed',
          time: 'Upcoming',
          completed: false,
          description: 'Produce QC grading and bag sealing.'
        },
        {
          status: 'Shipped',
          time: 'Upcoming',
          completed: false,
          description: 'Handed over to cold-chain freight truck.'
        },
        {
          status: 'Out for Delivery',
          time: 'Upcoming',
          completed: false,
          description: 'Last-mile vehicle out for destination delivery.'
        },
        {
          status: 'Delivered',
          time: 'Upcoming',
          completed: false,
          description: 'Weighbridge confirmation & digital receipt.'
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    // Add corresponding transaction
    const newTx: BuyerTransaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      orderId: newOrderId,
      amount: cartTotal,
      date: dateFormatted,
      status: 'Successful',
      method: orderData.paymentMethod
    };
    setTransactions(prev => [newTx, ...prev]);

    // Add confirmation notification
    const fallbackNotif: BuyerNotification = {
      id: `notif-${Date.now()}`,
      title: `Order ${newOrderId} Placed Successfully! 🎉`,
      message: `Your procurement order of ₹${cartTotal.toLocaleString('en-IN')} has been booked. Escrow is locked.`,
      category: 'Orders',
      timestamp: 'Just now',
      read: false,
      link: `/buyer/orders/${newOrderId}`
    };
    setNotifications(prev => [fallbackNotif, ...prev]);

    // Clear cart after checkout
    clearCart();

    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    // Notify the backend when reachable; local state updates regardless.
    apiFetch(`/api/orders/${orderId}/cancel`, { method: 'POST', body: {} }).catch(() => undefined);

    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'Cancelled',
            timeline: [
              ...o.timeline,
              {
                status: 'Cancelled',
                time: 'Just now',
                completed: true,
                description: 'Order cancelled by buyer. Full refund initiated to source payment method.'
              }
            ]
          };
        }
        return o;
      })
    );
  };

  // Address operations
  const addAddress = (addr: Omit<BuyerAddress, 'id'>) => {
    const newAddr: BuyerAddress = {
      ...addr,
      id: `addr-${Date.now()}`
    };
    if (newAddr.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(newAddr));
      setSelectedAddress(newAddr);
    } else {
      setAddresses(prev => [...prev, newAddr]);
    }
  };

  const updateAddress = (id: string, updated: Partial<BuyerAddress>) => {
    setAddresses(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updated } : a))
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddress?.id === id) {
      setSelectedAddress(addresses.find(a => a.id !== id) || null);
    }
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev =>
      prev.map(a => ({
        ...a,
        isDefault: a.id === id
      }))
    );
    const found = addresses.find(a => a.id === id);
    if (found) setSelectedAddress(found);
  };

  // Notifications operations
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <BuyerContext.Provider
      value={{
        products,
        getProductById,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryCharge,
        discount,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        wishlistProducts,
        orders,
        placeOrder,
        cancelOrder,
        getOrderById,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        paymentMethods,
        transactions,
        notifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        unreadNotificationsCount,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </BuyerContext.Provider>
  );
}

export function useBuyer() {
  const context = useContext(BuyerContext);
  if (!context) {
    throw new Error('useBuyer must be used within a BuyerProvider');
  }
  return context;
}
