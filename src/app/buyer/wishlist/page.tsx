'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { useBuyer } from '@/context/BuyerContext';
import { ProductCard } from '@/components/buyer/ProductCard';
import { EmptyState } from '@/components/buyer/EmptyState';
import { Heart, Sparkles, ShoppingBag } from 'lucide-react';

export default function BuyerWishlistPage() {
  const router = useRouter();
  const { wishlistProducts, wishlistCount } = useBuyer();

  return (
    <BuyerLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Saved Produce Wishlist ({wishlistCount})
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Keep track of recurring crop harvests and monitor farmgate price movements
            </p>
          </div>

          <Link
            href="/buyer/products"
            className="text-xs font-bold text-[#994200] hover:text-[#7A3400] transition self-start sm:self-auto"
          >
            Browse More Crops →
          </Link>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {wishlistProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="Your wishlist is waiting for something fresh 🌱"
            description="Bookmark seasonal crop lots from top-rated farmers to quickly purchase when harvest lots arrive."
            actionText="Explore Products"
            actionHref="/buyer/products"
          />
        )}
      </div>
    </BuyerLayout>
  );
}
