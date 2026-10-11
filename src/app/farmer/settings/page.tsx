'use client';

import React, { useState } from 'react';
import { useFarmer } from '@/context/FarmerContext';
import { FarmerLayout } from '@/components/farmer/FarmerLayout';
import { Settings, Lock, Bell, Shield, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FarmerSettingsPage() {
  const { profile } = useFarmer();
  const [activeTab, setActiveTab] = useState<'ACCOUNT' | 'NOTIF' | 'SECURITY'>('ACCOUNT');

  // Password fields
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  // Notification toggles
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [payoutAlerts, setPayoutAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [mandiRateAlerts, setMandiRateAlerts] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmPassword && newPassword.length >= 6) {
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 2500);
      setCurrPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert('Passwords must match and be at least 6 characters long.');
    }
  };

  return (
    <FarmerLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>⚙️</span>
            <span>Account & Security Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Manage your credentials, direct SMS mandi rate dispatch alerts, and password security
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-gray-200 gap-2">
          {[
            { label: 'Account Preferences', key: 'ACCOUNT', icon: Settings },
            { label: 'Notification Alerts', key: 'NOTIF', icon: Bell },
            { label: 'Security & Password', key: 'SECURITY', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
                  isActive
                    ? 'border-[#994200] text-[#994200]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Account */}
        {activeTab === 'ACCOUNT' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-5 text-xs">
            <h3 className="text-sm font-bold text-gray-900">APMC Trader & Farmer Account</h3>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-gray-600 block mb-1">Registered Kisan UID</label>
                <input
                  type="text"
                  disabled
                  value="KK-FARMER-UP-226203"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-600 block mb-1">Primary Email</label>
                <input
                  type="text"
                  disabled
                  value={profile.email}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700"
                />
              </div>

              <div>
                <label className="font-bold text-gray-600 block mb-1">Default Mandi Trading Floor</label>
                <input
                  type="text"
                  disabled
                  value="Lucknow APMC Market Committee (Bakshi Ka Talab Zone 4)"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Notification Alerts */}
        {activeTab === 'NOTIF' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-5 text-xs">
            <h3 className="text-sm font-bold text-gray-900">Mandi Communication Alerts</h3>

            <div className="divide-y divide-gray-100">
              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-bold text-gray-900">New Order Contracts</p>
                  <p className="text-gray-500 text-[11px]">Receive instant app notifications when a commercial buyer locks a lot.</p>
                </div>
                <input
                  type="checkbox"
                  checked={orderAlerts}
                  onChange={(e) => setOrderAlerts(e.target.checked)}
                  className="h-4 w-4 text-[#994200] rounded focus:ring-0"
                />
              </label>

              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-bold text-gray-900">Instant UPI Payout Confirmations</p>
                  <p className="text-gray-500 text-[11px]">SMS and in-app alerts when ICICI escrow dispatches funds to bank.</p>
                </div>
                <input
                  type="checkbox"
                  checked={payoutAlerts}
                  onChange={(e) => setPayoutAlerts(e.target.checked)}
                  className="h-4 w-4 text-[#994200] rounded focus:ring-0"
                />
              </label>

              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-bold text-gray-900">Low Stock Early Warning</p>
                  <p className="text-gray-500 text-[11px]">Automated alert when available quantity drops below minimum threshold.</p>
                </div>
                <input
                  type="checkbox"
                  checked={lowStockAlerts}
                  onChange={(e) => setLowStockAlerts(e.target.checked)}
                  className="h-4 w-4 text-[#994200] rounded focus:ring-0"
                />
              </label>

              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-bold text-gray-900">Daily APMC Price Trend Digest</p>
                  <p className="text-gray-500 text-[11px]">Morning summary of tomato, potato, and wheat rates in UP mandis.</p>
                </div>
                <input
                  type="checkbox"
                  checked={mandiRateAlerts}
                  onChange={(e) => setMandiRateAlerts(e.target.checked)}
                  className="h-4 w-4 text-[#994200] rounded focus:ring-0"
                />
              </label>
            </div>
          </div>
        )}

        {/* Tab 3: Security & Password */}
        {activeTab === 'SECURITY' && (
          <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-gray-900">Update Password</h3>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currPassword}
                onChange={(e) => setCurrPassword(e.target.value)}
                className="w-full px-3.5 py-2 font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">New Password (Min 6 characters)</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {passwordSaved && (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="h-4 w-4" /> Password updated successfully!
                </span>
              )}
              <Button
                type="submit"
                className="ml-auto bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold rounded-xl"
              >
                Update Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </FarmerLayout>
  );
}
