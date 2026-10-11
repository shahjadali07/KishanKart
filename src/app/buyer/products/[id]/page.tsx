'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { BuyerLayout } from '@/components/buyer/BuyerLayout';
import { useBuyer } from '@/context/BuyerContext';
import { ProductCard } from '@/components/buyer/ProductCard';
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  MapPin,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Calendar,
  User,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Sparkles,
  Award
} from 'lucide-react';

function ProductDetailContent() {
  const params = useParams();
  const productId = params?.id as string;
  const router = useRouter();

  const {
    getProductById,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist
  } = useBuyer();

  const product = getProductById(productId);

  const [quantity, setQuantity] = useState(product?.minOrderQty || 10);
  const [addedToast, setAddedToast] = useState(false);

  if (!product) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Produce Lot Not Found</h2>
        <p className="text-xs text-gray-500">
          The requested harvest consignment may have been sold out or unlisted by the mandi admin.
        </p>
        <Link
          href="/buyer/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#994200] text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Produce Catalog
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 5);
    }
  };

  const handleDecrement = () => {
    if (quantity > product.minOrderQty) {
      setQuantity((prev) => Math.max(product.minOrderQty, prev - 5));
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    router.push('/buyer/checkout');
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/buyer/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#994200] transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse Produce
        </Link>

        <span className="text-xs text-gray-400">
          Consignment Lot: <strong className="text-gray-700 font-mono">{product.id}</strong>
        </span>
      </div>

      {/* Main Two-Column Product Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Big Product Image & Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 w-full bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/95 backdrop-blur-xs text-gray-800 text-xs font-bold rounded-full shadow-xs">
                {product.category}
              </span>
              <span className="px-3 py-1 bg-amber-100 text-[#994200] text-xs font-bold rounded-full border border-amber-200 shadow-xs">
                {product.grade}
              </span>
              {product.isOrganic && (
                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-xs flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                  NPOP Certified Organic
                </span>
              )}
            </div>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-md transition-all active:scale-90 ${
                isFavorited
                  ? 'bg-red-50 text-red-600'
                  : 'bg-white/90 text-gray-500 hover:text-red-600'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Quality & Trust Feature Pills */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-2xl border border-gray-200/90 text-center space-y-1">
              <ShieldCheck className="h-5 w-5 text-emerald-600 mx-auto" />
              <p className="text-xs font-bold text-gray-900">Lab Tested</p>
              <p className="text-[10px] text-gray-400">Zero residue verified</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-gray-200/90 text-center space-y-1">
              <Truck className="h-5 w-5 text-blue-600 mx-auto" />
              <p className="text-xs font-bold text-gray-900">Cold Chain</p>
              <p className="text-[10px] text-gray-400">Direct dispatch in 24h</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-gray-200/90 text-center space-y-1">
              <Award className="h-5 w-5 text-amber-700 mx-auto" />
              <p className="text-xs font-bold text-gray-900">Mandi Gate Pass</p>
              <p className="text-[10px] text-gray-400">100% Tax & EWB cleared</p>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Farmer Info, Quantity & Action */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-amber-800 font-semibold">
              <MapPin className="h-3.5 w-3.5 text-[#994200]" />
              <span>{product.location} • Mandi: {product.mandi}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {product.name}
            </h1>
            {product.hindiName && (
              <p className="text-sm text-gray-500 font-medium">
                {product.hindiName}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg text-xs font-bold border border-amber-200">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-gray-500">
                {product.reviewsCount} wholesale reviews & verified lot ratings
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-5 space-y-2">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-semibold text-gray-500 ml-1">
                  / {product.unit} (Exclusive of freight)
                </span>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  product.stock > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} ${product.unit} In Stock`
                  : 'Out of Stock'}
              </span>
            </div>

            <p className="text-xs text-gray-500">
              Minimum procurement order quantity: <strong>{product.minOrderQty} {product.unit}</strong>
            </p>
          </div>

          {/* Description */}
          <div className="space-y-1 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Harvest & Quality Metadata Grid */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400 block font-medium">Harvest Batch Date</span>
              <span className="font-bold text-gray-900 mt-0.5 block flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                {product.harvestDate}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Quality Grade</span>
              <span className="font-bold text-gray-900 mt-0.5 block">
                {product.grade}
              </span>
            </div>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">
                Select Lot Quantity ({product.unit}):
              </span>
              <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= product.minOrderQty || isOutOfStock}
                  className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200 disabled:opacity-40 transition"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-16 text-center font-bold text-sm text-gray-900">
                  {quantity} {product.unit}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200 disabled:opacity-40 transition"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Estimated Total Calculation */}
            <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span>Lot Estimated Amount:</span>
              <span className="font-extrabold text-base text-gray-900">
                ₹{(quantity * product.price).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  addedToast
                    ? 'bg-emerald-600 text-white'
                    : isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-amber-50 hover:bg-amber-100 text-[#994200] border border-amber-300 shadow-2xs active:scale-95'
                }`}
              >
                {addedToast ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#994200] hover:bg-[#7A3400] text-white active:scale-95'
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About the Farmer Section */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="h-10 w-10 rounded-xl bg-amber-100 text-[#994200] flex items-center justify-center font-bold text-sm">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-gray-900">
              About Producer: {product.farmer}
            </h3>
            <p className="text-xs text-gray-500">
              Registered KisanKart Producer ID: {product.farmerId} • Verified KYC & Landholder
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
            <span className="font-bold text-gray-900 block">Cultivation Location</span>
            <p>{product.location}</p>
            <p className="text-[11px] text-gray-400">Nearest Mandi: {product.mandi}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
            <span className="font-bold text-gray-900 block">Agrarian Practices</span>
            <p>{product.isOrganic ? 'Zero Chemical Fertilizers, Vermicompost' : 'Integrated Pest Management (IPM)'}</p>
            <p className="text-[11px] text-gray-400">Soil Health Card: Optimal Nitrogen</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
            <span className="font-bold text-gray-900 block">Fulfillment Track Record</span>
            <p className="text-emerald-700 font-bold">99.2% On-time Dispatches</p>
            <p className="text-[11px] text-gray-400">Over 380+ Quintals traded this season</p>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Related {product.category} Lots
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Alternative offerings from neighboring mandis
              </p>
            </div>
            <Link
              href={`/buyer/products?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-bold text-[#994200] hover:text-[#7A3400]"
            >
              View All {product.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <BuyerLayout>
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
            Loading farmgate consignment details...
          </div>
        }
      >
        <ProductDetailContent />
      </Suspense>
    </BuyerLayout>
  );
}
