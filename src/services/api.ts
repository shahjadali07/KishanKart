// Central API client for the KisanKart backend.
// Every call is API-first with a graceful fallback path handled by callers,
// so the demo experience keeps working when the backend is unreachable.

const DEFAULT_BASE = 'http://localhost:5000';

export function getApiBaseUrl(): string {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return DEFAULT_BASE;
}

export function getStoredUser(): { id?: string; token?: string; role?: string } | null {
  try {
    const raw = localStorage.getItem('kisankart_user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return getStoredUser()?.token ?? null;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
}

export async function apiFetch<T = any>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<{ ok: boolean; status: number; data: T | null; error?: ApiError }> {
  const base = getApiBaseUrl();
  const token = options.token !== undefined ? options.token : getToken();

  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
    });
  } catch (err: any) {
    // Network-level failure (backend offline) — callers fall back to local data.
    return { ok: false, status: 0, data: null, error: new ApiError(0, err?.message ?? 'Network error') };
  }

  let payload: any = null;
  const text = await response.text().catch(() => '');
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const message =
      payload?.message ?? `Request failed with status ${response.status}`;
    return {
      ok: false,
      status: response.status,
      data: payload,
      error: new ApiError(response.status, message, payload?.errors),
    };
  }

  return { ok: true, status: response.status, data: payload };
}

// ---- Mappers: API product -> frontend product shapes ----

export interface ApiProduct {
  id?: string;
  _id?: string;
  name?: string;
  hindiName?: string;
  description?: string;
  category?: string;
  price?: number;
  unit?: string;
  availableQuantity?: number;
  minimumOrderQuantity?: number;
  lowStockThreshold?: number;
  isOrganic?: boolean;
  grade?: string;
  images?: string[];
  farmerId?: string;
  farmerName?: string;
  farmerLocation?: string;
  mandi?: string;
  location?: string;
  harvestDate?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function apiProductToBuyerProduct(p: ApiProduct): any {
  const id = (p.id ?? p._id ?? '').toString();
  return {
    id,
    name: p.name ?? 'Unlisted Produce',
    hindiName: p.hindiName,
    category: p.category ?? 'Vegetables',
    price: Number(p.price ?? 0),
    unit: p.unit ?? 'kg',
    farmer: p.farmerName ?? 'KisanKart Farmer',
    farmerId: (p.farmerId ?? '').toString(),
    location: p.location ?? p.farmerLocation ?? 'Lucknow',
    mandi: p.mandi ?? 'Lucknow Mandi',
    state: 'Uttar Pradesh',
    rating: 4.5,
    reviewsCount: 0,
    stock: Number(p.availableQuantity ?? 0),
    minOrderQty: Number(p.minimumOrderQuantity ?? 1),
    image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '/placeholder-produce.jpg',
    description: p.description ?? '',
    isOrganic: Boolean(p.isOrganic),
    harvestDate: p.harvestDate ?? new Date().toISOString().split('T')[0],
    grade: p.grade ?? 'Grade A',
  };
}

export function apiProductToFarmerProduct(p: ApiProduct): any {
  return {
    id: (p.id ?? p._id ?? '').toString(),
    farmerId: (p.farmerId ?? '').toString(),
    name: p.name ?? 'Unlisted Produce',
    hindiName: p.hindiName,
    description: p.description ?? '',
    category: p.category ?? 'Vegetables',
    images: Array.isArray(p.images) ? p.images : [],
    price: Number(p.price ?? 0),
    unit: p.unit ?? 'kg',
    availableQuantity: Number(p.availableQuantity ?? 0),
    minimumOrderQuantity: Number(p.minimumOrderQuantity ?? 1),
    lowStockThreshold: Number(p.lowStockThreshold ?? 0),
    isOrganic: Boolean(p.isOrganic),
    location: p.location ?? p.farmerLocation ?? '',
    mandi: p.mandi ?? '',
    grade: p.grade ?? 'Grade A',
    status: p.status ?? 'Active',
    harvestDate: p.harvestDate ?? '',
    createdAt: p.createdAt ?? new Date().toISOString(),
    updatedAt: p.updatedAt ?? new Date().toISOString(),
  };
}

// ---- Mappers: API order -> frontend order shapes ----

export interface ApiOrder {
  id?: string;
  _id?: string;
  orderNumber?: string;
  buyerId?: string;
  buyerName?: string;
  farmerId?: string;
  farmerName?: string;
  farmerLocation?: string;
  items?: any[];
  subtotal?: number;
  deliveryCharges?: number;
  discount?: number;
  commissionAmount?: number;
  farmerNetPayout?: number;
  totalAmount?: number;
  shippingAddress?: any;
  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: string;
  statusHistory?: any[];
  createdAt?: string;
  updatedAt?: string;
  cancelledReason?: string;
}

export function apiOrderToBuyerOrder(o: ApiOrder): any {
  const id = (o.id ?? o._id ?? '').toString();
  const statusMap: Record<string, string> = {
    Pending: 'Placed',
    Confirmed: 'Confirmed',
    Processing: 'Packed',
    Shipped: 'Shipped',
    Delivered: 'Delivered',
    Cancelled: 'Cancelled',
  };
  const items = (o.items ?? []).map((item: any) => ({
    product: {
      id: (item.productId ?? '').toString(),
      name: item.productName ?? 'Produce',
      price: Number(item.pricePerUnit ?? 0),
      unit: item.unit ?? 'kg',
      farmer: o.farmerName ?? 'KisanKart Farmer',
      farmerId: (o.farmerId ?? '').toString(),
      category: 'Vegetables',
      location: o.farmerLocation ?? '',
      mandi: '',
      state: '',
      rating: 4.5,
      reviewsCount: 0,
      stock: Number(item.quantity ?? 0),
      minOrderQty: 1,
      image: item.image ?? '/placeholder-produce.jpg',
      description: '',
      isOrganic: false,
      harvestDate: '',
      grade: 'Grade A',
    },
    quantity: Number(item.quantity ?? 0),
    price: Number(item.pricePerUnit ?? 0),
  }));
  const subtotal = Number(o.subtotal ?? 0);
  const deliveryFee = Number(o.deliveryCharges ?? 0);
  const discount = Number(o.discount ?? 0);
  const total = Number(o.totalAmount ?? subtotal + deliveryFee - discount);
  const addr = o.shippingAddress ?? {};
  const history = (o.statusHistory ?? []).map((h: any) => ({
    status: statusMap[h.status] ?? (h.status ?? 'Placed'),
    time: h.timestamp ? new Date(h.timestamp).toLocaleString('en-GB') : '',
    completed: true,
    description: h.note ?? `Order ${h.status}`,
  }));

  return {
    id,
    orderNumber: o.orderNumber ?? id,
    date: o.createdAt ? new Date(o.createdAt).toLocaleString('en-GB') : '',
    items,
    subtotal,
    deliveryFee,
    discount,
    total,
    status: statusMap[o.orderStatus ?? ''] ?? 'Placed',
    address: {
      id: `addr-${id}`,
      fullName: addr.fullName ?? '',
      phone: addr.phone ?? '',
      houseStreet: addr.address ?? '',
      villageCity: addr.city ?? '',
      district: addr.district ?? '',
      state: addr.state ?? '',
      pinCode: addr.pinCode ?? '',
      type: 'Home' as const,
      isDefault: false,
    },
    paymentMethod: (o.paymentMethod ?? 'Cash on Delivery') as any,
    paymentStatus: o.paymentStatus === 'Paid' ? 'Successful' : 'Pending',
    deliveryPartner: 'AgriLogix Express (Mandi Fleet)',
    deliveryDate: 'Expected within 48 hours',
    trackingNumber: `TRK-ALX-${id.slice(-6)}`,
    farmerContact: `+91 ${o.farmerName ?? ''}`,
    timeline: history.length ? history : [
      { status: 'Placed', time: '', completed: true, description: 'Order placed' },
    ],
  };
}

export function apiOrderToFarmerOrder(o: ApiOrder): any {
  const history = (o.statusHistory ?? []).map((h: any) => ({
    status: h.status ?? 'Pending',
    timestamp: h.timestamp ?? new Date().toISOString(),
    note: h.note,
  }));
  const addr = o.shippingAddress ?? {};
  return {
    id: (o.id ?? o._id ?? '').toString(),
    farmerId: (o.farmerId ?? '').toString(),
    orderNumber: o.orderNumber ?? (o.id ?? '').toString(),
    customerId: (o.buyerId ?? '').toString(),
    customerName: o.buyerName ?? 'Buyer',
    customerPhone: addr.phone,
    customerEmail: '',
    items: (o.items ?? []).map((item: any) => ({
      productId: (item.productId ?? '').toString(),
      productName: item.productName ?? 'Produce',
      image: item.image,
      quantity: Number(item.quantity ?? 0),
      unit: item.unit ?? 'kg',
      pricePerUnit: Number(item.pricePerUnit ?? 0),
      subtotal: Number(item.subtotal ?? 0),
    })),
    subtotal: Number(o.subtotal ?? 0),
    deliveryCharges: Number(o.deliveryCharges ?? 0),
    totalAmount: Number(o.totalAmount ?? 0),
    deliveryAddress: {
      fullName: addr.fullName ?? '',
      phone: addr.phone ?? '',
      address: addr.address ?? '',
      city: addr.city ?? '',
      district: addr.district ?? '',
      state: addr.state ?? '',
      pinCode: addr.pinCode ?? '',
    },
    orderDate: o.createdAt ?? new Date().toISOString(),
    paymentStatus: o.paymentStatus ?? 'Pending',
    orderStatus: o.orderStatus ?? 'Pending',
    logisticsPartner: 'AgriLogix Express',
    timeline: history,
  };
}
