'use client';

import React, { useState } from 'react';
import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { useAuth } from '@/context/AuthContext';
import { useBuyer } from '@/context/BuyerContext';
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Package,
  Heart,
  Star,
  Edit2,
  Key,
  X
} from 'lucide-react';

export default function BuyerProfilePage() {
  const { user } = useAuth();
  const { orders, wishlistCount } = useBuyer();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit form state
  const [buyerName, setBuyerName] = useState(user?.name || 'Sharma Foods Ltd.');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || 'procurement@sharmafoods.in');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '+91 98765 43210');
  const [buyerLocation, setBuyerLocation] = useState(user?.location || 'Bakshi Ka Talab Mandi Cluster, Lucknow');
  const [gstNumber, setGstNumber] = useState('09AAACS1429B1ZU');
  const [fssaiLicense, setFssaiLicense] = useState('12722055000142');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const completedOrdersCount = orders.filter((o) => o.status === 'Delivered').length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setEditModalOpen(false);
    showToast('Buyer profile details updated successfully!');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordModalOpen(false);
    showToast('Account security password updated!');
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
            Wholesale Buyer Profile & Mandi Registration
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Verified corporate entity credentials, statutory GSTIN, and trading metrics
          </p>
        </div>

        {/* Hero Profile Card */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-2xl font-black flex items-center justify-center shrink-0 shadow-md">
                {buyerName.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                    {buyerName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Enterprise Buyer
                  </span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  {buyerLocation}
                </p>
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Member since September 2025 (FY 2025-26)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-col gap-2">
              <button
                onClick={() => setEditModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-[#994200] border border-amber-200 text-xs font-bold rounded-xl transition shadow-2xs"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit Profile
              </button>
              <button
                onClick={() => setPasswordModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl transition"
              >
                <Key className="h-3.5 w-3.5" />
                Security Password
              </button>
            </div>
          </div>

          {/* 4 Statistics Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-gray-100">
            <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-medium">Total Orders</p>
              <p className="text-xl font-black text-gray-900 mt-0.5">{orders.length}</p>
            </div>
            <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-medium">Delivered Lots</p>
              <p className="text-xl font-black text-emerald-700 mt-0.5">{completedOrdersCount}</p>
            </div>
            <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-medium">Wishlist Saved</p>
              <p className="text-xl font-black text-red-600 mt-0.5">{wishlistCount}</p>
            </div>
            <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-medium">Mandi Reputation</p>
              <p className="text-xl font-black text-amber-800 mt-0.5">4.9 ★</p>
            </div>
          </div>
        </div>

        {/* Detailed Information Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Details */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
              Procurement Officer Contact
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[10px]">Official Email</span>
                  <span className="font-bold text-gray-900">{buyerEmail}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[10px]">Mobile Number (OTP Enabled)</span>
                  <span className="font-bold text-gray-900">{buyerPhone}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[10px]">Trading Entity</span>
                  <span className="font-bold text-gray-900">Food Processing & Wholesale Retailer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Certifications */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
              Statutory Taxes & Licenses
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold">Goods & Services Tax (GSTIN)</span>
                  <span className="font-mono font-bold text-gray-900">{gstNumber}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold">FSSAI Food Safety License</span>
                  <span className="font-mono font-bold text-gray-900">{fssaiLicense}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Edit Profile */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900">Edit Buyer Profile</h3>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Company / Buyer Name</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Hub Location</label>
                  <input
                    type="text"
                    required
                    value={buyerLocation}
                    onChange={(e) => setBuyerLocation(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 border rounded-xl text-gray-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#994200] text-white rounded-xl font-bold shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Change Password */}
        {passwordModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900">Change Account Password</h3>
                <button
                  onClick={() => setPasswordModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 8 characters"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPasswordModalOpen(false)}
                    className="px-4 py-2 border rounded-xl text-gray-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#994200] text-white rounded-xl font-bold shadow-xs"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </BuyerLayout>
  );
}
