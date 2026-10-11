'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { useBuyer } from '@/context/BuyerContext';
import { ProductCard } from '@/components/buyer/ProductCard';
import { EmptyState } from '@/components/buyer/EmptyState';
import {
  Search,
  SlidersHorizontal,
  X,
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { products, setSearchQuery } = useBuyer();
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
  };

  const results = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return products;

    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchHindi = p.hindiName?.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchFarmer = p.farmer.toLowerCase().includes(q);
      const matchLoc = p.location.toLowerCase().includes(q);
      const matchMandi = p.mandi.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);

      const matchesText =
        matchName ||
        matchHindi ||
        matchCat ||
        matchFarmer ||
        matchLoc ||
        matchMandi ||
        matchDesc;

      const matchesCategory =
        selectedCategory === 'ALL' || p.category === selectedCategory;

      return matchesText && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search Header */}
      <div className="space-y-4 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            href="/buyer/products"
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Marketplace Search Results
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Showing matching agricultural produce lots across all verified mandis
            </p>
          </div>
        </div>

        {/* Search input field */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search produce name, farmer, mandi location, or variety..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-24 py-3 bg-white border border-gray-300 rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#994200]/20 focus:border-[#994200] outline-none shadow-2xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results Header & Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-gray-600">
          Found <strong className="text-gray-900">{results.length}</strong> matching lot(s){' '}
          {searchTerm ? (
            <>
              for &ldquo;<strong className="text-[#994200]">{searchTerm}</strong>&rdquo;
            </>
          ) : null}
        </p>

        {/* Category filtering */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {['ALL', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#994200] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Results */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="No Produce Lots Found"
          description={`We couldn't find any results matching "${searchTerm}". Try checking for spelling mistakes or searching for broader terms like "Wheat", "Tomato", or "Lucknow".`}
          actionText="Clear Search Query"
          onActionClick={() => {
            setSearchTerm('');
            setSelectedCategory('ALL');
          }}
        />
      )}
    </div>
  );
}

export default function BuyerSearchPage() {
  return (
    <BuyerLayout>
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
            Searching agricultural commodities...
          </div>
        }
      >
        <SearchResultsContent />
      </Suspense>
    </BuyerLayout>
  );
}
