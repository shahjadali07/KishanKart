'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { useBuyer } from '@/context/BuyerContext';
import { ProductCard } from '@/components/buyer/ProductCard';
import { EmptyState } from '@/components/buyer/EmptyState';
import { mockCategories } from '@/data/buyerMockData';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

function BrowseProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';

  const { products } = useBuyer();

  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('popular');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchFarmer = p.farmer.toLowerCase().includes(q);
        const matchLoc = p.location.toLowerCase().includes(q);
        const matchHindi = p.hindiName?.toLowerCase().includes(q);
        if (!matchName && !matchFarmer && !matchLoc && !matchHindi) {
          return false;
        }
      }
      // In stock
      if (inStockOnly && p.stock <= 0) {
        return false;
      }
      // Organic
      if (organicOnly && !p.isOrganic) {
        return false;
      }
      // Price
      if (p.price > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'price-asc') return a.price - b.price;
      if (selectedSort === 'price-desc') return b.price - a.price;
      if (selectedSort === 'rating') return b.rating - a.rating;
      if (selectedSort === 'newest') return b.id.localeCompare(a.id);
      return b.reviewsCount - a.reviewsCount; // popular
    });
  }, [products, selectedCategory, search, inStockOnly, organicOnly, maxPrice, selectedSort]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setInStockOnly(false);
    setOrganicOnly(false);
    setMaxPrice(1500);
    setSelectedSort('popular');
  };

  const hasActiveFilters =
    selectedCategory !== 'ALL' ||
    inStockOnly ||
    organicOnly ||
    maxPrice < 1500 ||
    search.trim() !== '';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Browse Farm Produce Catalog
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Verified agricultural commodities, direct from regional farmers with verified mandi gate passes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search produce, farmer, mandi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#994200] outline-none shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Filter and Sort Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-[#994200] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Produce ({products.length})
          </button>
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat.name
                  ? 'bg-[#994200] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Secondary Filters & Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* In Stock toggle */}
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-[#994200] rounded"
            />
            In Stock Only
          </label>

          {/* Organic toggle */}
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              className="accent-emerald-600 rounded"
            />
            Organic Certified
          </label>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-400 font-medium">Sort:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-800 outline-none focus:ring-1 focus:ring-[#994200]"
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Harvest</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <X className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Product Results Grid */}
      {displayedProducts.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination / Load More */}
          {visibleCount < filteredProducts.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="px-6 py-2.5 bg-white hover:bg-amber-50 border border-amber-200 text-[#994200] font-bold text-xs rounded-xl shadow-2xs hover:shadow-xs transition active:scale-95"
              >
                Load More Produce ({filteredProducts.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="No Matching Produce Lots Found"
          description="Try broadening your category filters, search terms, or resetting price thresholds."
          actionText="Clear All Filters"
          onActionClick={clearAllFilters}
        />
      )}
    </div>
  );
}

export default function BrowseProductsPage() {
  return (
    <BuyerLayout>
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
            Loading farm produce catalog...
          </div>
        }
      >
        <BrowseProductsContent />
      </Suspense>
    </BuyerLayout>
  );
}
