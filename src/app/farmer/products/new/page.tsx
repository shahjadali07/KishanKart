'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFarmer } from '@/context/FarmerContext';
import { FarmerLayout } from '@/components/farmer/FarmerLayout';
import { FarmerProductCategory, FarmerProductStatus } from '@/types/farmer';
import { ArrowLeft, Save, Plus, Sprout, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct, profile } = useFarmer();

  const [name, setName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [category, setCategory] = useState<FarmerProductCategory>('Vegetables');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(30);
  const [unit, setUnit] = useState('kg');
  const [availableQuantity, setAvailableQuantity] = useState<number>(200);
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState<number>(25);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(50);
  const [isOrganic, setIsOrganic] = useState(true);
  const [grade, setGrade] = useState<'Grade A' | 'Grade B' | 'Export Quality' | 'Certified Organic'>('Grade A');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800');
  const [status, setStatus] = useState<FarmerProductStatus>('Active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name,
      hindiName: hindiName || undefined,
      description,
      category,
      images: [imageUrl],
      price: Number(price),
      unit,
      availableQuantity: Number(availableQuantity),
      minimumOrderQuantity: Number(minimumOrderQuantity),
      lowStockThreshold: Number(lowStockThreshold),
      isOrganic,
      location: `${profile.village}, ${profile.district}`,
      mandi: `${profile.district} APMC`,
      grade,
      status,
      harvestDate: new Date().toISOString().split('T')[0]
    });

    router.push('/farmer/products');
  };

  return (
    <FarmerLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/farmer/products"
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              List New Produce Lot
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Publish harvest crops to the digital Mandi trading floor with verified lab grading
            </p>
          </div>
        </div>

        {/* Product Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/90 shadow-2xs space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-[#994200]">
              1. Basic Crop Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Product Name (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Red Hybrid Tomatoes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Crop Name (Hindi / Regional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. टमाटर (हाइब्रिड)"
                  value={hindiName}
                  onChange={(e) => setHindiName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FarmerProductCategory)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>
                  <option value="Pulses">Pulses</option>
                  <option value="Spices">Spices</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Organic">Organic</option>
                  <option value="Seasonal Crops">Seasonal Crops</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Quality Grade *
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                >
                  <option value="Grade A">Grade A (Standard Commercial)</option>
                  <option value="Grade B">Grade B (Processing Grade)</option>
                  <option value="Export Quality">Export Quality</option>
                  <option value="Certified Organic">Certified Organic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Description & Crop Characteristics
              </label>
              <textarea
                rows={3}
                placeholder="Describe shelf life, harvest date, moisture content, packing format..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-[#994200]">
              2. Pricing & Lot Inventory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Asking Rate (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Measurement Unit *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                >
                  <option value="kg">kg (Kilogram)</option>
                  <option value="quintal">quintal (100 kg)</option>
                  <option value="box">box (Standard Crates)</option>
                  <option value="litre">litre</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Available Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={availableQuantity}
                  onChange={(e) => setAvailableQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Minimum Order Quantity (MOQ)
                </label>
                <input
                  type="number"
                  min="1"
                  value={minimumOrderQuantity}
                  onChange={(e) => setMinimumOrderQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Low Stock Alert Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={isOrganic}
                  onChange={(e) => setIsOrganic(e.target.checked)}
                  className="h-4 w-4 text-[#994200] rounded focus:ring-0"
                />
                <span>Certified Organic / Zero Chemical Pesticide</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-[#994200]">
              3. Produce Media & Status
            </h3>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Enter a clear photograph of the harvested lot or sample.
              </p>
            </div>

            <div className="w-full sm:w-1/2">
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Initial Listing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as FarmerProductStatus)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
              >
                <option value="Active">Active (Publish to digital mandi)</option>
                <option value="Inactive">Inactive (Draft only)</option>
                <option value="Pending Approval">Pending APMC Inspection</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <Link
              href="/farmer/products"
              className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 rounded-xl transition"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              className="px-6 py-2.5 bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <Save className="h-4 w-4 mr-1.5" />
              Save & Publish Product
            </Button>
          </div>
        </form>
      </div>
    </FarmerLayout>
  );
}
