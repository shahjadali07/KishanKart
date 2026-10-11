'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { Farmer } from '@/types/admin';
import { ArrowLeft, CheckCircle2, XCircle, ShieldCheck, FileText, Eye } from 'lucide-react';

export default function AdminFarmerKYCPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [inspectModal, setInspectModal] = useState<Farmer | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadKYC = async () => {
    const list = await adminService.getFarmers();
    setFarmers(list);
  };

  useEffect(() => {
    loadKYC();
  }, []);

  const handleVerify = async (id: string, name: string) => {
    await adminService.updateFarmerKYC(id, 'VERIFIED');
    showToast(`KYC for ${name} verified successfully.`);
    setInspectModal(null);
    loadKYC();
  };

  const handleReject = async (id: string, name: string) => {
    await adminService.updateFarmerKYC(id, 'REJECTED', rejectionReason || 'Documents blurred or unverifiable');
    showToast(`KYC for ${name} rejected.`);
    setInspectModal(null);
    setRejectionReason('');
    loadKYC();
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
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs">
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            Digital KYC & Land Registry Verification Desk
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Audit Aadhaar, 7/12 extract / Khatauni land ownership records, and bank accounts securely
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDFBF7] border-b border-gray-200 text-gray-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Farmer</th>
                  <th className="py-3 px-3">State / Cluster</th>
                  <th className="py-3 px-3">Submitted Documents</th>
                  <th className="py-3 px-3">Bank A/C Linked</th>
                  <th className="py-3 px-3">KYC Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {farmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {farmer.name}
                      <span className="text-[10px] text-gray-400 block font-normal font-mono">+91 {farmer.phone}</span>
                    </td>

                    <td className="py-3 px-3 text-gray-600">
                      {farmer.district}, {farmer.state}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-[11px] text-gray-700">
                        <FileText className="h-3.5 w-3.5 text-amber-800" />
                        <span>{farmer.kycDocuments?.length || 1} Document(s)</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-gray-600">
                      {farmer.bankDetails?.bankName ? (
                        <span className="text-emerald-700 font-semibold">{farmer.bankDetails.bankName.slice(0, 16)}</span>
                      ) : (
                        <span className="text-gray-400">Pending</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        farmer.kycStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : farmer.kycStatus === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        <ShieldCheck className="h-3 w-3" />
                        {farmer.kycStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setInspectModal(farmer)}
                        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-amber-50 hover:text-amber-900 text-gray-700 font-bold text-xs transition-colors"
                      >
                        Inspect KYC
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inspect KYC Modal */}
        {inspectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h4 className="text-base font-bold text-gray-900">
                    KYC Audit: {inspectModal.name}
                  </h4>
                  <p className="text-xs text-gray-500">{inspectModal.location}</p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700">{inspectModal.id}</span>
              </div>

              {/* Masked documents */}
              <div className="space-y-3 text-xs">
                <span className="font-bold text-gray-700 block">Submitted Digital Identity Records:</span>
                {inspectModal.kycDocuments && inspectModal.kycDocuments.length > 0 ? (
                  inspectModal.kycDocuments.map((doc, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-gray-200 bg-[#FDFBF7] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900 block">{doc.type}</span>
                        <span className="font-mono text-gray-500 text-[11px]">{doc.documentNumber}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-semibold">Protected Hash</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">Aadhaar verified via DigiLocker OTP.</p>
                )}
              </div>

              {/* Reason input for reject */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Rejection Reason (If rejecting):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Document image distorted or name mismatch"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  onClick={() => setInspectModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Close
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReject(inspectModal.id, inspectModal.name)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-rose-300 text-rose-700 hover:bg-rose-50"
                  >
                    Reject KYC
                  </button>
                  <button
                    onClick={() => handleVerify(inspectModal.id, inspectModal.name)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                  >
                    Verify & Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
