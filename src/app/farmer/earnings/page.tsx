'use client';

import React, { useState } from 'react';
import { useFarmer } from '@/context/FarmerContext';
import { FarmerLayout } from '@/components/farmer/FarmerLayout';
import {
  IndianRupee,
  TrendingUp,
  Download,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UpiPayoutModal } from '@/components/farmer/modals/UpiPayoutModal';

export default function FarmerEarningsPage() {
  const { transactions, stats, profile } = useFarmer();
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);

  const completedPayouts = transactions.filter((t) => t.paymentStatus === 'Paid');
  const pendingPayouts = transactions.filter((t) => t.paymentStatus !== 'Paid');

  const pendingAmount = pendingPayouts.reduce((sum, t) => sum + t.amount, 0);

  return (
    <FarmerLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>💰</span>
              <span>Earnings & Escrow Payouts</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Automated Mandi weighbridge settlements and instant direct UPI bank payouts
            </p>
          </div>

          <Button
            onClick={() => setIsPayoutOpen(true)}
            className="self-start sm:self-auto bg-[#D95D00] hover:bg-[#B34D00] text-white text-xs font-bold h-9 px-4 rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Zap className="h-4 w-4 fill-white" />
            <span>Instant UPI Withdrawal</span>
          </Button>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Total Revenue
            </span>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+{stats.revenueGrowth}% this harvest</span>
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Today's Revenue
            </span>
            <p className="text-2xl sm:text-3xl font-black text-[#994200] mt-1">
              ₹14,850
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Across 3 weighbridge gate-passes</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              This Month
            </span>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              ₹98,400
            </p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">October Mandi cycle</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs bg-amber-50/30">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              Pending Escrow Release
            </span>
            <p className="text-2xl sm:text-3xl font-black text-amber-900 mt-1">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">Auto-clears on delivery</p>
          </div>
        </div>

        {/* Bank & Escrow Guarantee Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                Connected Payout Account: {profile.bankAccount?.bankName || 'State Bank of India'}
              </h4>
              <p className="text-xs text-gray-500">
                A/C: {profile.bankAccount?.accountNumber} • UPI: {profile.bankAccount?.upiId} • Holder: {profile.farmerName}
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
            ✓ KYC Verified for Instant Settlement
          </span>
        </div>

        {/* Transaction History Ledger */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Disbursement & Settlement Ledger</h3>
            <span className="text-xs text-gray-400">Escrow Transaction Audit</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Disbursement Method</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Settled Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-amber-50/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      {t.bankRefNumber || t.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-700">
                      {t.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {t.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {new Date(t.date).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          t.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {t.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-sm text-[#994200]">
                      ₹{t.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <UpiPayoutModal
        isOpen={isPayoutOpen}
        onClose={() => setIsPayoutOpen(false)}
      />
    </FarmerLayout>
  );
}
