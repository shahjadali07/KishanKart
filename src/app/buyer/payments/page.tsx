'use client';

import React from 'react';
import Link from 'next/link';
import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { useBuyer } from '@/context/BuyerContext';
import {
  CreditCard,
  Smartphone,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export default function BuyerPaymentsPage() {
  const { paymentMethods, transactions } = useBuyer();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Successful':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Refunded':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Failed':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <BuyerLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="pb-2 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Payments & Escrow Wallet
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage corporate UPI VPAs, payment cards, and review digital transaction vouchers
          </p>
        </div>

        {/* 1. Saved Payment Methods */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-gray-900">
              Saved Mandi Payment Methods
            </h2>
            <button
              onClick={() => alert('Add payment method interface - In demo sandbox mode.')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#994200] hover:text-[#7A3400]"
            >
              <Plus className="h-4 w-4" />
              Add Payment Method
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="bg-white rounded-3xl border border-gray-200/90 p-5 shadow-2xs space-y-3 relative flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-xl bg-amber-50 text-[#994200] flex items-center justify-center">
                      {method.type === 'UPI' ? (
                        <Smartphone className="h-5 w-5" />
                      ) : (
                        <CreditCard className="h-5 w-5" />
                      )}
                    </div>
                    {method.isDefault && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                        Default
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm">
                    {method.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    {method.details}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Secured via UPI-AutoPay</span>
                  <span className="font-bold text-emerald-700">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Escrow Protection Trust Card */}
        <div className="bg-gradient-to-br from-white to-amber-50/60 rounded-3xl border border-amber-200/80 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-[#994200] flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                ICICI Mandi Escrow Settlement Protocol
              </h3>
              <p className="text-xs text-gray-600 max-w-xl leading-relaxed">
                Buyer deposits are securely locked until electronic weighbridge receipts and digital quality grading are signed. 100% money-back guarantee on grade mismatches.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Transaction History Table */}
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-sm text-gray-900">
              Payment & Settlement History ({transactions.length} records)
            </h2>
            <span className="text-xs text-gray-400">Live Ledger</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Transaction ID</th>
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Payment Method</th>
                  <th className="px-6 py-3.5">Date & Time</th>
                  <th className="px-6 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">
                      {tx.id}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/buyer/orders/${tx.orderId}`}
                        className="font-mono text-[#994200] hover:underline font-bold"
                      >
                        {tx.orderId}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-gray-900 text-sm">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {tx.method}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                          tx.status
                        )}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}
