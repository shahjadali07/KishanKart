'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { Order, OrderStatus } from '@/types/admin';
import {
  Search,
  ShoppingCart,
  Eye,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadOrders = async () => {
    const list = await adminService.getOrders({
      search: searchTerm,
      status: statusFilter,
      paymentStatus: paymentFilter,
    });
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();
  }, [searchTerm, statusFilter, paymentFilter]);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    await adminService.updateOrderStatus(orderId, status);
    showToast(`Order ${orderId} updated to ${status}.`);
    loadOrders();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Confirmed':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {toast && (
          <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold shadow-xl animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
            <span>{toast}</span>
          </div>
        )}

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              Procurement Orders & Mandi Contracts
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Supervise {orders.length} farm-to-enterprise supply contracts, weighbridge tare audits, and delivery stages
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Order ID, Buyer, or Farmer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 focus:bg-white"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-amber-600 focus:bg-white"
            >
              <option value="ALL">All Order Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped (In Transit)</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-amber-600 focus:bg-white"
            >
              <option value="ALL">All Payment States</option>
              <option value="Escrow_Locked">Escrow Locked (Safe)</option>
              <option value="Paid">Disbursed / Paid</option>
              <option value="Pending">Payment Pending</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDFBF7] border-b border-gray-200 text-gray-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-3">Buyer Enterprise</th>
                  <th className="py-3 px-3">Farmer & Belt</th>
                  <th className="py-3 px-3">Items & Quantity</th>
                  <th className="py-3 px-3">Contract Value</th>
                  <th className="py-3 px-3">Escrow Status</th>
                  <th className="py-3 px-3">Delivery Status</th>
                  <th className="py-3 px-4 text-right">Quick Update / View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      <Link href={`/admin/orders/${order.id}`} className="hover:text-amber-800 underline decoration-gray-300">
                        {order.id}
                      </Link>
                      <span className="text-[10px] text-gray-400 block font-normal">{order.orderDate}</span>
                    </td>

                    <td className="py-3 px-3 text-gray-800">
                      <span className="font-bold block">{order.buyerName}</span>
                      <span className="text-[10px] text-gray-400">{order.buyerBusiness}</span>
                    </td>

                    <td className="py-3 px-3 text-gray-700">
                      <span className="font-semibold block">{order.farmerName}</span>
                      <span className="text-[10px] text-gray-400">{order.farmerLocation}</span>
                    </td>

                    <td className="py-3 px-3 text-gray-700">
                      <span className="font-medium text-gray-900 block">{order.items[0]?.productName}</span>
                      <span className="text-[10px] text-gray-500">{order.items[0]?.quantity} kg</span>
                    </td>

                    <td className="py-3 px-3 font-extrabold text-[#994200]">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-50 text-gray-700 border border-gray-200">
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                          className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-700 focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          title="View Full Order Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
