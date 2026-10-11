import {
  BuyerProduct,
  BuyerCategory,
  BuyerOrder,
  BuyerAddress,
  BuyerPaymentMethod,
  BuyerTransaction,
  BuyerNotification
} from '@/types/buyer';

export const mockCategories: BuyerCategory[] = [
  {
    id: 'cat-veg',
    name: 'Vegetables',
    hindiName: 'ताजी सब्जियां',
    icon: 'Carrot',
    count: 38,
    description: 'Farm-fresh tomatoes, potatoes, onions, peas & greens direct from farm-gates'
  },
  {
    id: 'cat-fruits',
    name: 'Fruits',
    hindiName: 'ताजे फल',
    icon: 'Apple',
    count: 24,
    description: 'Seasonal orchard fruits including mangoes, guavas, papayas and melons'
  },
  {
    id: 'cat-grains',
    name: 'Grains',
    hindiName: 'अनाज एवं खाद्यान्न',
    icon: 'Wheat',
    count: 42,
    description: 'Pusa basmati paddy, Sharbati MP wheat, and yellow maize'
  },
  {
    id: 'cat-pulses',
    name: 'Pulses',
    hindiName: 'दालें एवं दलहन',
    icon: 'Sprout',
    count: 19,
    description: 'Unpolished Arhar/Tur, Chana dal, Moong and whole Urad'
  },
  {
    id: 'cat-spices',
    name: 'Spices',
    hindiName: 'शुद्ध मसाले',
    icon: 'Flame',
    count: 16,
    description: 'Guntur red chilli, Salem turmeric, and cumin direct from spice growers'
  },
  {
    id: 'cat-dairy',
    name: 'Dairy',
    hindiName: 'डेयरी उत्पाद',
    icon: 'Milk',
    count: 12,
    description: 'Bilona Gir Cow A2 ghee, fresh paneer, and farm-churned butter'
  },
  {
    id: 'cat-organic',
    name: 'Organic',
    hindiName: 'प्रमाणित जैविक',
    icon: 'Leaf',
    count: 27,
    description: 'NPOP & Jaivik Bharat certified pesticide-free agricultural produce'
  },
  {
    id: 'cat-seasonal',
    name: 'Seasonal Crops',
    hindiName: 'मौसमी फसलें',
    icon: 'Calendar',
    count: 15,
    description: 'Peak harvest produce with highest sweetness and lowest mandi rates'
  }
];

export const mockProducts: BuyerProduct[] = [
  {
    id: 'prod-001',
    name: 'Red Hybrid Tomatoes (Grade A)',
    hindiName: 'देसी हाइब्रिड लाल टमाटर',
    category: 'Vegetables',
    price: 28,
    unit: 'kg',
    farmer: 'Rajesh Kumar',
    farmerId: 'FARM-001',
    location: 'Bakshi Ka Talab, Lucknow',
    mandi: 'Lucknow Mandi',
    state: 'Uttar Pradesh',
    rating: 4.8,
    reviewsCount: 142,
    stock: 450,
    minOrderQty: 10,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
    description: 'Farm-fresh, vine-ripened red hybrid tomatoes harvested early morning. Firm texture, uniform size, and zero transit bruising. Ideal for restaurants, caterers, and bulk retail.',
    isOrganic: false,
    harvestDate: 'Yesterday (Harvested at 5:30 AM)',
    grade: 'Grade A',
    isFeatured: true,
    isRecommended: true
  },
  {
    id: 'prod-002',
    name: 'Organic Sharbati Golden Wheat',
    hindiName: 'जैविक शरबती गेहूं',
    category: 'Grains',
    price: 36,
    unit: 'kg',
    farmer: 'Balvinder Singh',
    farmerId: 'FARM-002',
    location: 'Sehore Mandi Yard, Sehore',
    mandi: 'Sehore APMC',
    state: 'Madhya Pradesh',
    rating: 4.9,
    reviewsCount: 215,
    stock: 1200,
    minOrderQty: 50,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
    description: 'Famed MP Sharbati wheat grown in the black soil of Sehore. High protein and gluten content yielding exceptionally soft and sweet rotis. Cleaned, machine-sorted, and stone-free.',
    isOrganic: true,
    harvestDate: 'Current Season Lot (Moisture 10.2%)',
    grade: 'Certified Organic',
    isFeatured: true,
    isRecommended: true
  },
  {
    id: 'prod-003',
    name: 'Pusa 1121 Premium Basmati Rice',
    hindiName: 'पूसा 1121 बासमती चावल',
    category: 'Grains',
    price: 88,
    unit: 'kg',
    farmer: 'Gurpreet Singh',
    farmerId: 'FARM-003',
    location: 'Karnal Mandi Hub',
    mandi: 'Karnal Grain Market',
    state: 'Haryana',
    rating: 4.9,
    reviewsCount: 310,
    stock: 850,
    minOrderQty: 25,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    description: 'Extra long grain aged Pusa 1121 steam Basmati. Elongates over 2x upon boiling with signature aromatic scent. Moisture verified below 11.5% with zero broken grains.',
    isOrganic: false,
    harvestDate: 'Aged 1 Year Lot',
    grade: 'Export Quality',
    isFeatured: true,
    isRecommended: false
  },
  {
    id: 'prod-004',
    name: 'Chipsona Processing Potatoes',
    hindiName: 'चिप्सोना स्पेशल आलू',
    category: 'Vegetables',
    price: 19,
    unit: 'kg',
    farmer: 'Ramcharan Verma',
    farmerId: 'FARM-004',
    location: 'Farrukhabad Mandi',
    mandi: 'Farrukhabad Hub',
    state: 'Uttar Pradesh',
    rating: 4.7,
    reviewsCount: 98,
    stock: 2400,
    minOrderQty: 100,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
    description: 'High dry-matter, low sugar content Chipsona potatoes ideal for chip manufacturing, wafer makers, and commercial French fries. Sorted 45mm+ size.',
    isOrganic: false,
    harvestDate: 'Harvested 3 Days Ago (Cold Shed Stored)',
    grade: 'Grade A',
    isFeatured: true,
    isRecommended: true
  },
  {
    id: 'prod-005',
    name: 'Fresh Sweet Green Peas (Matar)',
    hindiName: 'मीठी ताजी हरी मटर',
    category: 'Vegetables',
    price: 42,
    unit: 'kg',
    farmer: 'Rameshwar Patidar',
    farmerId: 'FARM-005',
    location: 'Kakori Mandi Zone, Lucknow',
    mandi: 'Lucknow Mandi',
    state: 'Uttar Pradesh',
    rating: 4.6,
    reviewsCount: 76,
    stock: 180,
    minOrderQty: 10,
    image: 'https://images.unsplash.com/photo-1592394533824-9440e5d68530?w=800&auto=format&fit=crop&q=80',
    description: 'Tender, sweet green pods picked at dawn. Freshly podded with high brix sweetness index. Transported in aerated mesh bags to prevent sweating.',
    isOrganic: true,
    harvestDate: 'Today Morning Picked',
    grade: 'Grade A',
    isFeatured: false,
    isRecommended: true
  },
  {
    id: 'prod-006',
    name: 'Yellow Mustard Seeds (Sarson)',
    hindiName: 'पीली सरसों बीज',
    category: 'Spices',
    price: 68,
    unit: 'kg',
    farmer: 'Hariram Gurjar',
    farmerId: 'FARM-006',
    location: 'Bharatpur Mandi',
    mandi: 'Bharatpur Oilseed APMC',
    state: 'Rajasthan',
    rating: 4.8,
    reviewsCount: 88,
    stock: 650,
    minOrderQty: 25,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    description: 'Rich oil content (41%+) yellow mustard seeds from the mustard heartland of eastern Rajasthan. Pungent aroma and pristine machine-cleaned grade.',
    isOrganic: false,
    harvestDate: 'Rabi Season Fresh Stock',
    grade: 'Grade A',
    isFeatured: false,
    isRecommended: false
  },
  {
    id: 'prod-007',
    name: 'Ratnagiri Alphonso Mangoes (Hapus)',
    hindiName: 'रत्नागिरी हापुस आम',
    category: 'Fruits',
    price: 180,
    unit: 'kg',
    farmer: 'Sanjay Deshmukh',
    farmerId: 'FARM-007',
    location: 'Ratnagiri Coastal Belt',
    mandi: 'Vashi Mandi Yard',
    state: 'Maharashtra',
    rating: 5.0,
    reviewsCount: 420,
    stock: 220,
    minOrderQty: 5,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80',
    description: 'Naturally grass-ripened GI-tagged Alphonso mangoes without carbide or artificial ripening agents. Exquisite saffron pulp and rich aromatic sweetness.',
    isOrganic: true,
    harvestDate: 'Orchard Packed',
    grade: 'Export Quality',
    isFeatured: true,
    isRecommended: true
  },
  {
    id: 'prod-008',
    name: 'Guntur Stemless Red Chilli (Teja)',
    hindiName: 'गुंटूर लाल मिर्च (तेजा)',
    category: 'Spices',
    price: 145,
    unit: 'kg',
    farmer: 'Venkatesh Rao',
    farmerId: 'FARM-008',
    location: 'Guntur Mirchi Yard',
    mandi: 'Guntur APMC',
    state: 'Andhra Pradesh',
    rating: 4.9,
    reviewsCount: 165,
    stock: 500,
    minOrderQty: 10,
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80',
    description: 'Hot Guntur Teja red chillies sun-dried on cement platforms with stems removed. High SHU capsaicin heat level and fiery natural red hue.',
    isOrganic: false,
    harvestDate: 'Sun Dried Fresh Lot',
    grade: 'Export Quality',
    isFeatured: false,
    isRecommended: true
  },
  {
    id: 'prod-009',
    name: 'Organic Desi Tur Dal (Arhar)',
    hindiName: 'देसी अरहर दाल (बिना पॉलिश)',
    category: 'Pulses',
    price: 130,
    unit: 'kg',
    farmer: 'Dharmendra Yadav',
    farmerId: 'FARM-009',
    location: 'Latur Dal Mill Cluster',
    mandi: 'Latur APMC',
    state: 'Maharashtra',
    rating: 4.8,
    reviewsCount: 184,
    stock: 900,
    minOrderQty: 20,
    image: 'https://images.unsplash.com/photo-1585994192701-f1a505c817ea?w=800&auto=format&fit=crop&q=80',
    description: 'Unpolished split pigeon pea dal processed with water wash only. Retains natural dietary fibers, high plant protein, and cooks easily with authentic village aroma.',
    isOrganic: true,
    harvestDate: 'New Crop Season',
    grade: 'Certified Organic',
    isFeatured: true,
    isRecommended: false
  },
  {
    id: 'prod-010',
    name: 'Pure Gir Cow A2 Bilona Ghee',
    hindiName: 'शुद्ध गिर गाय A2 बिलोना घी',
    category: 'Dairy',
    price: 1450,
    unit: 'kg',
    farmer: 'Kishore Patel',
    farmerId: 'FARM-010',
    location: 'Anand Gaushala Cluster',
    mandi: 'Anand Milk Union',
    state: 'Gujarat',
    rating: 5.0,
    reviewsCount: 230,
    stock: 45,
    minOrderQty: 1,
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&auto=format&fit=crop&q=80',
    description: 'Traditional Vedic Bilona method ghee prepared from curd churned with wooden churners. Golden granular texture, rich in natural vitamins and gut-friendly butyric acid.',
    isOrganic: true,
    harvestDate: 'Freshly Churned this week',
    grade: 'Certified Organic',
    isFeatured: false,
    isRecommended: true
  },
  {
    id: 'prod-011',
    name: 'Nasik Red Onions (Medium-Large)',
    hindiName: 'नासिक लाल प्याज',
    category: 'Vegetables',
    price: 32,
    unit: 'kg',
    farmer: 'Pravin Kadam',
    farmerId: 'FARM-011',
    location: 'Lasalgaon Mandi Yard',
    mandi: 'Lasalgaon Onion APMC',
    state: 'Maharashtra',
    rating: 4.7,
    reviewsCount: 110,
    stock: 3500,
    minOrderQty: 50,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
    description: 'Pungent, dry-skin red onions from Asia’s largest onion market in Lasalgaon. Solid layers, excellent shelf life of 45+ days in well-ventilated storage.',
    isOrganic: false,
    harvestDate: 'Rabi Harvest Lot',
    grade: 'Grade A',
    isFeatured: false,
    isRecommended: false
  },
  {
    id: 'prod-012',
    name: 'Organic Kashmiri Walnuts (Giri)',
    hindiName: 'कश्मीरी अखरोट गिरी',
    category: 'Seasonal Crops',
    price: 850,
    unit: 'kg',
    farmer: 'Ghulam Nabi',
    farmerId: 'FARM-012',
    location: 'Shopian Valley Orchards',
    mandi: 'Srinagar Fruit Mandi',
    state: 'Jammu & Kashmir',
    rating: 4.9,
    reviewsCount: 95,
    stock: 0, // OUT OF STOCK test case
    minOrderQty: 2,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=80',
    description: 'Snow-water fed organic walnut kernels from Shopian. Light colored extra crisp halves rich in natural Omega-3 plant fats with zero bleaching.',
    isOrganic: true,
    harvestDate: 'Autumn Harvest Lot',
    grade: 'Export Quality',
    isFeatured: false,
    isRecommended: false
  }
];

export const mockAddresses: BuyerAddress[] = [
  {
    id: 'addr-01',
    fullName: 'Sharma Foods Procurements (Rahul Sharma)',
    phone: '+91 98765 43210',
    houseStreet: 'Plot 42, Transport Nagar Industrial Area',
    villageCity: 'Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    pinCode: '226012',
    type: 'Work',
    isDefault: true
  },
  {
    id: 'addr-02',
    fullName: 'Rahul Sharma (Central Kitchen Hub)',
    phone: '+91 98765 43210',
    houseStreet: 'B-14, Sector 63 Food Processing Hub',
    villageCity: 'Noida',
    district: 'Gautam Buddha Nagar',
    state: 'Uttar Pradesh',
    pinCode: '201301',
    type: 'Work',
    isDefault: false
  },
  {
    id: 'addr-03',
    fullName: 'Sharma Residence',
    phone: '+91 94150 11223',
    houseStreet: 'House 5, Gomti Nagar Extension, River View',
    villageCity: 'Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    pinCode: '226010',
    type: 'Home',
    isDefault: false
  }
];

export const mockOrders: BuyerOrder[] = [
  {
    id: 'KK-10482',
    date: '11 Oct 2026, 04:30 PM',
    items: [
      {
        product: mockProducts[0], // Red Hybrid Tomatoes
        quantity: 100,
        price: 28
      },
      {
        product: mockProducts[4], // Green Peas
        quantity: 30,
        price: 42
      }
    ],
    subtotal: 4060,
    deliveryFee: 0,
    discount: 100,
    total: 3960,
    status: 'Out for Delivery',
    address: mockAddresses[0],
    paymentMethod: 'UPI',
    paymentStatus: 'Successful',
    deliveryPartner: 'AgriLogix Express (Electric Van UP-32-EA-9912)',
    deliveryDate: 'Today, by 6:00 PM',
    trackingNumber: 'TRK-ALX-882910',
    farmerContact: '+91 94150 22334 (Rajesh Kumar)',
    timeline: [
      {
        status: 'Placed',
        time: '11 Oct, 04:30 PM',
        completed: true,
        description: 'Order placed by Sharma Foods and escrow pre-authorized.'
      },
      {
        status: 'Confirmed',
        time: '11 Oct, 04:45 PM',
        completed: true,
        description: 'Farmer Rajesh Kumar accepted the order at Bakshi Ka Talab.'
      },
      {
        status: 'Packed',
        time: '11 Oct, 07:15 PM',
        completed: true,
        description: 'Quality grading passed. Packed in aerated crate lots.'
      },
      {
        status: 'Shipped',
        time: '12 Oct, 06:00 AM',
        completed: true,
        description: 'Dispatched from Lucknow farmgate logistics hub.'
      },
      {
        status: 'Out for Delivery',
        time: '12 Oct, 11:20 AM',
        completed: true,
        description: 'Driver Mahesh Yadav out for delivery to Transport Nagar.'
      },
      {
        status: 'Delivered',
        time: 'Expected 06:00 PM',
        completed: false,
        description: 'Delivery verification PIN will be shared with the driver.'
      }
    ]
  },
  {
    id: 'KK-10390',
    date: '08 Oct 2026, 11:15 AM',
    items: [
      {
        product: mockProducts[1], // Sharbati Wheat
        quantity: 200,
        price: 36
      }
    ],
    subtotal: 7200,
    deliveryFee: 150,
    discount: 200,
    total: 7150,
    status: 'Delivered',
    address: mockAddresses[0],
    paymentMethod: 'Net Banking',
    paymentStatus: 'Successful',
    deliveryPartner: 'Delhivery Mandi Freight',
    deliveryDate: '10 Oct 2026',
    trackingNumber: 'TRK-DEL-441920',
    farmerContact: '+91 98260 11442 (Balvinder Singh)',
    timeline: [
      {
        status: 'Placed',
        time: '08 Oct, 11:15 AM',
        completed: true,
        description: 'Bulk order placed for Sehore Organic Sharbati Wheat.'
      },
      {
        status: 'Confirmed',
        time: '08 Oct, 12:00 PM',
        completed: true,
        description: 'Weighbridge slip and lab moisture certificate uploaded.'
      },
      {
        status: 'Packed',
        time: '08 Oct, 04:00 PM',
        completed: true,
        description: '4 jute bags (50kg each) sealed with KisanKart quality stamp.'
      },
      {
        status: 'Shipped',
        time: '09 Oct, 08:30 AM',
        completed: true,
        description: 'e-Way Bill EWB-991208 generated. Truck dispatched.'
      },
      {
        status: 'Out for Delivery',
        time: '10 Oct, 09:00 AM',
        completed: true,
        description: 'Final mile delivery van in transit.'
      },
      {
        status: 'Delivered',
        time: '10 Oct, 01:45 PM',
        completed: true,
        description: 'Successfully received and accepted at warehouse.'
      }
    ]
  },
  {
    id: 'KK-10214',
    date: '28 Sep 2026, 09:40 AM',
    items: [
      {
        product: mockProducts[3], // Potatoes
        quantity: 500,
        price: 19
      }
    ],
    subtotal: 9500,
    deliveryFee: 0,
    discount: 300,
    total: 9200,
    status: 'Delivered',
    address: mockAddresses[1],
    paymentMethod: 'UPI',
    paymentStatus: 'Successful',
    deliveryPartner: 'Kisan Cargo Fleet',
    deliveryDate: '30 Sep 2026',
    trackingNumber: 'TRK-KCF-119280',
    farmerContact: '+91 94150 99881 (Ramcharan Verma)',
    timeline: [
      {
        status: 'Placed',
        time: '28 Sep, 09:40 AM',
        completed: true,
        description: 'Bulk purchase order locked.'
      },
      {
        status: 'Confirmed',
        time: '28 Sep, 10:15 AM',
        completed: true,
        description: 'Lot verified in Farrukhabad cold store.'
      },
      {
        status: 'Packed',
        time: '28 Sep, 03:00 PM',
        completed: true,
        description: 'Crates loaded on container vehicle.'
      },
      {
        status: 'Shipped',
        time: '29 Sep, 05:00 AM',
        completed: true,
        description: 'Interstate transit completed.'
      },
      {
        status: 'Out for Delivery',
        time: '30 Sep, 08:00 AM',
        completed: true,
        description: 'Approaching Sector 63 Noida hub.'
      },
      {
        status: 'Delivered',
        time: '30 Sep, 11:30 AM',
        completed: true,
        description: 'Digital gate receipt signed.'
      }
    ]
  }
];

export const mockPaymentMethods: BuyerPaymentMethod[] = [
  {
    id: 'pay-01',
    type: 'UPI',
    title: 'Google Pay / PhonePe UPI',
    details: 'sharmafoods@icici',
    isDefault: true
  },
  {
    id: 'pay-02',
    type: 'Card',
    title: 'HDFC Business Regalia Card',
    details: 'Ending in •••• 8841 (Exp 08/29)',
    isDefault: false
  },
  {
    id: 'pay-03',
    type: 'UPI',
    title: 'Paytm Mandi Wallet',
    details: '9876543210@paytm',
    isDefault: false
  }
];

export const mockTransactions: BuyerTransaction[] = [
  {
    id: 'TXN-882910',
    orderId: 'KK-10482',
    amount: 3960,
    date: '11 Oct 2026, 04:30 PM',
    status: 'Successful',
    method: 'UPI (sharmafoods@icici)'
  },
  {
    id: 'TXN-773120',
    orderId: 'KK-10390',
    amount: 7150,
    date: '08 Oct 2026, 11:15 AM',
    status: 'Successful',
    method: 'Net Banking (HDFC Corporate)'
  },
  {
    id: 'TXN-661092',
    orderId: 'KK-10214',
    amount: 9200,
    date: '28 Sep 2026, 09:40 AM',
    status: 'Successful',
    method: 'UPI (9876543210@paytm)'
  }
];

export const mockNotifications: BuyerNotification[] = [
  {
    id: 'notif-1',
    title: 'Shipment Out For Delivery 🚚',
    message: 'Your order #KK-10482 containing Red Hybrid Tomatoes is out for delivery with driver Mahesh Yadav.',
    category: 'Delivery',
    timestamp: '25 mins ago',
    read: false,
    link: '/buyer/orders/KK-10482/track'
  },
  {
    id: 'notif-2',
    title: 'Harvest Rate Drop Alert 📉',
    message: 'Red Hybrid Tomato rates in Bakshi Ka Talab Mandi dropped by 8% to ₹28/kg. Perfect time to procure bulk lots.',
    category: 'Offers',
    timestamp: '2 hours ago',
    read: false,
    link: '/buyer/products/prod-001'
  },
  {
    id: 'notif-3',
    title: 'Escrow Payment Cleared 💰',
    message: 'Payment of ₹7,150 for Order #KK-10390 was confirmed and released to farmer Balvinder Singh.',
    category: 'Payments',
    timestamp: 'Yesterday',
    read: true,
    link: '/buyer/orders/KK-10390'
  },
  {
    id: 'notif-4',
    title: 'Fresh Alphonso Mangoes In Stock 🥭',
    message: 'Organic GI-tagged Ratnagiri Hapus mangoes harvested today are now listed by farmer Sanjay Deshmukh.',
    category: 'Product availability',
    timestamp: '2 days ago',
    read: true,
    link: '/buyer/products/prod-007'
  }
];
