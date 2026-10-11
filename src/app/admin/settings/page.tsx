'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  Settings,
  Shield,
  Percent,
  Bell,
  Lock,
  User,
  CheckCircle,
  Smartphone,
  Globe,
  Sliders,
  LogOut,
  Save
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'platform' | 'commission' | 'notifications'>('commission');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Commission & Payout settings state
  const [commissionRate, setCommissionRate] = useState(3.0);
  const [minPayoutThreshold, setMinPayoutThreshold] = useState(2000);
  const [autoDisbursalHours, setAutoDisbursalHours] = useState(24);
  const [tdsDeduction, setTdsDeduction] = useState(1.0);

  // Profile state
  const [adminName, setAdminName] = useState('Admin Officer');
  const [adminEmail, setAdminEmail] = useState('admin@kishankart.gov.in');
  const [department, setDepartment] = useState('Agricultural Market Committee (APMC)');

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Platform state
  const [tradingHours, setTradingHours] = useState('04:00 AM - 08:00 PM IST');
  const [ewayThreshold, setEwayThreshold] = useState(50000);
  const [mandiCessPercentage, setMandiCessPercentage] = useState(0.5);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform settings saved and applied successfully!');
  };

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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Platform Settings</h1>
            <p className="text-xs text-gray-500 mt-1">
              Configure mandi commission formulas, financial escrow gates, security protocols and notifications
            </p>
          </div>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto space-x-6 text-sm">
          <button
            onClick={() => setActiveTab('commission')}
            className={`pb-3 font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'commission'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Percent className="w-4 h-4" />
            Commission & Payout Rules
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            Security & Access
          </button>

          <button
            onClick={() => setActiveTab('platform')}
            className={`pb-3 font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'platform'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Platform & Mandi Hours
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <User className="w-4 h-4" />
            Admin Profile
          </button>
        </div>

        {/* Tab 1: Commission & Payout Rules */}
        {activeTab === 'commission' && (
          <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6 max-w-3xl">
            <div>
              <h2 className="text-base font-bold text-gray-900">Marketplace Fee & Disbursal Formula</h2>
              <p className="text-xs text-gray-500 mt-1">
                Configured rates are automatically calculated on every mandi order and reflected in payments ledger.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/80">
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  KisanKart Platform Commission (%)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1.0"
                    max="10.0"
                    step="0.1"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                    className="w-full accent-amber-700"
                  />
                  <span className="font-bold text-base text-amber-800 w-16 text-right">
                    {commissionRate}%
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-2">
                  Deducted from the gross lot amount upon delivery QC clearance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Minimum Farmer Payout Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={minPayoutThreshold}
                    onChange={(e) => setMinPayoutThreshold(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Amounts below this will accumulate until threshold is met.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Escrow Quality Inspection Window (Hours)
                  </label>
                  <input
                    type="number"
                    value={autoDisbursalHours}
                    onChange={(e) => setAutoDisbursalHours(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Time buyer has to confirm moisture and grading before auto-release.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Statutory TDS Withholding Rate on Agri-Proceeds (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tdsDeduction}
                  onChange={(e) => setTdsDeduction(parseFloat(e.target.value) || 0)}
                  className="w-full sm:w-1/2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Section 194Q / 194-O Income Tax compliance.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg text-xs shadow-sm transition"
              >
                <Save className="w-4 h-4" />
                Save Commission Rules
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Security & Access */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6 max-w-3xl">
            <div>
              <h2 className="text-base font-bold text-gray-900">Security Credentials & Active Sessions</h2>
              <p className="text-xs text-gray-500 mt-1">
                Protect master admin authentication and monitor concurrent management logins.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg text-xs shadow-sm transition"
                >
                  Update Password
                </button>
              </div>
            </form>

            <div className="pt-6 border-t border-gray-200 space-y-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Active Admin Sessions</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Chrome on Windows (Current Session)</p>
                      <p className="text-gray-400">IP: 103.21.244.18 • Lucknow, Uttar Pradesh</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded">Active Now</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900">Safari on iPad (Mandi Audit Desk)</p>
                      <p className="text-gray-400">IP: 49.36.128.9 • New Delhi</p>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('Remote session terminated successfully')}
                    className="text-red-700 hover:text-red-800 font-semibold"
                  >
                    Revoke
                  </button>
                </div>
              </div>

              <button
                onClick={() => showToast('Logged out from all 2 active administrative devices')}
                className="mt-2 text-xs font-semibold text-red-700 hover:text-red-800 inline-flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout From All Other Sessions
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Platform Settings */}
        {activeTab === 'platform' && (
          <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6 max-w-3xl">
            <div>
              <h2 className="text-base font-bold text-gray-900">Mandi Operations & e-Way Bill Thresholds</h2>
              <p className="text-xs text-gray-500 mt-1">
                Configure electronic trading gate windows and statutory interstate freight parameters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Daily Mandi Trading Window
                </label>
                <input
                  type="text"
                  value={tradingHours}
                  onChange={(e) => setTradingHours(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Mandatory e-Way Bill Value Threshold (₹)
                </label>
                <input
                  type="number"
                  value={ewayThreshold}
                  onChange={(e) => setEwayThreshold(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  State Mandi Cess Surcharge (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={mandiCessPercentage}
                  onChange={(e) => setMandiCessPercentage(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg text-xs shadow-sm transition"
              >
                Save Platform Config
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6 max-w-3xl">
            <div>
              <h2 className="text-base font-bold text-gray-900">Administrator Profile & Department</h2>
              <p className="text-xs text-gray-500 mt-1">
                Designation details visible on inspection certificates and mandi audit memos.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Admin Officer Name</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Official Email Address</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Government / Platform Authority Board</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-medium focus:ring-1 focus:ring-amber-600 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg text-xs shadow-sm transition"
              >
                Update Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
