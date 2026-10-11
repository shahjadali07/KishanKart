'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFarmer } from '@/context/FarmerContext';
import { FarmerLayout } from '@/components/farmer/FarmerLayout';
import { FarmerProduct, FarmerProductCategory, FarmerProductStatus } from '@/types/farmer';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FarmerProductsPage() {
  const router = useRouter();
  const { products, deleteProduct } = useFarmer();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NAME' | 'PRICE_ASC' | 'PRICE_DESC' | 'STOCK'>('NAME');
  const [deleteCandidate, setDeleteCandidate] = useState<FarmerProduct | null>(null);

  const categories: FarmerProductCategory[] = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Pulses',
    'Spices',
    'Dairy',
    'Organic',
    'Seasonal Crops'
  ];

  const statuses: FarmerProductStatus[] = [
    'Active',
    'Inactive',
    'Out of Stock',
    'Pending Approval'
  ];

  // Filtering & Sorting
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.hindiName && p.hindiName.includes(search)) ||
      p.location.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;

    return matchesSearch && matchesCat && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'PRICE_ASC') return a.price - b.price;
    if (sortBy === 'PRICE_DESC') return b.price - a.price;
    if (sortBy === 'STOCK') return b.availableQuantity - a.availableQuantity;
    return a.name.localeCompare(b.name);
  });

  const handleDelete = () => {
    if (deleteCandidate) {
      deleteProduct(deleteCandidate.id);
      setDeleteCandidate(null);
    }
  };

  return (
    <FarmerLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>🌾</span>
              <span>My Listed Products</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Manage your agricultural crops, asking rates, mandi grades, and availability
            </p>
          </div>

          <Link
            href="/farmer/products/new"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>List New Product</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by crop, grade, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
              />
            </div>

            {/* Category Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
              >
                <option value="ALL">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="sm:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
              >
                <option value="NAME">Name (A-Z)</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
                <option value="STOCK">Highest Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid / Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/90 p-12 text-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 text-[#994200] flex items-center justify-center mx-auto text-2xl">
              🌾
            </div>
            <h3 className="text-base font-bold text-gray-900">No products found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try adjusting your category or status filters, or add a new agricultural harvest lot.
            </p>
            <Link
              href="/farmer/products/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#994200] text-white text-xs font-bold rounded-xl mt-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Your First Crop</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((p) => {
              const isLowStock = p.availableQuantity <= p.lowStockThreshold && p.status !== 'Out of Stock';
              const isOutOfStock = p.availableQuantity === 0 || p.status === 'Out of Stock';

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
                >
                  {/* Top Image + Badges */}
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <img
                      src={p.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800'}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#994200]/95 text-white uppercase tracking-wider shadow-xs backdrop-blur-md border border-amber-500/30">
                        {p.grade}
                      </span>
                      {p.isOrganic && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/95 text-white shadow-xs backdrop-blur-md border border-emerald-500/30">
                          Organic
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs backdrop-blur-md border ${
                          isOutOfStock
                            ? 'bg-red-600/95 text-white border-red-500/40'
                            : isLowStock
                            ? 'bg-amber-500/95 text-white border-amber-400/40'
                            : 'bg-emerald-600/95 text-white border-emerald-500/40'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#994200] transition-colors line-clamp-1">
                          {p.name}
                        </h3>
                        <span className="text-sm font-black text-[#994200] shrink-0 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/80">
                          ₹{p.price} <span className="text-[10px] font-normal text-stone-500">/ {p.unit}</span>
                        </span>
                      </div>
                      {p.hindiName && (
                        <p className="text-[11px] text-stone-400 font-medium">{p.hindiName}</p>
                      )}
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-stone-100 bg-stone-50/70 -mx-4 -mb-3 p-3 px-4 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider mb-0.5">Available Stock</span>
                        <span className={`font-extrabold ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-800' : 'text-stone-900'}`}>
                          {p.availableQuantity} {p.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider mb-0.5">Min Order Lot</span>
                        <span className="font-bold text-stone-700">
                          {p.minimumOrderQuantity} {p.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-3 bg-white border-t border-stone-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/farmer/products/${p.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-50 border border-stone-200 hover:border-amber-300 hover:bg-amber-50/60 rounded-xl text-xs font-bold text-stone-700 transition active:scale-[0.98]"
                    >
                      <Edit className="h-3.5 w-3.5 text-stone-500" />
                      <span>Edit Produce</span>
                    </Link>

                    <button
                      onClick={() => setDeleteCandidate(p)}
                      className="p-2 bg-stone-50 border border-stone-200 hover:border-red-300 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-xl transition active:scale-[0.98]"
                      title="Delete Product"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-gray-900">Delete Product?</h3>
              <p className="text-xs text-gray-500">
                Are you sure you want to remove <strong className="text-gray-800">{deleteCandidate.name}</strong> from the digital mandi? Active buyer inquiries may be affected.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <Button
                variant="outline"
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 text-xs h-9 rounded-xl border-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 text-xs h-9 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </FarmerLayout>
  );
}
