'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminService } from '@/services/adminService';
import { CategoryItem, ProductCategory } from '@/types/admin';
import {
  ArrowLeft,
  Plus,
  CheckCircle2,
  Trash2,
  Power,
  Tag,
  Sprout
} from 'lucide-react';

export default function AdminProductCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState<ProductCategory>('Vegetables');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadCategories = async () => {
    const list = await adminService.getCategories();
    setCategories(list);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleToggle = async (id: string, name: string) => {
    await adminService.toggleCategoryStatus(id);
    showToast(`Category "${name}" status toggled.`);
    loadCategories();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete category "${name}"?`)) {
      await adminService.deleteCategory(id);
      showToast(`Category "${name}" deleted.`);
      loadCategories();
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatDesc) return;
    await adminService.addCategory(newCatName, newCatDesc);
    showToast(`New category "${newCatName}" created.`);
    setShowAddModal(false);
    setNewCatDesc('');
    loadCategories();
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
            <span>Back to Products</span>
          </Link>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#994200] hover:bg-[#7A3400] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Category</span>
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs">
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            Agricultural Commodity Categories
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Configure APMC produce taxonomy, quality standard rules, and active bidding segments
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                cat.active
                  ? 'bg-white border-gray-200 shadow-2xs hover:border-amber-300'
                  : 'bg-gray-50 border-gray-200/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold border border-amber-300">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    cat.active ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {cat.active ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-gray-900 leading-tight">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 leading-normal line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700">
                  {cat.itemCount} Live Lots
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggle(cat.id, cat.name)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-amber-900 hover:bg-gray-100 transition-colors"
                    title={cat.active ? 'Disable Category' : 'Enable Category'}
                  >
                    <Power className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Category Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 space-y-4">
              <h4 className="text-base font-bold text-gray-900">
                Add Agricultural Category
              </h4>

              <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category Type</label>
                  <select
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value as ProductCategory)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl"
                  >
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
                  <label className="block font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe standard produce included in this segment..."
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    required
                    className="w-full p-2.5 border border-gray-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl font-bold bg-[#994200] hover:bg-[#7A3400] text-white shadow-2xs"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
