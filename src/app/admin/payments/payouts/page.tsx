'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { Payout } from '@/types/admin';
import {
  ArrowLeft,
  Search,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    setLoading(true);
    const list = await adminService.getPayouts();
    setPayouts(list);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = async (payout: Payout) => {
    setApprovingId(payout.id);
    const ok = await adminService.approvePayout(payout.id);
    if (ok) {
      showToast(`Payout of ₹${payout.netPayout.toLocaleString('en-IN')} released to ${payout.farmerName}`);
      await loadPayouts();
    }
    setApprovingId(null);
  };

  const filtered = payouts.filter((p) => {
    const matchesSearch =
      p.farmerName.toLowerCase().includes(search.toLowerCase()) ||
      p.orderId.toLowerCase().includes(search.toLowerCase()) ||
      p.upiVpa.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/payments"
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Farmer Direct Payouts</h1>
              <p className="text-xs text-gray-500 mt-1">
                Disburse mandi sales proceeds directly to producer bank accounts via UPI auto-switch
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search Farmer, Order, UPI ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs w-full md:w-auto">
            <span className="text-gray-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
            >
              <option value="ALL">All Payouts</option>
              <option value="Pending">Pending Clearance</option>
              <option value="In_Review">In Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Farmer & Destination</th>
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Gross Lot</th>
                  <th className="px-6 py-3">Fee (3%)</th>
                  <th className="px-6 py-3">Net Disbursal</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-sm">{p.farmerName}</div>
                      <div className="text-xs text-amber-800 font-mono mt-0.5">{p.upiVpa}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${p.orderId}`}
                        className="font-mono text-xs text-amber-700 hover:text-amber-800 font-medium"
                      >
                        {p.orderId}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">₹{p.grossAmount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">₹{p.commission.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 font-bold text-emerald-800">₹{p.netPayout.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          p.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{p.date}</td>
                    <td className="px-6 py-4 text-right">
                      {p.status === 'Pending' ? (
                        <button
                          onClick={() => handleApprove(p)}
                          disabled={approvingId === p.id}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                        >
                          {approvingId === p.id ? 'Releasing...' : 'Release Payout'}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm">
                      No matching payouts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
