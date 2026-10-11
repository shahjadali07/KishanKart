'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BuyerProduct } from '@/types/buyer';
import { useBuyer } from '@/context/BuyerContext';
import {
  Heart,
  ShoppingCart,
  Star,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  Plus
} from 'lucide-react';

interface ProductCardProps {
  product: BuyerProduct;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useBuyer();
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, product.minOrderQty || 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, product.minOrderQty || 1);
    router.push('/buyer/checkout');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-xs">
      {/* Top Media & Badges */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <Link href={`/buyer/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Category & Organic Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-stone-800 shadow-xs border border-white/60 backdrop-blur-md">
            {product.category}
          </span>
          {product.isOrganic && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/90 text-white shadow-xs border border-emerald-500/40 backdrop-blur-md flex items-center gap-1">
              <Leaf className="h-2.5 w-2.5" />
              Organic
            </span>
          )}
        </div>

        {/* Rating Floating Tag */}
        <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/20 shadow-xs">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-white/70 font-normal">({product.reviewsCount})</span>
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full shadow-xs transition-all active:scale-90 z-10 backdrop-blur-md border border-white/50 ${
            isFavorited
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20 shadow-sm'
              : 'bg-white/90 text-stone-600 hover:text-red-500 hover:bg-white'
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="px-3.5 py-1.5 bg-red-600 text-white text-[11px] font-black rounded-full shadow-lg uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Farmer & Location */}
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span className="font-semibold text-stone-700 truncate max-w-[130px] flex items-center gap-1">
              <span className="h-4 w-4 rounded-full bg-amber-100 text-[#8C3A00] font-bold text-[9px] flex items-center justify-center shrink-0">
                {product.farmer.charAt(0)}
              </span>
              <span className="truncate">{product.farmer}</span>
            </span>
            <span className="flex items-center gap-1 text-stone-500 truncate max-w-[120px]">
              <MapPin className="h-3 w-3 text-amber-600 shrink-0" />
              <span>{product.location}</span>
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/buyer/products/${product.id}`} className="block group-hover:text-[#994200] transition-colors">
            <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-1">
              {product.name}
            </h3>
            {product.hindiName && (
              <p className="text-[11px] text-stone-400 font-normal truncate mt-0.5">
                {product.hindiName}
              </p>
            )}
          </Link>

          {/* Stock status pill */}
          <div className="pt-1 flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                product.stock < 50
                  ? 'text-amber-800 bg-amber-50 border border-amber-200/80'
                  : 'text-emerald-800 bg-emerald-50 border border-emerald-200/80'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${product.stock < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span>{isOutOfStock ? '0 in stock' : `${product.stock} ${product.unit} available`}</span>
            </span>

            {product.minOrderQty > 1 && (
              <span className="text-[10px] text-stone-400 font-medium">
                Min: {product.minOrderQty} {product.unit}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Order Actions */}
        <div className="pt-3 border-t border-stone-100 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-stone-900 tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-stone-500 font-medium">/{product.unit}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Farm-Direct
            </span>
          </div>

          {/* Action Buttons: Add to Cart + Buy Now */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`px-3 py-2.2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                justAdded
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isOutOfStock
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                  : 'bg-amber-50/90 text-[#8C3A00] hover:bg-amber-100/90 border border-amber-200/90 hover:border-amber-300 shadow-2xs active:scale-[0.98]'
              }`}
            >
              {justAdded ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>Add Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`px-3 py-2.2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isOutOfStock
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#994200] to-[#803300] hover:from-[#803300] hover:to-[#662900] text-white shadow-amber-900/15 hover:shadow-md hover:shadow-amber-900/25 active:scale-[0.98]'
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
