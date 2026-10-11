'use client';

import React from 'react';
import Link from 'next/link';
import { BuyerCategory } from '@/types/buyer';
import {
  Carrot,
  Apple,
  Wheat,
  Sprout,
  Flame,
  Milk,
  Leaf,
  Calendar,
  Layers
} from 'lucide-react';

interface CategoryCardProps {
  category: BuyerCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Vegetables':
        return <Carrot className="h-6 w-6 text-amber-700" />;
      case 'Fruits':
        return <Apple className="h-6 w-6 text-red-600" />;
      case 'Grains':
        return <Wheat className="h-6 w-6 text-yellow-700" />;
      case 'Pulses':
        return <Sprout className="h-6 w-6 text-emerald-700" />;
      case 'Spices':
        return <Flame className="h-6 w-6 text-orange-600" />;
      case 'Dairy':
        return <Milk className="h-6 w-6 text-blue-600" />;
      case 'Organic':
        return <Leaf className="h-6 w-6 text-green-700" />;
      case 'Seasonal Crops':
        return <Calendar className="h-6 w-6 text-indigo-600" />;
      default:
        return <Layers className="h-6 w-6 text-amber-700" />;
    }
  };

  return (
    <Link
      href={`/buyer/products?category=${encodeURIComponent(category.name)}`}
      className="group bg-white rounded-2xl border border-gray-200/90 hover:border-amber-300 hover:shadow-md p-4 transition-all duration-300 flex flex-col items-center text-center space-y-2 relative"
    >
      <div className="h-14 w-14 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-100/60 transition-transform duration-300">
        {getIcon(category.name)}
      </div>

      <div className="space-y-0.5">
        <h4 className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-[#994200] transition">
          {category.name}
        </h4>
        <p className="text-[10px] text-gray-500 font-medium">
          {category.hindiName}
        </p>
      </div>

      <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full group-hover:bg-amber-100 group-hover:text-[#994200] transition">
        {category.count} items
      </span>
    </Link>
  );
}
