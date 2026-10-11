'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { Transaction, Payout, Refund } from '@/types/admin';
import {
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';

export default function PaymentsOverviewPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [txList, pyList, rfList] = await Promise.all([
      adminService.getTransactions(),
      adminService.getPayouts(),
      adminService.getRefunds()
    ]);
    setTransactions(txList);
    setPayouts(pyList);
    setRefunds(rfList);
    setLoading(false);
  };

  const totalTransactionVolume = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalRevenue = Math.round(totalTransactionVolume * 0.03); // 3% platform commission
  const completedPayouts = payouts
    .filter(p => p.status === 'Completed')
    .reduce((acc, curr) => acc + curr.netPayout, 0);
  const pendingPayouts = payouts
    .filter(p => p.status === 'Pending')
    .reduce((acc, curr) => acc + curr.netPayout, 0);
  const totalRefunds = refunds.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments & Escrow Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Live settlement ledger, commission tracking, farmer direct-disbursals and refunds
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/payments/transactions"
              className="px-3.5 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-semibold shadow-sm transition"
            >
              Transactions
            </Link>
            <Link
              href="/admin/payments/payouts"
              className="px-3.5 py-2 bg-amber-700 text-white hover:bg-amber-800 rounded-lg text-xs font-semibold shadow-sm transition"
            >
              Farmer Payouts
            </Link>
            <Link
              href="/admin/payments/refunds"
              className="px-3.5 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-semibold shadow-sm transition"
            >
              Refunds
            </Link>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Gross Volume</span>
              <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-gray-900">₹{(totalTransactionVolume / 100000).toFixed(2)}L</span>
              <p className="text-xs text-emerald-600 mt-1 font-medium">+14.2% this month</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Platform Revenue</span>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
              <p className="text-xs text-gray-500 mt-1 font-medium">3% Mandi Commission</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Disbursed Payouts</span>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-gray-900">₹{(completedPayouts / 100000).toFixed(2)}L</span>
              <p className="text-xs text-gray-500 mt-1 font-medium">Auto-credited via UPI</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Pending Payouts</span>
              <div className="p-2 bg-yellow-50 rounded-lg text-yellow-700">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-gray-900">₹{pendingPayouts.toLocaleString('en-IN')}</span>
              <p className="text-xs text-amber-700 mt-1 font-medium">Awaiting Delivery QC</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Refunds Processed</span>
              <div className="p-2 bg-red-50 rounded-lg text-red-700">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-gray-900">₹{totalRefunds.toLocaleString('en-IN')}</span>
              <p className="text-xs text-gray-500 mt-1 font-medium">QC Rejections / Cancellations</p>
            </div>
          </div>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/payments/transactions"
            className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-amber-300 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-base group-hover:text-amber-800 transition">
                Transaction Ledger →
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full">
                {transactions.length} Records
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Real-time audit log of all incoming buyer deposits via UPI, NetBanking and NEFT Escrow.
            </p>
          </Link>

          <Link
            href="/admin/payments/payouts"
            className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-amber-300 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-base group-hover:text-amber-800 transition">
                Farmer Direct Payouts →
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full">
                {payouts.length} Payouts
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Verify mandi commission deductibles, examine bank UPI VPAs and authorize direct merchant credits.
            </p>
          </Link>

          <Link
            href="/admin/payments/refunds"
            className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-amber-300 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-base group-hover:text-amber-800 transition">
                Refunds & Dispute Credits →
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full">
                {refunds.length} Claims
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Review rejected mandi produce lots, grade mismatches and process swift reimbursement to buyer accounts.
            </p>
          </Link>
        </div>

        {/* Recent Payouts Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-base">Recent Farmer Payout Queues</h2>
            <Link
              href="/admin/payments/payouts"
              className="text-xs font-semibold text-amber-800 hover:text-amber-900"
            >
              View All Payouts →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Farmer</th>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Gross Lot Value</th>
                  <th className="px-6 py-3">Platform Fee (3%)</th>
                  <th className="px-6 py-3">Net Disbursed</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Settlement Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payouts.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{p.farmerName}</div>
                      <div className="text-xs text-gray-400">{p.upiVpa}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{p.orderId}</td>
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
