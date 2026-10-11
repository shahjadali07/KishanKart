'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Farmer } from '@/types/admin';
import { adminService } from '@/services/adminService';
import { CheckCircle2, XCircle, ArrowUpRight, ShieldCheck, MapPin, Phone, Eye } from 'lucide-react';

interface PendingFarmerApprovalsProps {
  initialFarmers: Farmer[];
  onUpdate?: () => void;
}

export function PendingFarmerApprovals({ initialFarmers, onUpdate }: PendingFarmerApprovalsProps) {
  const [farmers, setFarmers] = useState<Farmer[]>(initialFarmers);
  const [rejectModalFarmer, setRejectModalFarmer] = useState<Farmer | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = async (id: string, name: string) => {
    const success = await adminService.updateFarmerStatus(id, 'APPROVED');
    if (success) {
      setFarmers(prev => prev.filter(f => f.id !== id));
      showToast(`Farmer "${name}" successfully approved & onboarded to Mandi Floor!`);
      onUpdate?.();
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModalFarmer) return;
    const success = await adminService.updateFarmerStatus(rejectModalFarmer.id, 'REJECTED', rejectReason);
    if (success) {
      setFarmers(prev => prev.filter(f => f.id !== rejectModalFarmer.id));
      showToast(`Farmer "${rejectModalFarmer.name}" application rejected.`);
      setRejectModalFarmer(null);
      setRejectReason('');
      onUpdate?.();
    }
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-30 px-3.5 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 leading-tight flex items-center gap-2">
            Pending Farmer Onboarding Approvals
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {farmers.length} Pending
            </span>
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Verify Khasra/Khatauni land records & bank details before granting mandi floor bidding
          </p>
        </div>

        <Link
          href="/admin/farmers/pending"
          className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 shrink-0"
        >
          <span>View All ({farmers.length})</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Table / List */}
      {farmers.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          🎉 All farmer registrations & KYC submissions are up to date!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] font-bold">
                <th className="pb-3 font-bold">Farmer</th>
                <th className="pb-3 font-bold">Location</th>
                <th className="pb-3 font-bold">Phone</th>
                <th className="pb-3 font-bold">Reg. Date</th>
                <th className="pb-3 font-bold">KYC Status</th>
                <th className="pb-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {farmers.slice(0, 5).map((farmer) => (
                <tr key={farmer.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="py-3 pr-2">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-300">
                        {farmer.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block leading-tight">{farmer.name}</span>
                        <span className="text-[10px] text-gray-400">{farmer.farmSize} • {farmer.crops.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-2 text-gray-600 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                      {farmer.district}, {farmer.state}
                    </span>
                  </td>

                  <td className="py-3 px-2 font-mono text-gray-600">
                    +91 {farmer.phone}
                  </td>

                  <td className="py-3 px-2 text-gray-500 font-medium">
                    {farmer.registeredDate}
                  </td>

                  <td className="py-3 px-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      <ShieldCheck className="h-3 w-3" />
                      {farmer.kycStatus}
                    </span>
                  </td>

                  <td className="py-3 pl-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/farmers/${farmer.id}`}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        title="View Full Profile & Documents"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        onClick={() => handleApprove(farmer.id, farmer.name)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => setRejectModalFarmer(farmer)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-[11px] transition-colors flex items-center gap-1"
                      >
                        <XCircle className="h-3 w-3" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {rejectModalFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 space-y-4">
            <h4 className="text-base font-bold text-gray-900">
              Reject Registration for &ldquo;{rejectModalFarmer.name}&rdquo;?
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Please specify the rejection or deficiency reason. The farmer will be notified via SMS and prompted to re-upload documents.
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Land registration deed blurred; please re-upload clear 7/12 extract."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalFarmer(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
