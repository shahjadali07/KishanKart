'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { Refund } from '@/types/admin';
import {
  ArrowLeft,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowDownLeft
} from 'lucide-react';

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRefunds();
  }, []);

  const loadRefunds = async () => {
    setLoading(true);
    const list = await adminService.getRefunds();
    setRefunds(list);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApproveRefund = async (refund: Refund) => {
    setProcessingId(refund.id);
    const ok = await adminService.approveRefund(refund.id);
    if (ok) {
      showToast(`Refund of ₹${refund.amount.toLocaleString('en-IN')} approved for ${refund.buyerName}`);
      await loadRefunds();
    }
    setProcessingId(null);
  };

  const filtered = refunds.filter((r) => {
    const matchesSearch =
      r.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      r.orderId.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
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
              <h1 className="text-2xl font-bold text-gray-900">Refund Claims & Settlements</h1>
              <p className="text-xs text-gray-500 mt-1">
                Audited buyer claim reimbursements due to QC rejections, grade mismatches or transit cancellations
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
              placeholder="Search Buyer, Order, Reason..."
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
              <option value="ALL">All Status</option>
              <option value="Pending">Pending Review</option>
              <option value="Processed">Processed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Buyer</th>
                  <th className="px-6 py-3">Refund Amount</th>
                  <th className="px-6 py-3">Audit Reason</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${r.orderId}`}
                        className="font-mono text-xs text-amber-700 hover:text-amber-800 font-medium"
                      >
                        {r.orderId}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 text-xs">{r.buyerName}</td>
                    <td className="px-6 py-4 font-bold text-red-700">₹{r.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-xs text-gray-600 max-w-xs">{r.reason}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          r.status === 'Processed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : r.status === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{r.date}</td>
                    <td className="px-6 py-4 text-right">
                      {r.status === 'Pending' ? (
                        <button
                          onClick={() => handleApproveRefund(r)}
                          disabled={processingId === r.id}
                          className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                        >
                          {processingId === r.id ? 'Processing...' : 'Approve Refund'}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Reimbursed</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                      No matching refund claims found.
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
