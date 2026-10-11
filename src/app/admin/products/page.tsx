'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { Product, ProductStatus } from '@/types/admin';
import {
  Search,
  Package,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  Filter,
  Tag
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadProducts = async () => {
    const list = await adminService.getProducts({
      search: searchTerm,
      category: categoryFilter,
      status: statusFilter,
    });
    setProducts(list);
  };

  useEffect(() => {
    loadProducts();
  }, [searchTerm, categoryFilter, statusFilter]);

  const handleApprove = async (id: string, title: string) => {
    await adminService.updateProductStatus(id, 'APPROVED');
    showToast(`Product "${title}" approved for live mandi trading.`);
    loadProducts();
  };

  const handleReject = async (id: string, title: string) => {
    await adminService.updateProductStatus(id, 'REJECTED');
    showToast(`Product "${title}" rejected.`);
    loadProducts();
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Remove product listing "${title}"?`)) {
      await adminService.deleteProduct(id);
      showToast(`Product "${title}" deleted.`);
      loadProducts();
    }
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

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              Produce Lot Listings & Inventory
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Review quality grading, asking rates, and farm stock across categories
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/products/pending"
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-colors"
            >
              <span>Pending Approvals</span>
            </Link>
            <Link
              href="/admin/products/categories"
              className="px-3 py-1.5 rounded-xl bg-[#994200] hover:bg-[#7A3400] text-white font-bold text-xs transition-colors shadow-2xs"
            >
              <span>Manage Categories</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by produce title or farmer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 focus:bg-white"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-amber-600 focus:bg-white"
            >
              <option value="ALL">All Produce Categories</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Grains">Grains</option>
              <option value="Pulses">Pulses</option>
              <option value="Spices">Spices</option>
              <option value="Dairy">Dairy</option>
              <option value="Organic Products">Organic Products</option>
              <option value="Seeds">Seeds</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-amber-600 focus:bg-white"
            >
              <option value="ALL">All Lot Statuses</option>
              <option value="APPROVED">Live on Mandi Floor</option>
              <option value="PENDING">Pending Review</option>
              <option value="OUT_OF_STOCK">Stock Depleted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDFBF7] border-b border-gray-200 text-gray-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Produce Title</th>
                  <th className="py-3 px-3">Farmer & Belt</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Asking Rate</th>
                  <th className="py-3 px-3">Available Stock</th>
                  <th className="py-3 px-3">Grade</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {prod.title}
                      <span className="text-[10px] text-gray-400 block font-mono font-normal">ID: {prod.id} • Listed: {prod.createdAt}</span>
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

                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        prod.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-800'
                          : prod.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {prod.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {prod.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => handleApprove(prod.id, prod.title)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(prod.id, prod.title)}
                              className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-[11px]"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleDelete(prod.id, prod.title)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove Product"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
