'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown, 
  Phone, 
  MapPin, 
  ChevronDown, 
  Search, 
  Plus, 
  Repeat, 
  Bell, 
  Sprout, 
  Store, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Check, 
  Truck, 
  Scale, 
  Users, 
  Building2, 
  CheckCircle2, 
  Star, 
  FileText, 
  Calculator,
  ArrowUpRight,
  ExternalLink,
  Percent,
  Layers,
  Heart,
  Leaf,
  Clock,
  Sparkles,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'VEGETABLES' | 'GRAINS' | 'PULSES' | 'SPICES'>('ALL');
  const [calcCrop, setCalcCrop] = useState('tomato');
  const [calcQty, setCalcQty] = useState(1000);

  const cropRates: Record<string, { name: string; farmRate: number; mandiRate: number; unit: string }> = {
    tomato: { name: 'Red Hybrid Tomatoes', farmRate: 28, mandiRate: 34, unit: 'kg' },
    potato: { name: 'Chipsona Potatoes', farmRate: 19, mandiRate: 24, unit: 'kg' },
    wheat: { name: 'Sharbati Golden Wheat', farmRate: 24, mandiRate: 28.5, unit: 'kg' },
    onion: { name: 'Nasik Red Onions', farmRate: 32, mandiRate: 39, unit: 'kg' },
    rice: { name: 'Basmati 1121 Paddy', farmRate: 38, mandiRate: 46, unit: 'kg' },
    mustard: { name: 'Yellow Sarson Seeds', farmRate: 56, mandiRate: 64, unit: 'kg' },
  };

  const selectedCropInfo = cropRates[calcCrop] || cropRates.tomato;
  const mandiTotal = selectedCropInfo.mandiRate * calcQty;
  const kisanKartTotal = selectedCropInfo.farmRate * calcQty;
  const totalBuyerSavings = mandiTotal - kisanKartTotal;
  const farmerExtraIncome = Math.round(kisanKartTotal * 0.22);

  const produceLots = [
    {
      id: 'tomato-desi',
      name: 'Red Hybrid Tomatoes',
      category: 'VEGETABLES',
      location: 'Bakshi Ka Talab, Lucknow (12 km)',
      lotSize: '500 kg',
      harvestInfo: 'Plucked 5:30 AM Today',
      rate: '₹28',
      unit: 'kg',
      mandiBenchmark: 'Mandi: ₹26/kg',
      badge: 'GRADE A',
      matchScore: '96% Match',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80',
      farmer: 'Rajesh Kumar Verma',
      tag: 'Fresh Farm Plucked'
    },
    {
      id: 'potato-chipsona',
      name: 'Chipsona Processing Potatoes',
      category: 'VEGETABLES',
      location: 'Malihabad Cluster (18 km)',
      lotSize: '1,200 kg',
      harvestInfo: '< 18.4% Cured Solids',
      rate: '₹19',
      unit: 'kg',
      mandiBenchmark: 'Mandi: ₹17.50/kg',
      badge: 'PROCESSING GRADE',
      matchScore: '92% Match',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80',
      farmer: 'Amit Singh Patel',
      tag: 'Crisp & Moisture-Tested'
    },
    {
      id: 'wheat-sharbati',
      name: 'Sharbati Golden Grain Wheat',
      category: 'GRAINS',
      location: 'Mandi Grameen Silo #3, Gorakhpur',
      lotSize: '2,500 kg',
      harvestInfo: '< 9.8% Certified Moisture',
      rate: '₹24',
      unit: 'kg',
      mandiBenchmark: 'MSP: ₹22.75/kg',
      badge: 'PREMIUM SILO',
      matchScore: '89% Match',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
      farmer: 'Kashi Agro FPO',
      tag: 'Aged 90 Days in Silo'
    },
    {
      id: 'green-peas',
      name: 'Sweet Tender Green Peas',
      category: 'VEGETABLES',
      location: 'Kakori Farm Cluster (14 km)',
      lotSize: '350 kg',
      harvestInfo: 'Late Evening Harvested',
      rate: '₹42',
      unit: 'kg',
      mandiBenchmark: 'Mandi: ₹38/kg',
      badge: 'POD FRESH',
      matchScore: '94% Match',
      image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800&q=80',
      farmer: 'Alok G. Yadav',
      tag: 'Sugar Sweet Pods'
    },
    {
      id: 'basmati-paddy',
      name: 'Traditional Basmati 1121 Paddy',
      category: 'GRAINS',
      location: 'Karnal Mandi Hub, Haryana',
      lotSize: '3,800 kg',
      harvestInfo: '8.4 mm Extra Long Grain',
      rate: '₹38',
      unit: 'kg',
      mandiBenchmark: 'Mandi: ₹36/kg',
      badge: 'EXPORT GRADE',
      matchScore: '98% Match',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
      farmer: 'Hardeep S. Dhillon',
      tag: 'Export Quality Basmati'
    },
    {
      id: 'nasik-onion',
      name: 'Nasik Red Medium-Bold Onions',
      category: 'VEGETABLES',
      location: 'Lasalgaon Mandi Belt (Hub 4)',
      lotSize: '1,800 kg',
      harvestInfo: 'Solar Cured & Sorted',
      rate: '₹32',
      unit: 'kg',
      mandiBenchmark: 'Mandi: ₹29.50/kg',
      badge: 'DOUBLE SORTED',
      matchScore: '95% Match',
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&q=80',
      farmer: 'Manoj R. Patil',
      tag: '45-Day Shelf Life'
    },
    {
      id: 'yellow-mustard',
      name: 'Yellow Sarson Mustard Seeds',
      category: 'PULSES',
      location: 'Sehore Mandi Strip, MP',
      lotSize: '950 kg',
      harvestInfo: '42.6% High Oil Yield',
      rate: '₹56',
      unit: 'kg',
      mandiBenchmark: 'Mandi: ₹53.80/kg',
      badge: 'COLD PRESS GRADE',
      matchScore: '91% Match',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80',
      farmer: 'Virendra Chouhan',
      tag: 'Ideal for Kacchi Ghani'
    },
    {
      id: 'guntur-chilli',
      name: 'Guntur Teja S17 Dried Chilli',
      category: 'SPICES',
      location: 'Guntur APMC Yard, Andhra',
      lotSize: '400 kg',
      harvestInfo: 'SHU 75,000+ Extra Hot',
      rate: '₹72',
      unit: 'kg',
      mandiBenchmark: 'Mandi: ₹68/kg',
      badge: 'EXTRA HOT',
      matchScore: '97% Match',
      image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&q=80',
      farmer: 'Venkatesh Rao',
      tag: 'Sun-Dried Stemless'
    }
  ];

  const filteredLots = activeCategory === 'ALL' 
    ? produceLots 
    : produceLots.filter(p => p.category === activeCategory);

  const commodityCategories = [
    {
      name: 'Fresh Farm Vegetables',
      hindi: 'ताज़ी मौसमी सब्ज़ियाँ',
      icon: '🍅',
      lotsCount: '28 Active Lots',
      examples: 'Tomatoes, Potatoes, Peas, Cauliflower',
      href: '/buyer/products?category=Vegetables',
      color: 'from-red-50 to-amber-50/60 border-red-100/80'
    },
    {
      name: 'Grains & Millets',
      hindi: 'अनाज एवं कदन',
      icon: '🌾',
      lotsCount: '34 Active Lots',
      examples: 'Sharbati Wheat, Basmati Rice, Maize, Bajra',
      href: '/buyer/products?category=Grains',
      color: 'from-amber-50 to-yellow-50/60 border-amber-100/80'
    },
    {
      name: 'Pulses & Oilseeds',
      hindi: 'दालें एवं तिलहन',
      icon: '🫘',
      lotsCount: '19 Active Lots',
      examples: 'Chana, Yellow Sarson, Moong, Toor',
      href: '/buyer/products?category=Pulses',
      color: 'from-orange-50 to-amber-50/60 border-orange-100/80'
    },
    {
      name: 'Direct Spices & Herbs',
      hindi: 'मसाले एवं जड़ी-बूटियाँ',
      icon: '🌶️',
      lotsCount: '14 Active Lots',
      examples: 'Guntur Chilli, Turmeric, Cumin, Garlic',
      href: '/buyer/products?category=Spices',
      color: 'from-rose-50 to-orange-50/60 border-rose-100/80'
    },
    {
      name: 'Roots, Tubers & Alliums',
      hindi: 'कंदमूल एवं प्याज-लहसुन',
      icon: '🥔',
      lotsCount: '22 Active Lots',
      examples: 'Nasik Onions, Chipsona, Ginger, Colocasia',
      href: '/buyer/products?category=Vegetables',
      color: 'from-amber-50 to-stone-50 border-amber-100/80'
    },
    {
      name: 'Certified Organic & Pure',
      hindi: 'जैविक एवं प्राकृतिक उत्पाद',
      icon: '🌿',
      lotsCount: '11 Active Lots',
      examples: 'Organic Jaggery, Desi Cow Ghee, Wild Honey',
      href: '/buyer/products?category=Organic',
      color: 'from-emerald-50 to-teal-50/60 border-emerald-100/80'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-gray-900 antialiased selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. MAIN NAVBAR */}
      <nav className="border-b border-gray-200/90 bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-3">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="h-9 w-9 rounded-xl bg-[#994200] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                <Sprout className="h-5 w-5 text-amber-200" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-gray-900 tracking-tight leading-none">
                    KisanKart
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-gray-500 tracking-tight">
                  From Farm to You, Direct & Smart
                </span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search produce (Tomato, Potato, Wheat, Peas)..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Navigation links & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/farmer/dashboard"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <span>Farmer Desk</span>
              </Link>

              <Link
                href="/buyer/dashboard"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <span>Buyer Hub</span>
              </Link>

              <Link
                href="/admin/dashboard"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <span>APMC Rates</span>
              </Link>

              <Link
                href="/farmer/dashboard"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <span>Logistics</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Live
                </span>
              </Link>

              {/* Language Switch */}
              <div className="hidden sm:flex items-center border border-gray-200 rounded-lg p-0.5 bg-gray-50 text-[11px] font-semibold">
                <span className="px-2 py-0.5 bg-white text-gray-900 rounded shadow-2xs">English</span>
                <span className="px-2 py-0.5 text-gray-500">हिन्दी</span>
              </div>

              {/* Get Started / Login CTA */}
              <Link
                href="/login"
                className="bg-[#994200] hover:bg-[#7A3400] text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="relative pt-8 pb-12 sm:pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF4EA] border border-amber-300 text-[#8C3A00] text-xs font-bold tracking-wide">
                <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse"></span>
                <span>Govt. e-NAM Synchronized Agri-Trade Network</span>
              </div>

              {/* Hero Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-gray-900 leading-[1.1]">
                Fresh From Indian Farms. <br />
                <span className="text-amber-800 underline decoration-amber-400 decoration-wavy decoration-2">Direct to Your Kitchen</span> & Business.
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl font-normal">
                India&apos;s trusted digital agri-marketplace connecting verified farmers directly with hotels, supermarket chains, and households. Eliminate middlemen cuts, guarantee fair mandi rates, and lock same-day escrow settlements.
              </p>

              {/* Primary Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <Link
                  href="/buyer/dashboard"
                  className="bg-[#994200] hover:bg-[#7A3400] text-white font-bold text-sm h-11 px-6 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Search className="h-4 w-4" />
                  <span>Explore Fresh Produce (Buyer)</span>
                </Link>

                <Link
                  href="/signup"
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold text-sm h-11 px-6 rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-all"
                >
                  <Sprout className="h-4 w-4 text-amber-700" />
                  <span>Sell Your Harvest (Farmer)</span>
                </Link>
              </div>

              {/* 4 Trust Bullet Points */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-200/80 text-xs text-gray-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>0% Middleman Cut</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Same-Day Escrow Disbursed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Farm-Gate QC Tare Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>±3.5% APMC Price Guarantee</span>
                </div>
              </div>

            </div>

            {/* Right Hero Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-5 relative overflow-hidden">
                
                {/* Farmer Banner */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#5C2B0B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      RK
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-900">Rajesh Kumar</span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <p className="text-[11px] text-gray-500">Bakshi Ka Talab • 11 km away</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FDF4EA] text-[#8C3A00] border border-amber-200">
                    ● 96% Match
                  </span>
                </div>

                {/* Produce Image Card */}
                <div className="mt-3 relative rounded-2xl overflow-hidden aspect-video bg-gray-100 border border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80"
                    alt="Red Hybrid Tomatoes"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span>Plucked Today: 5:30 AM</span>
                  </span>
                  <span className="absolute top-2.5 right-2.5 bg-[#994200] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Grade A Lab Certified
                  </span>
                </div>

                {/* Price & Quantity Grid */}
                <div className="mt-3.5 p-3.5 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-semibold text-gray-600">Red Hybrid Tomatoes</span>
                    <span className="text-lg font-black text-gray-900">
                      ₹28 <span className="text-xs font-normal text-gray-500">/ kg</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 pt-1 border-t border-gray-200/60">
                    <span>Traditional Mandi Rate: <del className="text-rose-600 font-semibold">₹22/kg</del></span>
                    <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      +₹6/kg Extra Farmer Margin
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-600 font-medium px-1">
                  <span>Lot Size: <strong className="text-gray-900">500 kg</strong></span>
                  <span>Vehicle: <strong className="text-gray-900">Tata Ace Options</strong></span>
                  <span>Pickup: <strong className="text-amber-800 font-bold">Today 2:30 PM</strong></span>
                </div>

                {/* CTA inside card */}
                <Link
                  href="/buyer/dashboard"
                  className="mt-4 w-full bg-[#994200] hover:bg-[#7A3400] text-white font-bold text-xs h-10 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Lock Deal with Instant ICICI Escrow</span>
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. STATS STRIP (4 Pillars) */}
      <section className="py-6 border-y border-gray-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Stat 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 border border-gray-200/80 hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="h-8 w-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Sprout className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  18 Mandis
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">120,000+</div>
              <div className="text-xs font-bold text-gray-800 mt-0.5">Verified Farmers</div>
              <div className="text-[11px] text-gray-500 mt-1">Across UP, MP, Haryana & Punjab mandi clusters</div>
            </div>

            {/* Stat 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 border border-gray-200/80 hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="h-8 w-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Building2 className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  B2B + HORECA
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">18,500+</div>
              <div className="text-xs font-bold text-gray-800 mt-0.5">Active Commercial Buyers</div>
              <div className="text-[11px] text-gray-500 mt-1">Hotels, Cloud Kitchens, Retailers & FMCG</div>
            </div>

            {/* Stat 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 border border-gray-200/80 hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="h-8 w-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  100% Escrow
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-800 tracking-tight">₹420+ Cr</div>
              <div className="text-xs font-bold text-gray-800 mt-0.5">Produce Traded Directly</div>
              <div className="text-[11px] text-gray-500 mt-1">Zero bad debts, bank-guaranteed transfers</div>
            </div>

            {/* Stat 4 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 border border-gray-200/80 hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="h-8 w-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <TrendingUp className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Income Delta
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-800 tracking-tight">+24.6%</div>
              <div className="text-xs font-bold text-gray-800 mt-0.5">Higher Net Farm Income</div>
              <div className="text-[11px] text-gray-500 mt-1">Eliminating middleman deductions & delays</div>
            </div>

          </div>
        </div>
      </section>

      {/* 4.5 EXPLORE BY COMMODITY CATEGORY */}
      <section className="py-12 sm:py-16 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FDF4EA] text-[#8C3A00] border border-amber-200 uppercase tracking-wider">
                FARM DIRECT TAXONOMY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
                Explore Direct Farm-Gate Produce by Category
              </h2>
              <p className="text-xs text-stone-500">
                Transparent wholesale and bulk procurement sorted by harvest type across 18 APMC clusters.
              </p>
            </div>

            <Link
              href="/buyer/products"
              className="text-xs font-bold text-[#994200] hover:text-[#7A3400] flex items-center gap-1.5 shrink-0"
            >
              <span>Explore All Product Lots</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {commodityCategories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="bg-white rounded-2xl border border-stone-200/90 p-5 hover:border-amber-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex items-start gap-4 shadow-2xs relative overflow-hidden"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-100/80 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-2xs">
                  {cat.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-stone-900 text-sm group-hover:text-[#994200] transition-colors truncate">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0 border border-emerald-100">
                      {cat.lotsCount}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-400 font-medium mt-0.5">
                    {cat.hindi}
                  </p>

                  <p className="text-xs text-stone-500 mt-2 truncate">
                    {cat.examples}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DUAL ARCHITECTURE: FOR FARMERS & FOR BUYERS */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FDF4EA] text-[#8C3A00] border border-amber-200 uppercase tracking-wider">
              DUAL OPERATIONAL ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Engineered for Both Sides of the Agri Supply Chain
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Whether you harvest 5 quintals of tomatoes or procure 50 tons for a restaurant franchise, KisanKart eliminates uncertainty with strict automation milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Card: For Farmers & FPOs */}
            <div className="bg-[#FAF9F5] rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-2xl bg-[#994200] text-white flex items-center justify-center">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">For Farmers & FPOs</h3>
                    <p className="text-xs text-gray-500">Sell at fair mandi benchmarked rates</p>
                  </div>
                </div>

                {/* 4 Steps */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">List Your Crop in 2 Minutes</h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Simple voice-crop prompt via WhatsApp or App; draft estimated quantity, variety, and expected harvest/plucking date.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">AI Smart Matching with Sincere Buyers</h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Our engine matches you for pre-commitment contracts, wholesale distributors, or retail chains within your 25 km radius.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Farm-Gate QC & Digital Weighing</h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Assisted logistics arrives at your field with calibrated digital scales and tare verification. Zero handling fees paid.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Instant Escrow Payout to UPI / Bank</h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        100% agreed payment is credited to your bank account the second produce leaves the tare scale. Zero credit risk.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/signup"
                className="w-full bg-[#994200] hover:bg-[#7A3400] text-white font-bold text-xs h-11 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <span>Register as a Farmer / FPO</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right Card: For Buyers & Businesses */}
            <div className="bg-[#FAF9F5] rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-2xl bg-blue-700 text-white flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">For Buyers & Businesses</h3>
                    <p className="text-xs text-gray-500">Procure fresh produce directly at bulk rates</p>
                  </div>
                </div>

                {/* 4 Steps */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Post Requirement or Browse Live Batches</h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Submit your daily, weekly, or monthly commodity requisitions specifying required grades, varieties, and target price points.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Hyperlocal Smart Matching (&lt; 25 km)</h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Our algorithm identifies verified farm-gates nearby, ensuring peak freshness, minimal transit shrinkage, and reduced transit costs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Unified Bulk Aggregation</h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Need 2,000 kg? We pool production across 3-5 neighbouring farmers in a single unified load with lab quality certificates.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Single-GST Invoice & Cold Delivery</h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Receive delivery directly at your warehouse or central kitchen door in temperature-controlled vans with 100% input tax credit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/buyer/dashboard"
                className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 font-bold text-xs h-11 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all"
              >
                <span>Open Commercial Procurement Desk</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 6. LIVE DIGITAL MANDI FLOOR: PRODUCE LOTS */}
      <section className="py-14 sm:py-20 bg-[#FDFBF7] border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FDF4EA] text-[#8C3A00] border border-amber-200 uppercase tracking-wider">
                  LIVE DIGITAL MANDI FLOOR
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active Trading Now</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight mt-1.5">
                Fresh Farm Lots Available for Instant Procurement
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 max-w-xl">
                Certified quality lots ready for farm-gate dispatch across Lucknow, Kanpur, Karnal & Gorakhpur mandi belts.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/buyer/products"
                className="bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {[
              { id: 'ALL', label: 'All Lots', count: produceLots.length },
              { id: 'VEGETABLES', label: 'Vegetables', count: produceLots.filter(p => p.category === 'VEGETABLES').length },
              { id: 'GRAINS', label: 'Grains & Rice', count: produceLots.filter(p => p.category === 'GRAINS').length },
              { id: 'PULSES', label: 'Pulses & Oilseeds', count: produceLots.filter(p => p.category === 'PULSES').length },
              { id: 'SPICES', label: 'Spices & Specials', count: produceLots.filter(p => p.category === 'SPICES').length }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeCategory === tab.id
                    ? 'bg-[#994200] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:border-amber-300 hover:bg-amber-50/50'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeCategory === tab.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* 8 Restyled Ecommerce Produce Lots Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredLots.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
              >
                {/* Top Image & Badges */}
                <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#994200]/95 text-white uppercase tracking-wider shadow-xs backdrop-blur-md border border-amber-500/30">
                      {item.badge}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-stone-800 shadow-xs backdrop-blur-md border border-white/60">
                      {item.matchScore}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-md flex items-center gap-1 border border-white/20">
                      <Sparkles className="h-2.5 w-2.5 text-amber-300" />
                      <span>{item.tag}</span>
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
                      <MapPin className="h-3 w-3 text-amber-600 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-1 group-hover:text-[#994200] transition-colors">
                      {item.name}
                    </h3>

                    <p className="text-[11px] text-stone-500 flex items-center gap-1">
                      <span className="font-semibold text-stone-700 truncate max-w-[150px]">{item.farmer}</span>
                      <CheckCircle2 className="h-3 w-3 text-blue-500 shrink-0" />
                    </p>
                  </div>

                  {/* Lot & Quality Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-2.5 border-y border-stone-100 bg-stone-50/70 -mx-4 px-4">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">Available Lot</span>
                      <span className="font-extrabold text-stone-900">{item.lotSize}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">Quality Tag</span>
                      <span className="font-semibold text-amber-800 truncate block">{item.harvestInfo}</span>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-stone-900 tracking-tight">
                          {item.rate}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">/{item.unit}</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {item.mandiBenchmark}
                      </span>
                    </div>

                    <Link
                      href={`/buyer/products`}
                      className="w-full bg-[#994200] hover:bg-[#7A3400] text-white font-bold text-xs h-9 rounded-xl flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md hover:shadow-amber-900/15 transition-all active:scale-[0.98]"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>Procure Farm Batch</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive APMC Savings & Commission Calculator */}
          <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-amber-100/50 rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-200/90 shadow-sm space-y-6">
            <div className="max-w-2xl space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#994200] text-white uppercase tracking-wider shadow-2xs">
                INTERACTIVE COST BENEFIT CALCULATOR
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight pt-1">
                Calculate Your Savings: Buy Direct from Farm vs Traditional Mandi
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                Traditional mandis charge 6-8% arthiya brokerage plus 10-15% trader transit markups. See how much you save on direct farm-gate procurement.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Controls */}
              <div className="lg:col-span-7 bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-amber-200 space-y-4 shadow-2xs">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5">
                    Select Produce Commodity:
                  </label>
                  <select
                    value={calcCrop}
                    onChange={(e) => setCalcCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-[#994200]"
                  >
                    <option value="tomato">🍅 Red Hybrid Tomatoes (Lucknow Mandi)</option>
                    <option value="potato">🥔 Chipsona Processing Potatoes (Kanpur)</option>
                    <option value="wheat">🌾 Sharbati Golden Grain Wheat (Gorakhpur)</option>
                    <option value="onion">🧅 Nasik Red Bold Onions (Lasalgaon)</option>
                    <option value="rice">🍚 Basmati 1121 Paddy (Karnal Mandi)</option>
                    <option value="mustard">🌼 Yellow Sarson Mustard (Sehore Belt)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      Procurement Quantity ({selectedCropInfo.unit}):
                    </label>
                    <span className="text-sm font-black text-[#994200]">
                      {calcQty.toLocaleString('en-IN')} {selectedCropInfo.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={calcQty}
                    onChange={(e) => setCalcQty(Number(e.target.value))}
                    className="w-full accent-[#994200] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-bold mt-1">
                    <span>100 kg</span>
                    <span>1,000 kg</span>
                    <span>2,500 kg</span>
                    <span>5,000 kg</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 block font-bold uppercase">KisanKart Direct Rate</span>
                    <span className="text-base font-black text-stone-900">₹{selectedCropInfo.farmRate}</span>
                    <span className="text-[10px] text-stone-500 font-normal"> / {selectedCropInfo.unit}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 block font-bold uppercase">Mandi Broker Rate</span>
                    <span className="text-base font-black text-rose-600 line-through">₹{selectedCropInfo.mandiRate}</span>
                    <span className="text-[10px] text-stone-500 font-normal"> / {selectedCropInfo.unit}</span>
                  </div>
                </div>
              </div>

              {/* Output Result Card */}
              <div className="lg:col-span-5 bg-[#2A160A] text-amber-100 rounded-2xl p-6 space-y-4 shadow-md border border-amber-950">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    Instant Net Advantage
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-amber-200/80 font-medium">Your Direct Buyer Savings:</span>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    ₹{totalBuyerSavings.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-amber-300/80">
                    Calculated on {calcQty.toLocaleString('en-IN')} {selectedCropInfo.unit} of {selectedCropInfo.name}
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-900/60 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-amber-200/90">
                    <span>Farmer Extra Profit:</span>
                    <strong className="text-emerald-400">+₹{farmerExtraIncome.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between items-center text-amber-200/90">
                    <span>Middleman Brokerage Cut:</span>
                    <strong className="text-white">₹0.00 (Zero)</strong>
                  </div>
                </div>

                <Link
                  href="/buyer/products"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs h-10 rounded-xl flex items-center justify-center gap-2 transition-all mt-2 shadow-xs"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Start Procurement Now</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. SOLVING THE SMALLHOLDER SCALE DILEMMA (AGGREGATION ENGINE & PRICE SPREAD) */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FDF4EA] text-[#8C3A00] border border-amber-200 uppercase tracking-wider">
              ALGORITHMIC AGGREGATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Solving the Smallholder Scale Dilemma
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Enterprise buyers need 2,000 kg consistent lots. Small farmers harvest 500 kg each. KisanKart&apos;s aggregation engine pools quality in real-time with zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Aggregation visualizer */}
            <div className="lg:col-span-7 bg-[#FAF9F5] p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <span className="text-[11px] font-bold uppercase text-gray-400">HOTEL OBEROI (LKO) - REQ #914</span>
                  <h3 className="text-sm font-bold text-gray-900 mt-0.5">Commercial Order: 2,000 kg Tomato Desi</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  100% Fulfilled
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-gray-600">
                  <span>Farm-Gate Aggregation: 4 Verified Smallholders</span>
                  <span className="text-amber-800 font-bold">2,000 / 2,000 kg</span>
                </div>
                <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-amber-600 w-1/4 border-r border-white"></div>
                  <div className="h-full bg-amber-500 w-1/4 border-r border-white"></div>
                  <div className="h-full bg-amber-600 w-1/4 border-r border-white"></div>
                  <div className="h-full bg-orange-700 w-1/4"></div>
                </div>
              </div>

              {/* Farmers list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 block">Ram K. Verma (Farm 1)</span>
                    <span className="text-[11px] text-gray-500">Bakshi Ka Talab • Grade A</span>
                  </div>
                  <span className="font-bold text-amber-800 font-mono">500 kg</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 block">Amit S. Patel (Farm 2)</span>
                    <span className="text-[11px] text-gray-500">Itaunja Cluster • Grade A</span>
                  </div>
                  <span className="font-bold text-amber-800 font-mono">500 kg</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 block">Alok G. Yadav (Farm 3)</span>
                    <span className="text-[11px] text-gray-500">Mahona Strip • Grade A</span>
                  </div>
                  <span className="font-bold text-amber-800 font-mono">500 kg</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 block">Sunil K. Devendra (Farm 4)</span>
                    <span className="text-[11px] text-gray-500">BKT Mandi Gate • Grade A</span>
                  </div>
                  <span className="font-bold text-amber-800 font-mono">500 kg</span>
                </div>
              </div>

              {/* Bottom tag */}
              <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Truck className="h-4 w-4 text-amber-700" />
                  <span>Unified Tata Ace Route • Delivery to Hotel Kitchen Hub</span>
                </span>
                <span className="font-bold text-gray-900 font-mono">Single GST Invoice</span>
              </div>
            </div>

            {/* Right: Transparent Economics Comparison */}
            <div className="lg:col-span-5 bg-[#FAF9F5] p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase text-amber-800">TRANSPARENT ECONOMICS</span>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">Fair Price Spread Analysis</h3>
                <p className="text-xs text-gray-500">Comparison per kg of solanaceous crops at Lucknow mandi.</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-gray-200 flex justify-between items-center">
                  <span className="text-gray-600 font-medium">KisanKart Net Farmer Price:</span>
                  <span className="font-bold text-amber-800 text-sm">Farmer gets ₹28/kg</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200 flex justify-between items-center text-gray-500">
                  <span>Middleman Deductions: (15-22%)</span>
                  <span className="line-through">Farmer gets: ₹22/kg</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-center font-bold">
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                    KisanKart Price to Enterprise Buyer:
                    <div className="text-sm font-extrabold mt-0.5">₹30.00 / kg (Delivered)</div>
                  </div>
                  <div className="p-2.5 bg-gray-100 rounded-xl border border-gray-200 text-gray-700 text-xs">
                    Middleman Price to Enterprise Buyer:
                    <div className="text-sm font-extrabold mt-0.5">₹34.50 / kg (Loose)</div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#FDF4EA] rounded-2xl border border-amber-300 text-center space-y-1">
                <span className="text-xs font-semibold text-amber-950 block">Buyer Savings on Typical Order:</span>
                <span className="text-xl font-black text-amber-900 block">
                  Save ₹4.50 to ₹6.00 / kg
                </span>
                <span className="text-[11px] text-amber-800 block">
                  Eliminates mandi broker commissions and transit wastage
                </span>
              </div>

              <Link
                href="/buyer/dashboard"
                className="w-full bg-[#994200] hover:bg-[#7A3400] text-white font-bold text-xs h-10 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>Calculate Your Savings</span>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 8. TESTIMONIALS: VOICES OF THE FIELD & MARKET */}
      <section className="py-14 sm:py-20 bg-[#FDFBF7] border-t border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FDF4EA] text-[#8C3A00] border border-amber-200 uppercase tracking-wider">
              VOICES OF THE FIELD & MARKET
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Empowering Agrarian Prosperity & Commercial Integrity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Testimonial 1 */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <div className="flex items-center text-amber-400 gap-1 text-sm">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                &ldquo;Earlier, taking my tomato harvest to the mandi meant paying for loading, transport, and 6% broker fee, only to wait 14 days for cash. With KisanKart, weighing happens in my field and ₹1,48,250 was credited directly to my bank account before the truck even left the village.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <div className="h-10 w-10 rounded-full bg-[#5C2B0B] text-white flex items-center justify-center font-bold text-xs">
                  RK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Rajesh Kumar</h4>
                  <p className="text-[11px] text-gray-500">Farmer & FPO Lead • Bakshi Ka Talab (Lucknow)</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <div className="flex items-center text-amber-400 gap-1 text-sm">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                &ldquo;We run 12 cloud kitchens across Lucknow and Kanpur. Dealing with multiple disorganized vendors led to inconsistent vegetable quality and 20% waste. KisanKart consolidates 4 nearby farm lots into one temperature-controlled van with single GST invoicing, cutting our procurement costs by 18%.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <div className="h-10 w-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                  AS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Anand Sharma</h4>
                  <p className="text-[11px] text-gray-500">VP Sourcing, Sharma Hospitality • Hazratganj</p>
                </div>
              </div>
            </div>

          </div>

          {/* Institutional Partner logos */}
          <div className="pt-8 border-t border-gray-200/80 text-center space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              TRUSTED BY AGRI-ECOSYSTEM LEADERS & COMMERCIAL NETWORKS
            </span>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-amber-700" /> NABARD Supported FPOs</span>
              <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-amber-700" /> Reliance Smart Wholesale</span>
              <span className="flex items-center gap-1.5"><Heart className="h-4 w-4 text-amber-700" /> Patanjali Food Outlets</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-amber-700" /> Haldiram Snacks Procurement</span>
              <span className="flex items-center gap-1.5"><Store className="h-4 w-4 text-amber-700" /> Clarks Avadh Hospitality</span>
            </div>
          </div>

        </div>
      </section>

      {/* 9. BOTTOM CTA BANNER */}
      <section className="bg-gradient-to-br from-amber-50/95 via-orange-50/40 to-amber-100/50 py-12 sm:py-16 text-gray-900 border-t border-amber-200/80 relative overflow-hidden">
        {/* Subtle decorative background radial glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-orange-200/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            <div className="space-y-2 text-center lg:text-left max-w-xl">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-amber-900 border border-amber-300 uppercase tracking-wider shadow-2xs">
                Zero Sourcing Risk • Instant Verification
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-950 leading-tight">
                Ready to Transform Your Agrarian Produce Trade?
              </h2>
              <p className="text-xs sm:text-sm text-gray-700">
                Join over 120,000 farmers and 18,500 enterprise buyers transacting with automated escrow and farm-gate delivery today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/signup"
                className="bg-[#994200] hover:bg-[#7A3400] text-white font-bold text-xs sm:text-sm h-11 px-6 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow-md"
              >
                <Sprout className="h-4 w-4 text-amber-200" />
                <span>Register as Farmer / Buyer</span>
              </Link>

              <a
                href="tel:18001801551"
                className="bg-white hover:bg-amber-50/70 border border-amber-200 text-amber-950 font-bold text-xs sm:text-sm h-11 px-5 rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="h-4 w-4 text-amber-700" />
                <span>Call Toll-Free: 1800-180-1551</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 10. COMPREHENSIVE FOOTER */}
      <footer className="bg-white text-gray-600 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-[#FDF4EA] text-[#8C3A00] flex items-center justify-center">
                  <Sprout className="h-4 w-4" />
                </div>
                <span className="text-base font-bold text-gray-900 tracking-tight">KisanKart</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                KisanKart AgriTech India Pvt. Ltd. is India&apos;s leading direct trading platform connecting farm-gate harvests with institutional buyers, FPOs, and retailers.
              </p>
              <div className="text-[11px] text-gray-400 space-y-0.5">
                <p>Digital India • e-NAM Synchronized</p>
                <p>NABARD Certified</p>
              </div>
            </div>

            <div className="text-xs space-y-2">
              <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">Ecosystem</h4>
              <ul className="space-y-1.5 text-gray-500 font-medium">
                <li><Link href="/farmer/dashboard" className="hover:text-amber-800">Farmer Desk</Link></li>
                <li><Link href="/buyer/dashboard" className="hover:text-amber-800">Buyer Hub</Link></li>
                <li><Link href="/admin/dashboard" className="hover:text-amber-800">APMC Mandi Ticker</Link></li>
                <li><Link href="/farmer/dashboard" className="hover:text-amber-800">Logistics & Silo Storage</Link></li>
              </ul>
            </div>

            <div className="text-xs space-y-2">
              <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">Standards & Trust</h4>
              <ul className="space-y-1.5 text-gray-500 font-medium">
                <li><a href="#" className="hover:text-amber-800">Fair Price Guarantee</a></li>
                <li><a href="#" className="hover:text-amber-800">Quality Grading Standards</a></li>
                <li><a href="#" className="hover:text-amber-800">Assisted QC Testing</a></li>
                <li><a href="#" className="hover:text-amber-800">Unified Single-GST Invoicing</a></li>
              </ul>
            </div>

            <div className="text-xs space-y-2">
              <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">Helpline & Legal</h4>
              <ul className="space-y-1.5 text-gray-500 font-medium">
                <li><a href="tel:18001801551" className="text-amber-800 font-bold hover:underline">Kisan Call Center: 1800-180-1551</a></li>
                <li><a href="#" className="hover:text-amber-800">Compliance & Grievance</a></li>
                <li><Link href="/login" className="hover:text-amber-800">Sign In to Account</Link></li>
                <li><Link href="/signup" className="hover:text-amber-800">Create New Account</Link></li>
              </ul>
            </div>

          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500 font-medium">
            <p>© 2025 KisanKart AgriTech India Pvt. Ltd. Empowering agrarian prosperity.</p>
            <p>Model APMC Mandi Acts Compliant • Lucknow Hub: Mandi Parishad Road, Gomti Nagar</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
