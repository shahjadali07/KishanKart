'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { Order, OrderStatus } from '@/types/admin';
import {
  ArrowLeft,
  Package,
  User,
  Truck,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Phone,
  ShieldCheck,
  Building,
  RefreshCw
} from 'lucide-react';

function OrderDetailContent() {
  const params = useParams();
  const orderId = params?.id as string;
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('Pending');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    const data = await adminService.getOrderById(orderId);
    if (data) {
      setOrder({ ...data });
      setSelectedStatus(data.orderStatus);
    }
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusUpdate = async () => {
    if (!order) return;
    setUpdating(true);
    const success = await adminService.updateOrderStatus(order.id, selectedStatus);
    if (success) {
      showToast(`Order status updated to ${selectedStatus}`);
      await loadOrder();
    }
    setUpdating(false);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'Cancelled':
      case 'Refunded':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 max-w-6xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-100 animate-pulse rounded-xl"></div>
            <div className="h-96 bg-gray-100 animate-pulse rounded-xl"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="p-12 text-center max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">Order #{orderId} could not be located in the KisanKart marketplace registry.</p>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-700 text-white font-medium rounded-lg hover:bg-amber-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-gray-700 animate-fade-in text-sm font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </div>
        )}

        {/* Back navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
              title="Back to Orders"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">Order {order.id}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Paid via Escrow
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Booked on {order.orderDate}</p>
            </div>
          </div>

          {/* Quick status updater */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-semibold text-gray-600 pl-2">Admin Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
              className="text-xs font-medium bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-amber-600 outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || selectedStatus === order.orderStatus}
              className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold rounded-lg transition"
            >
              {updating ? 'Updating...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2 columns: Items, Financials & Parties */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products Table Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-700" />
                  <h2 className="font-semibold text-gray-900">Order Items & Lot Details</h2>
                </div>
                <span className="text-xs font-medium text-gray-500">{order.items.length} Product lot(s)</span>
              </div>
              <div className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Product Lot ID: {item.productId}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                        <span>Quantity: <strong>{item.quantity} Qtl</strong></span>
                        <span>Unit Rate: <strong>₹{item.pricePerUnit.toLocaleString('en-IN')}/Qtl</strong></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-gray-900">
                        ₹{item.totalPrice.toLocaleString('en-IN')}
                      </div>
                      <span className="text-xs text-emerald-700 font-medium">Mandi Gate Pass Cleared</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="bg-gray-50/70 p-6 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal Lot Value</span>
                  <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>KisanKart Platform Commission (3%)</span>
                  <span>₹{order.commissionAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Net Farmer Disbursal Due</span>
                  <span>₹{order.farmerNetPayout.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
                  <span>Total Buyer Invoice Paid</span>
                  <span className="text-amber-800">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Trading Parties: Farmer & Buyer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Farmer Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-700" />
                    <h3 className="font-semibold text-gray-900 text-sm">Producer / Farmer</h3>
                  </div>
                  <Link
                    href={`/admin/farmers/${order.farmerId}`}
                    className="text-xs text-amber-700 hover:text-amber-800 font-medium"
                  >
                    View Profile →
                  </Link>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{order.farmerName}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {order.farmerLocation}
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                  <span>Farmer ID: {order.farmerId}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-medium">KYC Verified</span>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-700" />
                    <h3 className="font-semibold text-gray-900 text-sm">Procuring Buyer</h3>
                  </div>
                  <Link
                    href={`/admin/buyers/${order.buyerId}`}
                    className="text-xs text-amber-700 hover:text-amber-800 font-medium"
                  >
                    View Profile →
                  </Link>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{order.buyerName}</p>
                  <p className="text-xs text-amber-800 font-medium">{order.buyerBusiness}</p>
                </div>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                  <span>Buyer ID: {order.buyerId}</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">Verified Enterprise</span>
                </div>
              </div>
            </div>

            {/* Logistics & Dispatch Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-700" />
                  <h3 className="font-semibold text-gray-900">Logistics & Mandi Dispatch</h3>
                </div>
                <span className="text-xs font-medium text-amber-800">
                  {order.deliveryPartner || 'AgriLogix Express'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-500 font-medium mb-1">Shipping Destination Facility</p>
                  <p className="font-semibold text-gray-900 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {order.shippingAddress}
                  </p>
                </div>
                <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transit Insurance:</span>
                    <span className="font-semibold text-emerald-700">Active (IFFCO-Tokio)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Waybill / e-Way Bill:</span>
                    <span className="font-semibold text-gray-900">EWB-{order.id.replace('ORD-', '')}-9928</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Target ETA:</span>
                    <span className="font-semibold text-gray-900">{order.deliveryDate || 'Within 48 Hours'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Timeline & Escrow Details */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100">
                <Clock className="w-5 h-5 text-amber-700" />
                <h3 className="font-semibold text-gray-900">Order Milestones</h3>
              </div>
              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
                {order.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 text-xs ${
                        step.completed
                          ? 'bg-amber-700 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-400 border border-gray-300'
                      }`}
                    >
                      {step.completed ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.status}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Escrow Guarantee Card */}
            <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-200/80 rounded-xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                KisanKart Mandi Escrow Lock
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                Payment is securely deposited in the ICICI Agri-Escrow account. Funds will be automatically disbursed to the farmer upon digital confirmation of quality inspection at delivery.
              </p>
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs">
                <span className="text-amber-800">Security Audit:</span>
                <span className="font-semibold text-emerald-800">100% Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
            Loading order details and escrow timeline...
          </div>
        </AdminLayout>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}
