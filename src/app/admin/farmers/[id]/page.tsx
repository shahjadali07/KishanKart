'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { Farmer } from '@/types/admin';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Landmark,
  Package,
  ShoppingCart,
  IndianRupee,
  FileText
} from 'lucide-react';

function FarmerDetailContent() {
  const router = useRouter();
  const params = useParams();
  const farmerId = params?.id as string;
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadFarmer = async () => {
    if (!farmerId) return;
    setIsLoading(true);
    const data = await adminService.getFarmerById(farmerId);
    if (data) setFarmer(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadFarmer();
  }, [farmerId]);

  const handleApprove = async () => {
    if (!farmer) return;
    await adminService.updateFarmerStatus(farmer.id, 'APPROVED');
    showToast(`Farmer ${farmer.name} approved!`);
    loadFarmer();
  };

  const handleReject = async () => {
    if (!farmer) return;
    await adminService.updateFarmerStatus(farmer.id, 'REJECTED', 'Documents failed verification');
    showToast(`Farmer ${farmer.name} rejected.`);
    loadFarmer();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
          Loading farmer record...
        </div>
      </AdminLayout>
    );
  }

  if (!farmer) {
    return (
      <AdminLayout>
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-3">
          <p className="text-sm font-bold text-gray-800">Farmer record not found.</p>
          <Link href="/admin/farmers" className="text-xs text-amber-800 font-bold hover:underline">
            ← Return to Farmer Directory
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold shadow-xl animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
            <span>{toast}</span>
          </div>
        )}

        {/* Back navigation */}
        <Link
          href="/admin/farmers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Farmer Directory</span>
        </Link>

        {/* Farmer Header Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-amber-100 text-amber-900 font-black text-xl flex items-center justify-center shrink-0 border border-amber-300 shadow-2xs">
              {farmer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {farmer.name}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                  farmer.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : farmer.status === 'BLOCKED'
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {farmer.status}
                </span>
                <span className="text-xs font-mono text-gray-400">ID: {farmer.id}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Registered on {farmer.registeredDate} • Farm Size: <strong className="text-gray-700">{farmer.farmSize}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {farmer.status !== 'APPROVED' && (
              <button
                onClick={handleApprove}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Approve Account</span>
              </button>
            )}
            {farmer.status !== 'REJECTED' && (
              <button
                onClick={handleReject}
                className="px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                <span>Reject / Flag</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Metrics Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Sales Volume</span>
            <span className="text-xl font-black text-[#994200]">₹{farmer.totalSales.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-gray-400 block mt-0.5">100% Escrow disbursed</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Fulfilled Orders</span>
            <span className="text-xl font-bold text-gray-900">{farmer.ordersCount} Contracts</span>
            <span className="text-[11px] text-emerald-700 block mt-0.5">Zero mandi disputes</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Active Produce Lots</span>
            <span className="text-xl font-bold text-gray-900">{farmer.productsCount} Lots</span>
            <span className="text-[11px] text-gray-400 block mt-0.5">{farmer.crops.join(', ')}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">KYC & Compliance</span>
            <span className="text-xl font-bold text-amber-900">{farmer.kycStatus}</span>
            <span className="text-[11px] text-gray-400 block mt-0.5">e-NAM Mandi Parishad</span>
          </div>
        </div>

        {/* 2 Columns: Contact & Location / KYC & Banking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Contact & Location */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
              Farm-Gate & Contact Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[10px]">Mobile Number (WhatsApp linked)</span>
                  <span className="font-bold text-gray-900 font-mono">+91 {farmer.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[10px]">Email Address</span>
                  <span className="font-semibold text-gray-900">{farmer.email || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-[10px]">Farm-Gate Location & Weighbridge Belt</span>
                  <span className="font-semibold text-gray-900 block">{farmer.location}</span>
                  <span className="text-[11px] text-gray-500">Village: {farmer.village} • District: {farmer.district} • State: {farmer.state}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Banking & KYC Documents */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
              Verified Banking & Digital KYC Credentials
            </h3>

            {farmer.bankDetails && (
              <div className="p-3 bg-[#FDFBF7] rounded-xl border border-amber-200/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-gray-900">
                  <span>{farmer.bankDetails.bankName}</span>
                  <span className="text-emerald-700 font-mono text-[11px]">Primary A/C</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                  <span>A/C: <strong className="font-mono text-gray-900">{farmer.bankDetails.accountNumber}</strong></span>
                  <span>IFSC: <strong className="font-mono text-gray-900">{farmer.bankDetails.ifsc}</strong></span>
                  <span className="col-span-2">UPI VPA: <strong className="font-mono text-amber-900">{farmer.bankDetails.upiId}</strong></span>
                </div>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Submitted Documents
              </span>
              {farmer.kycDocuments && farmer.kycDocuments.length > 0 ? (
                farmer.kycDocuments.map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-amber-800" />
                      <div>
                        <span className="font-bold text-gray-900 block leading-tight">{doc.type}</span>
                        <span className="text-[10px] font-mono text-gray-500">{doc.documentNumber}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-xs">No extra documents submitted.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function FarmerDetailPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
            Loading farmer producer profile...
          </div>
        </AdminLayout>
      }
    >
      <FarmerDetailContent />
    </Suspense>
  );
}
