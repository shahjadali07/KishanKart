'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { Transaction } from '@/types/admin';
import {
  CreditCard,
  Search,
  Filter,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Download
} from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    const list = await adminService.getTransactions();
    setTransactions(list);
    setLoading(false);
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.orderId.toLowerCase().includes(search.toLowerCase()) ||
      tx.buyerName.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = methodFilter === 'ALL' || tx.paymentMethod === methodFilter;
    const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
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
              <h1 className="text-2xl font-bold text-gray-900">Transaction Ledger</h1>
              <p className="text-xs text-gray-500 mt-1">
                Real-time record of all buyer payments, escrow deposits, and gateway authorizations
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
              placeholder="Search TX ID, Order, Buyer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 font-medium">Method:</span>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
              >
                <option value="ALL">All Methods</option>
                <option value="UPI">UPI</option>
                <option value="NetBanking">Net Banking</option>
                <option value="Escrow_Auto">Escrow Auto-Pay</option>
                <option value="Card">Card</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Transaction ID</th>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Buyer</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Payment Method</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{tx.id}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${tx.orderId}`}
                        className="font-mono text-xs text-amber-700 hover:text-amber-800 font-medium"
                      >
                        {tx.orderId}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800 text-xs">{tx.buyerName}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{tx.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-medium text-xs">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          tx.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : tx.status === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{tx.date}</td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                      No matching transactions found.
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
