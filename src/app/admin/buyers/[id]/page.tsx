'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { Buyer, Order } from '@/types/admin';
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Ban,
  ShoppingCart,
  IndianRupee,
  FileText
} from 'lucide-react';

function BuyerDetailContent() {
  const params = useParams();
  const buyerId = params?.id as string;
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    if (!buyerId) return;
    setIsLoading(true);
    const b = await adminService.getBuyerById(buyerId);
    if (b) setBuyer(b);
    const ords = await adminService.getOrders();
    setOrders(ords.filter(o => o.buyerId === buyerId));
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [buyerId]);

  const handleToggleBlock = async () => {
    if (!buyer) return;
    const newStatus = buyer.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    await adminService.updateBuyerStatus(buyer.id, newStatus);
    showToast(`Buyer status updated to ${newStatus}.`);
    loadData();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
          Loading buyer organization record...
        </div>
      </AdminLayout>
    );
  }

  if (!buyer) {
    return (
      <AdminLayout>
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-3">
          <p className="text-sm font-bold text-gray-800">Buyer account not found.</p>
          <Link href="/admin/buyers" className="text-xs text-amber-800 font-bold hover:underline">
            ← Return to Buyer Directory
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {toast && (
          <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold shadow-xl animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
            <span>{toast}</span>
          </div>
        )}

        <Link
          href="/admin/buyers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Buyer Directory</span>
        </Link>

        {/* Header Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-800 font-black text-xl flex items-center justify-center shrink-0 border border-blue-200">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {buyer.businessName}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                  buyer.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border-rose-200'
                }`}>
                  {buyer.status}
                </span>
                <span className="text-xs font-mono text-gray-400">ID: {buyer.id}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-1">
                {buyer.businessType} • Registered on {buyer.registeredDate}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleBlock}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
              buyer.status === 'BLOCKED'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-50'
            }`}
          >
            {buyer.status === 'BLOCKED' ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Unblock Buyer</span>
              </>
            ) : (
              <>
                <Ban className="h-4 w-4" />
                <span>Block Account</span>
              </>
            )}
          </button>
        </div>

        {/* Sourcing Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Procurement Spent</span>
            <span className="text-xl font-black text-[#994200]">₹{buyer.totalSpent.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-gray-400 block mt-0.5">Across verified mandi farm gates</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Orders</span>
            <span className="text-xl font-bold text-gray-900">{buyer.totalOrders} Contracts</span>
            <span className="text-[11px] text-emerald-700 block mt-0.5">100% Digital Tare Verified</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Tax & FSSAI Status</span>
            <span className="text-xl font-bold text-gray-900">Verified Entity</span>
            <span className="text-[11px] text-gray-400 block mt-0.5 font-mono">GST: {buyer.gstNumber || 'Exempt'}</span>
          </div>
        </div>

        {/* Profile & Location details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">
              Procurement Officer & Contact
            </h3>
            <p>Authorized Representative: <strong className="text-gray-900">{buyer.name}</strong></p>
            <p>Mobile: <strong className="text-gray-900 font-mono">+91 {buyer.phone}</strong></p>
            <p>Email: <strong className="text-gray-900">{buyer.email}</strong></p>
            <p>FSSAI License: <strong className="font-mono text-gray-900">{buyer.fssaiNumber || 'Standard Central'}</strong></p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">
              Delivery Warehouse & Facility
            </h3>
            <p>Destination Hub: <strong className="text-gray-900">{buyer.city}, {buyer.district} ({buyer.state})</strong></p>
            <p>Delivery Address: <strong className="text-gray-900">{buyer.address}</strong></p>
            <p>Digital Tare Sync: <span className="text-emerald-700 font-bold">Enabled</span></p>
          </div>
        </div>

        {/* Recent Orders by this Buyer */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-gray-900 text-sm">
            Recent Procurement Contracts
          </h3>
          {orders.length === 0 ? (
            <p className="text-xs text-gray-500 py-4">No recent orders recorded for this buyer.</p>
          ) : (
            <div className="space-y-2 text-xs">
              {orders.map(o => (
                <div key={o.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900">{o.id}</span> • <span className="text-gray-500">{o.items[0]?.productName}</span>
                    <span className="text-[11px] text-gray-400 block">{o.orderDate} • Farmer: {o.farmerName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-[#994200] block">₹{o.totalAmount.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] font-bold text-gray-600">{o.orderStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default function BuyerDetailPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
            Loading buyer organization record...
          </div>
        </AdminLayout>
      }
    >
      <BuyerDetailContent />
    </Suspense>
  );
}
