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
  FarmerDashboardStats
} from '@/types/farmer';

export const initialFarmerProfile: FarmerProfile = {
  id: 'farmer_001',
  farmerName: 'Rajesh Kumar Verma',
  profileImage: '',
  email: 'rajesh.farmer@kishankart.in',
  phone: '+91 98765 43210',
  farmName: 'Verma Organic Green Farms',
  farmAddress: 'Plot 42, Mandi Link Road, Gram Panchayat Itaunja',
  village: 'Itaunja, Bakshi Ka Talab',
  district: 'Lucknow',
  state: 'Uttar Pradesh',
  pinCode: '226203',
  farmType: 'Organic Certified Farm',
  farmSize: '6.2 Acres',
  kycStatus: 'Verified',
  soilHealthGrade: 'Grade A (Optimal Organic Carbon: 0.78%)',
  bankAccount: {
    accountNumber: '••••••••8921',
    ifsc: 'SBIN0001248',
    bankName: 'State Bank of India',
    holderName: 'Rajesh Kumar Verma',
    upiId: 'rajesh.verma@sbi'
  }
};

export const initialFarmerProducts: FarmerProduct[] = [
  {
    id: 'prod_f01',
    farmerId: 'farmer_001',
    name: 'Red Hybrid Tomatoes',
    hindiName: 'टमाटर (हाइब्रिड)',
    description: 'Fresh farm-gate picked vine tomatoes with high firmness and 12-day shelf life. Ideal for wholesale mandis and hotels.',
    category: 'Vegetables',
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'],
    price: 28,
    unit: 'kg',
    availableQuantity: 500,
    minimumOrderQuantity: 50,
    lowStockThreshold: 100,
    isOrganic: true,
    location: 'Bakshi Ka Talab, Lucknow',
    mandi: 'Lucknow APMC',
    grade: 'Grade A',
    status: 'Active',
    harvestDate: '2026-10-10',
    createdAt: '2026-09-15',
    updatedAt: '2026-10-10'
  },
  {
    id: 'prod_f02',
    farmerId: 'farmer_001',
    name: 'Chipsona Potatoes',
    hindiName: 'चिप्सोना आलू',
    description: 'Dry sorted and cured processing-grade potatoes with high solid content. Preferred by commercial snack and wafer manufacturers.',
    category: 'Vegetables',
    images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80'],
    price: 19,
    unit: 'kg',
    availableQuantity: 1200,
    minimumOrderQuantity: 100,
    lowStockThreshold: 250,
    isOrganic: false,
    location: 'Bakshi Ka Talab, Lucknow',
    mandi: 'Lucknow APMC',
    grade: 'Grade A',
    status: 'Active',
    harvestDate: '2026-10-08',
    createdAt: '2026-09-20',
    updatedAt: '2026-10-09'
  },
  {
    id: 'prod_f03',
    farmerId: 'farmer_001',
    name: 'Sharbati Wheat (Grain Lot 4)',
    hindiName: 'शरबती गेहूं',
    description: 'Golden heavy kernel Sharbati wheat, lab tested 100% moisture free and pest treated. Stored in climate-controlled godown.',
    category: 'Grains',
    images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80'],
    price: 2450,
    unit: 'quintal',
    availableQuantity: 45,
    minimumOrderQuantity: 5,
    lowStockThreshold: 10,
    isOrganic: true,
    location: 'Bakshi Ka Talab, Lucknow',
    mandi: 'Lucknow APMC',
    grade: 'Certified Organic',
    status: 'Active',
    harvestDate: '2026-09-28',
    createdAt: '2026-09-01',
    updatedAt: '2026-10-02'
  },
  {
    id: 'prod_f04',
    farmerId: 'farmer_001',
    name: 'Green Cauliflower (Broccoli / Phoolgobhi)',
    hindiName: 'हरी फूलगोभी',
    description: 'Crunchy dense curd heads, zero synthetic pesticides spray, harvested at sunrise for peak freshness.',
    category: 'Vegetables',
    images: ['https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800&auto=format&fit=crop&q=80'],
    price: 38,
    unit: 'kg',
    availableQuantity: 14, // LOW STOCK TRIGGER (threshold is 25)
    minimumOrderQuantity: 10,
    lowStockThreshold: 25,
    isOrganic: true,
    location: 'Bakshi Ka Talab, Lucknow',
    mandi: 'Lucknow APMC',
    grade: 'Grade A',
    status: 'Active',
    harvestDate: '2026-10-11',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-11'
  },
  {
    id: 'prod_f05',
    farmerId: 'farmer_001',
    name: 'Yellow Mustard Seeds (Sarson)',
    hindiName: 'पीली सरसों',
    description: 'Cleaned yellow mustard oil seeds with 42% high oil yield. Graded and bagged in food-grade jute sacks.',
    category: 'Seeds',
    images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'],
    price: 5800,
    unit: 'quintal',
    availableQuantity: 0, // OUT OF STOCK TRIGGER
    minimumOrderQuantity: 2,
    lowStockThreshold: 5,
    isOrganic: true,
    location: 'Bakshi Ka Talab, Lucknow',
    mandi: 'Lucknow APMC',
    grade: 'Grade A',
    status: 'Out of Stock',
    harvestDate: '2026-08-20',
    createdAt: '2026-08-15',
    updatedAt: '2026-10-05'
  }
];

export const initialFarmerOrders: FarmerOrder[] = [
  {
    id: 'ord_f101',
    farmerId: 'farmer_001',
    orderNumber: 'KK-ORD-8421',
    customerId: 'cust_b01',
    customerName: 'Sharma Foods Ltd.',
    customerPhone: '+91 94150 11223',
    customerEmail: 'procure@sharmafoods.in',
    items: [
      {
        productId: 'prod_f02',
        productName: 'Chipsona Potatoes',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
        quantity: 300,
        unit: 'kg',
        pricePerUnit: 19,
        subtotal: 5700
      }
    ],
    subtotal: 5700,
    deliveryCharges: 350,
    totalAmount: 6050,
    deliveryAddress: {
      fullName: 'Sharma Foods Central Kitchen',
      phone: '+91 94150 11223',
      address: 'Plot 12, Industrial Area, Alambagh',
      city: 'Lucknow',
      district: 'Lucknow',
      state: 'Uttar Pradesh',
      pinCode: '226005'
    },
    orderDate: '2026-10-11T14:30:00Z',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    logisticsPartner: 'KisanKart Direct Logistics',
    trackingNumber: 'TRK-UP-32-1102',
    expectedDeliveryDate: '2026-10-12T16:00:00Z',
    timeline: [
      { status: 'Pending', timestamp: '2026-10-11T14:30:00Z', note: 'Order placed by buyer' },
      { status: 'Confirmed', timestamp: '2026-10-11T15:00:00Z', note: 'Farmer accepted contract' },
      { status: 'Processing', timestamp: '2026-10-11T17:30:00Z', note: 'Weighbridge slip verified' },
      { status: 'Shipped', timestamp: '2026-10-12T09:15:00Z', note: 'Dispatch driver Mahesh Singh onboarded' }
    ]
  },
  {
    id: 'ord_f102',
    farmerId: 'farmer_001',
    orderNumber: 'KK-ORD-8422',
    customerId: 'cust_b02',
    customerName: 'Patanjali Fresh Outlets',
    customerPhone: '+91 98390 44556',
    customerEmail: 'aliganj@patanjalifresh.in',
    items: [
      {
        productId: 'prod_f01',
        productName: 'Red Hybrid Tomatoes',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
        quantity: 200,
        unit: 'kg',
        pricePerUnit: 28,
        subtotal: 5600
      }
    ],
    subtotal: 5600,
    deliveryCharges: 250,
    totalAmount: 5850,
    deliveryAddress: {
      fullName: 'Patanjali Fresh Hub',
      phone: '+91 98390 44556',
      address: 'Shop 4, Aliganj Main Market',
      city: 'Lucknow',
      district: 'Lucknow',
      state: 'Uttar Pradesh',
      pinCode: '226024'
    },
    orderDate: '2026-10-11T18:10:00Z',
    paymentStatus: 'Processing',
    orderStatus: 'Confirmed',
    logisticsPartner: 'KisanKart Agro Express',
    trackingNumber: 'TRK-UP-32-4890',
    expectedDeliveryDate: '2026-10-13T11:00:00Z',
    timeline: [
      { status: 'Pending', timestamp: '2026-10-11T18:10:00Z', note: 'Order placed by buyer' },
      { status: 'Confirmed', timestamp: '2026-10-11T19:00:00Z', note: 'Farmer locked deal' }
    ]
  },
  {
    id: 'ord_f103',
    farmerId: 'farmer_001',
    orderNumber: 'KK-ORD-8390',
    customerId: 'cust_b03',
    customerName: 'Haldiram Snacks Manufacturing',
    customerPhone: '+91 91234 88771',
    customerEmail: 'supply@haldiramkanpur.in',
    items: [
      {
        productId: 'prod_f02',
        productName: 'Chipsona Potatoes',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
        quantity: 500,
        unit: 'kg',
        pricePerUnit: 18.5,
        subtotal: 9250
      }
    ],
    subtotal: 9250,
    deliveryCharges: 600,
    totalAmount: 9850,
    deliveryAddress: {
      fullName: 'Haldiram Regional Plant',
      phone: '+91 91234 88771',
      address: 'Transport Nagar, Kanpur Road',
      city: 'Lucknow',
      district: 'Lucknow',
      state: 'Uttar Pradesh',
      pinCode: '226012'
    },
    orderDate: '2026-10-09T10:00:00Z',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    logisticsPartner: 'KisanKart Heavy Logistics',
    trackingNumber: 'TRK-UP-32-0941',
    expectedDeliveryDate: '2026-10-10T15:00:00Z',
    timeline: [
      { status: 'Pending', timestamp: '2026-10-09T10:00:00Z', note: 'Contract created' },
      { status: 'Confirmed', timestamp: '2026-10-09T10:45:00Z', note: 'Confirmed by Rajesh' },
      { status: 'Processing', timestamp: '2026-10-09T14:00:00Z', note: 'Loaded at farm gate' },
      { status: 'Shipped', timestamp: '2026-10-09T17:00:00Z', note: 'Dispatched via Tata 407' },
      { status: 'Delivered', timestamp: '2026-10-10T14:45:00Z', note: 'Consignment received & inspected' }
    ]
  },
  {
    id: 'ord_f104',
    farmerId: 'farmer_001',
    orderNumber: 'KK-ORD-8430',
    customerId: 'cust_b04',
    customerName: 'Grofers / Blinkit Dark Store Gomti Nagar',
    customerPhone: '+91 98899 33221',
    customerEmail: 'procure.lko@blinkit.com',
    items: [
      {
        productId: 'prod_f04',
        productName: 'Green Cauliflower (Broccoli / Phoolgobhi)',
        image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800&auto=format&fit=crop&q=80',
        quantity: 50,
        unit: 'kg',
        pricePerUnit: 38,
        subtotal: 1900
      }
    ],
    subtotal: 1900,
    deliveryCharges: 150,
    totalAmount: 2050,
    deliveryAddress: {
      fullName: 'Blinkit Fulfillment Center GN-02',
      phone: '+91 98899 33221',
      address: 'Vibhuti Khand, Gomti Nagar',
      city: 'Lucknow',
      district: 'Lucknow',
      state: 'Uttar Pradesh',
      pinCode: '226010'
    },
    orderDate: '2026-10-12T00:15:00Z',
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    logisticsPartner: 'KisanKart Quick Hub',
    expectedDeliveryDate: '2026-10-12T18:00:00Z',
    timeline: [
      { status: 'Pending', timestamp: '2026-10-12T00:15:00Z', note: 'Order placed, awaiting farmer confirmation' }
    ]
  }
];

export const initialStockHistory: StockHistoryItem[] = [
  {
    id: 'stk_01',
    productId: 'prod_f01',
    productName: 'Red Hybrid Tomatoes',
    changeType: 'ADD',
    changeAmount: 200,
    previousStock: 300,
    newStock: 500,
    reason: 'Morning harvest from Polyhouse 2',
    timestamp: '2026-10-10T08:30:00Z'
  },
  {
    id: 'stk_02',
    productId: 'prod_f02',
    productName: 'Chipsona Potatoes',
    changeType: 'SUBTRACT',
    changeAmount: 300,
    previousStock: 1500,
    newStock: 1200,
    reason: 'Order #KK-ORD-8421 dispatch to Sharma Foods',
    timestamp: '2026-10-11T16:00:00Z'
  },
  {
    id: 'stk_03',
    productId: 'prod_f04',
    productName: 'Green Cauliflower (Broccoli / Phoolgobhi)',
    changeType: 'SUBTRACT',
    changeAmount: 50,
    previousStock: 64,
    newStock: 14,
    reason: 'Order #KK-ORD-8430 reserved stock (Low Stock Alert triggered)',
    timestamp: '2026-10-12T00:20:00Z'
  }
];

export const initialFarmerCustomers: FarmerCustomer[] = [
  {
    id: 'cust_b01',
    name: 'Sharma Foods Ltd.',
    phone: '+91 94150 11223',
    email: 'procure@sharmafoods.in',
    location: 'Alambagh Industrial Area, Lucknow',
    businessType: 'Central Food Kitchen & Canteen',
    totalOrders: 8,
    totalSpending: 48600,
    lastOrderDate: '2026-10-11',
    registeredDate: '2026-05-12'
  },
  {
    id: 'cust_b02',
    name: 'Patanjali Fresh Outlets',
    phone: '+91 98390 44556',
    email: 'aliganj@patanjalifresh.in',
    location: 'Aliganj, Lucknow',
    businessType: 'Retail Superstore Cluster',
    totalOrders: 5,
    totalSpending: 32400,
    lastOrderDate: '2026-10-11',
    registeredDate: '2026-06-20'
  },
  {
    id: 'cust_b03',
    name: 'Haldiram Snacks Manufacturing',
    phone: '+91 91234 88771',
    email: 'supply@haldiramkanpur.in',
    location: 'Transport Nagar, Lucknow',
    businessType: 'Snack & Food Processor',
    totalOrders: 12,
    totalSpending: 84250,
    lastOrderDate: '2026-10-09',
    registeredDate: '2026-03-10'
  },
  {
    id: 'cust_b04',
    name: 'Blinkit Dark Store Gomti Nagar',
    phone: '+91 98899 33221',
    email: 'procure.lko@blinkit.com',
    location: 'Gomti Nagar, Lucknow',
    businessType: 'Quick Commerce Hub',
    totalOrders: 3,
    totalSpending: 9600,
    lastOrderDate: '2026-10-12',
    registeredDate: '2026-08-01'
  }
];

export const initialFarmerTransactions: FarmerTransaction[] = [
  {
    id: 'txn_01',
    farmerId: 'farmer_001',
    orderId: 'ord_f103',
    orderNumber: 'KK-ORD-8390',
    amount: 9250,
    date: '2026-10-10T16:00:00Z',
    paymentStatus: 'Paid',
    paymentMethod: 'Instant UPI Payout',
    bankRefNumber: 'UPI/261010/893120'
  },
  {
    id: 'txn_02',
    farmerId: 'farmer_001',
    orderId: 'ord_f101',
    orderNumber: 'KK-ORD-8421',
    amount: 5700,
    date: '2026-10-11T18:00:00Z',
    paymentStatus: 'Paid',
    paymentMethod: 'ICICI Escrow Auto-Release',
    bankRefNumber: 'ESC/261011/449102'
  },
  {
    id: 'txn_03',
    farmerId: 'farmer_001',
    orderId: 'ord_f102',
    orderNumber: 'KK-ORD-8422',
    amount: 5600,
    date: '2026-10-11T19:30:00Z',
    paymentStatus: 'Processing',
    paymentMethod: 'Escrow Locked',
    bankRefNumber: 'ESC/LOCK/55819'
  }
];

export const initialFarmerDeliveries: FarmerDeliveryItem[] = [
  {
    id: 'del_01',
    orderId: 'ord_f101',
    orderNumber: 'KK-ORD-8421',
    customerName: 'Sharma Foods Ltd.',
    deliveryAddress: 'Alambagh Industrial Area, Lucknow',
    pickupStatus: 'Picked Up',
    deliveryStatus: 'In Transit',
    expectedDelivery: 'Today, 4:00 PM',
    logisticsPartner: 'KisanKart Cold Fleet',
    vehicleNumber: 'UP-32-BT-1102',
    driverName: 'Mahesh Singh',
    driverPhone: '+91 94500 22331'
  },
  {
    id: 'del_02',
    orderId: 'ord_f102',
    orderNumber: 'KK-ORD-8422',
    customerName: 'Patanjali Fresh Outlets',
    deliveryAddress: 'Aliganj, Lucknow',
    pickupStatus: 'Pickup Scheduled',
    deliveryStatus: 'Pickup Scheduled',
    expectedDelivery: 'Tomorrow, 11:00 AM',
    logisticsPartner: 'KisanKart Agro Express',
    driverName: 'Suraj Pal',
    driverPhone: '+91 98399 44112'
  },
  {
    id: 'del_03',
    orderId: 'ord_f104',
    orderNumber: 'KK-ORD-8430',
    customerName: 'Blinkit Dark Store',
    deliveryAddress: 'Gomti Nagar, Lucknow',
    pickupStatus: 'Ready for Pickup',
    deliveryStatus: 'Ready for Pickup',
    expectedDelivery: 'Today, 6:00 PM',
    logisticsPartner: 'KisanKart Hub-Van'
  }
];

export const initialFarmerOffers: FarmerOffer[] = [
  {
    id: 'off_01',
    farmerId: 'farmer_001',
    offerName: 'Bulk Harvest Discount (Tomatoes)',
    productId: 'prod_f01',
    productName: 'Red Hybrid Tomatoes',
    discountType: 'Percentage',
    discountValue: 10,
    startDate: '2026-10-10',
    endDate: '2026-10-25',
    maximumUsage: 20,
    timesUsed: 4,
    status: 'Active'
  },
  {
    id: 'off_02',
    farmerId: 'farmer_001',
    offerName: 'Processor Special Rate (Potatoes)',
    productId: 'prod_f02',
    productName: 'Chipsona Potatoes',
    discountType: 'Fixed Amount',
    discountValue: 1.5, // ₹1.5/kg off
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    maximumUsage: 10,
    timesUsed: 2,
    status: 'Active'
  }
];

export const initialFarmerNotifications: FarmerNotification[] = [
  {
    id: 'notif_f01',
    farmerId: 'farmer_001',
    type: 'New Order',
    title: 'New Order Received #KK-ORD-8430',
    message: 'Blinkit Gomti Nagar ordered 50 kg Green Cauliflower. Confirm order to initiate dispatch.',
    timestamp: '15 mins ago',
    isRead: false,
    link: '/farmer/orders/ord_f104'
  },
  {
    id: 'notif_f02',
    farmerId: 'farmer_001',
    type: 'Payment Received',
    title: '₹5,700 Deposited into Bank Account',
    message: 'Payment for order #KK-ORD-8421 was successfully settled via Instant UPI Payout.',
    timestamp: '2 hours ago',
    isRead: false,
    link: '/farmer/earnings'
  },
  {
    id: 'notif_f03',
    farmerId: 'farmer_001',
    type: 'Low Stock',
    title: 'Low Stock Alert: Green Cauliflower',
    message: 'Available stock is down to 14 kg (below threshold 25 kg). Update stock to avoid order cancellations.',
    timestamp: '3 hours ago',
    isRead: false,
    link: '/farmer/inventory'
  },
  {
    id: 'notif_f04',
    farmerId: 'farmer_001',
    type: 'Order Status Changed',
    title: 'Consignment In-Transit #KK-ORD-8421',
    message: 'Driver Mahesh Singh has loaded the 300 kg potato lot and is enroute to Sharma Foods.',
    timestamp: '5 hours ago',
    isRead: true,
    link: '/farmer/delivery'
  },
  {
    id: 'notif_f05',
    farmerId: 'farmer_001',
    type: 'Admin Announcement',
    title: 'APMC Lucknow Mandi Winter Schedule',
    message: 'Weighbridge timings revised from 6:00 AM to 9:00 PM starting this week. Plan dispatches accordingly.',
    timestamp: '1 day ago',
    isRead: true
  }
];
