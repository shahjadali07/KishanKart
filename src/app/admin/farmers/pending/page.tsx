'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { Farmer } from '@/types/admin';
import { ArrowLeft, CheckCircle2, XCircle, ShieldCheck, MapPin, Phone, Eye } from 'lucide-react';

export default function PendingFarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadPending = async () => {
    const list = await adminService.getFarmers({ status: 'PENDING' });
    setFarmers(list);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (id: string, name: string) => {
    await adminService.updateFarmerStatus(id, 'APPROVED');
    showToast(`Farmer "${name}" approved successfully.`);
    loadPending();
  };

  const handleReject = async (id: string, name: string) => {
    await adminService.updateFarmerStatus(id, 'REJECTED', 'Documents failed verification.');
    showToast(`Farmer "${name}" rejected.`);
    loadPending();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {toast && (
          <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold shadow-xl animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
            <span>{toast}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link
            href="/admin/farmers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Farmer Directory</span>
          </Link>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            {farmers.length} Applications Awaiting Review
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs">
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            Pending Farmer Approvals Queue
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Review submitted Khasra/Khatauni land records, Bank A/C details, and Aadhaar before clearing for live trading
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          {farmers.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">
              🎉 No pending farmer approvals found in queue!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] border-b border-gray-200 text-gray-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Farmer</th>
                    <th className="py-3 px-3">Location & Farm</th>
                    <th className="py-3 px-3">Phone</th>
                    <th className="py-3 px-3">Submission Date</th>
                    <th className="py-3 px-3">KYC State</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {farmers.map((farmer) => (
                    <tr key={farmer.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block leading-tight">{farmer.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{farmer.id}</span>
                      </td>

                      <td className="py-3 px-3 text-gray-600">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          {farmer.district}, {farmer.state}
                        </span>
                        <span className="text-[10px] text-gray-400 block">{farmer.village} ({farmer.farmSize})</span>
                      </td>

                      <td className="py-3 px-3 font-mono text-gray-600">
                        +91 {farmer.phone}
                      </td>

                      <td className="py-3 px-3 text-gray-500 font-medium">
                        {farmer.registeredDate}
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          {farmer.kycStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/farmers/${farmer.id}`}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            title="Inspect Documents"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>

                          <button
                            onClick={() => handleApprove(farmer.id, farmer.name)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => handleReject(farmer.id, farmer.name)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-[11px]"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
