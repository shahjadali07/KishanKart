'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { Product } from '@/types/admin';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

export default function PendingProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadPending = async () => {
    const list = await adminService.getProducts({ status: 'PENDING' });
    setProducts(list);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (id: string, title: string) => {
    await adminService.updateProductStatus(id, 'APPROVED');
    showToast(`Product "${title}" approved for live mandi trading.`);
    loadPending();
  };

  const handleReject = async (id: string, title: string) => {
    await adminService.updateProductStatus(id, 'REJECTED');
    showToast(`Product "${title}" rejected.`);
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
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Products Directory</span>
          </Link>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            {products.length} Produce Lots Awaiting Moderation
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs">
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            Pending Produce Approvals Queue
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Audit farmer quality certifications and mandi benchmark asking rates before lots go live
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          {products.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">
              🎉 All farmer produce lots have been approved and published to the floor!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] border-b border-gray-200 text-gray-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Produce Title</th>
                    <th className="py-3 px-3">Farmer & Belt</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Asking Rate</th>
                    <th className="py-3 px-3">Batch Stock</th>
                    <th className="py-3 px-3">Grade</th>
                    <th className="py-3 px-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-900">
                        {prod.title}
                        <span className="text-[10px] text-gray-400 block font-normal">Listed on {prod.createdAt}</span>
                      </td>

                      <td className="py-3 px-3 text-gray-700">
                        <span className="font-semibold block">{prod.farmerName}</span>
                        <span className="text-[10px] text-gray-400">{prod.farmerLocation}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                          {prod.category}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-extrabold text-[#994200]">
                        ₹{prod.price} <span className="text-gray-400 font-normal">/ {prod.unit}</span>
                      </td>

                      <td className="py-3 px-3 font-semibold text-gray-900">
                        {prod.stock} {prod.unit}
                      </td>

                      <td className="py-3 px-3 text-gray-600 font-medium">
                        {prod.grade}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(prod.id, prod.title)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                          >
                            Publish Lot
                          </button>
                          <button
                            onClick={() => handleReject(prod.id, prod.title)}
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
