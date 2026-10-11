'use client';

import React, { useState } from 'react';
import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { useAuth } from '@/context/AuthContext';
import {
  Settings,
  Bell,
  Shield,
  Lock,
  LogOut,
  Smartphone,
  CheckCircle2,
  Save,
  Globe
} from 'lucide-react';

export default function BuyerSettingsPage() {
  const { logout } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Notification Preferences
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [priceDrops, setPriceDrops] = useState(false);

  // Security Form
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Notification and privacy preferences saved!');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    showToast('Account security password successfully changed!');
  };

  return (
    <BuyerLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {toastMessage}
          </div>
        )}

        {/* Header */}
        <div className="pb-2 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Account Preferences & Security Settings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure APMC mandi dispatches, push notification channels, and active login sessions
          </p>
        </div>

        {/* Section 1: Notification Channels */}
        <form onSubmit={handleSavePreferences} className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="h-8 w-8 rounded-xl bg-amber-50 text-[#994200] flex items-center justify-center font-bold">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-gray-900">
                Dispatch & Price Alert Notifications
              </h2>
              <p className="text-xs text-gray-500">
                Choose how you want to be alerted for weighbridge tickets and truck arrivals
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-gray-50/60 rounded-2xl border border-gray-100">
              <div>
                <span className="font-bold text-gray-900 block">Consignment Tracking Notifications</span>
                <span className="text-gray-500 text-[11px]">Real-time driver transit updates and gate pass status</span>
              </div>
              <input
                type="checkbox"
                checked={orderAlerts}
                onChange={(e) => setOrderAlerts(e.target.checked)}
                className="h-5 w-5 accent-[#994200] rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50/60 rounded-2xl border border-gray-100">
              <div>
                <span className="font-bold text-gray-900 block">Email Invoices & Escrow Receipts</span>
                <span className="text-gray-500 text-[11px]">Receive signed PDF e-Way bills and GST tax invoices</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-5 w-5 accent-[#994200] rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50/60 rounded-2xl border border-gray-100">
              <div>
                <span className="font-bold text-gray-900 block">Mobile SMS & WhatsApp Dispatch Alerts</span>
                <span className="text-gray-500 text-[11px]">Direct messages with truck driver contacts</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="h-5 w-5 accent-[#994200] rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50/60 rounded-2xl border border-gray-100">
              <div>
                <span className="font-bold text-gray-900 block">Regional Harvest Rate Drop Bulletins</span>
                <span className="text-gray-500 text-[11px]">Notify me when prices of bulk crops decrease by 5%+</span>
              </div>
              <input
                type="checkbox"
                checked={priceDrops}
                onChange={(e) => setPriceDrops(e.target.checked)}
                className="h-5 w-5 accent-[#994200] rounded"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Save className="h-4 w-4" />
              Save Alert Preferences
            </button>
          </div>
        </form>

        {/* Section 2: Security & Password */}
        <form onSubmit={handlePasswordChange} className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="h-8 w-8 rounded-xl bg-amber-50 text-[#994200] flex items-center justify-center font-bold">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-gray-900">
                Security Password & Access Control
              </h2>
              <p className="text-xs text-gray-500">
                Ensure strong credentials to protect wholesale mandi escrow releases
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                placeholder="Min 8 characters"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                placeholder="Repeat password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              Update Password
            </button>
          </div>
        </form>

        {/* Section 3: Active Sessions & Global Logout */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="h-8 w-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-gray-900">
                Device Sessions & Remote Logout
              </h2>
              <p className="text-xs text-gray-500">
                Audit connected enterprise devices authorized to place bids
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-gray-900">Chrome on Windows (Current Active Session)</p>
                  <p className="text-gray-400 text-[11px]">IP: 103.21.244.18 • Lucknow, Uttar Pradesh</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">
                Active Now
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-gray-400 shrink-0" />
                <div>
                  <p className="font-bold text-gray-900">KisanKart Buyer Mobile App (Android)</p>
                  <p className="text-gray-400 text-[11px]">Last active yesterday at 4:30 PM • Noida</p>
                </div>
              </div>
              <button
                onClick={() => showToast('Remote mobile session terminated')}
                className="font-bold text-red-600 hover:underline text-[11px]"
              >
                Revoke Access
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <button
              onClick={() => {
                showToast('Logged out from all 2 active sessions');
                setTimeout(() => logout(), 1000);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition"
            >
              <LogOut className="h-4 w-4" />
              Logout From All Devices
            </button>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}
