'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  Phone, 
  HelpCircle, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Truck,
  Landmark
} from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  heroBadge?: string;
  heroTitle?: React.ReactNode;
  heroDescription?: string;
}

export function AuthLayout({
  children,
  heroBadge = "CONNECTING 120,000+ VERIFIED FARMERS & BUYERS",
  heroTitle,
  heroDescription = "India's most trusted agrarian trade infrastructure connecting farm-gate harvests with institutional commodity buyers, FPOs, and retailers."
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-gray-900 antialiased selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top Universal Navbar */}
      <header className="border-b border-gray-200/90 bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left Logo & Tagline */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-[#994200] text-white flex items-center justify-center font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
                <Sprout className="h-5 w-5 text-amber-200" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-gray-900 tracking-tight leading-none">
                    KisanKart
                  </span>
                  <span className="text-[10px] font-bold tracking-wider text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 uppercase">
                    Direct Farm
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-gray-500 tracking-tight">
                  From Farm to You, Direct & Smart
                </span>
              </div>
            </Link>

            {/* Right Helpline & Assistance */}
            <div className="flex items-center gap-3 sm:gap-5 text-xs font-medium">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50/80 border border-amber-200/70 text-amber-950">
                <Phone className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                <span>Helpline: <strong className="font-bold">1800-180-1551</strong></span>
                <span className="text-[9px] font-bold bg-amber-600 text-white px-1.5 py-0.2 rounded-full uppercase">
                  Toll-Free
                </span>
              </div>

              {/* Language toggle badge */}
              <div className="hidden sm:flex items-center border border-gray-200 rounded-lg p-0.5 bg-gray-50 text-[11px] font-semibold">
                <span className="px-2 py-0.5 bg-white text-gray-900 rounded shadow-2xs">English</span>
                <span className="px-2 py-0.5 text-gray-500">हिन्दी</span>
              </div>

              <Link 
                href="/" 
                className="flex items-center gap-1 text-gray-600 hover:text-amber-800 transition-colors"
              >
                <HelpCircle className="h-4 w-4 text-gray-400" />
                <span className="hidden sm:inline">Assistance</span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Visual & Trust Showcase (Visible on Desktop / Tablet) */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-amber-100/40 rounded-3xl p-8 xl:p-10 text-gray-900 flex-col justify-between shadow-xs relative overflow-hidden border border-amber-200/80">
            {/* Subtle background radial glows */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-orange-200/30 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-amber-300 text-amber-900 text-[11px] font-bold tracking-wide uppercase shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                <span>{heroBadge}</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-gray-950 leading-[1.2]">
                {heroTitle || (
                  <>
                    Fair Mandi Prices. Direct Disintermediation. Instant Escrow Payouts.
                  </>
                )}
              </h1>

              {/* Sub-description */}
              <p className="text-sm xl:text-base text-gray-700 leading-relaxed max-w-xl font-normal">
                {heroDescription}
              </p>

              {/* 3 Pillars Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                
                <div className="bg-white/80 backdrop-blur-xs border border-amber-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="h-9 w-9 rounded-xl bg-amber-100/90 text-amber-800 flex items-center justify-center mb-3">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 mb-1">0% Middleman Cut</h4>
                  <p className="text-[11px] text-gray-600 leading-normal">
                    Direct Mandi rates transparently benchmarked to APMC realtime records.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xs border border-amber-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="h-9 w-9 rounded-xl bg-amber-100/90 text-amber-800 flex items-center justify-center mb-3">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1 !text-gray-900">Same-Day Escrow</h4>
                  <p className="text-[11px] text-gray-600 leading-normal">
                    Funds released instantly to UPI/Bank account upon weighbridge QC check.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xs border border-amber-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="h-9 w-9 rounded-xl bg-amber-100/90 text-amber-800 flex items-center justify-center mb-3">
                    <Truck className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 mb-1">Farm-Gate Logistics</h4>
                  <p className="text-[11px] text-gray-600 leading-normal">
                    Doorstep pickup & bulk pooling across 18 agri-clusters within 24 hours.
                  </p>
                </div>

              </div>

              {/* Testimonial Quote */}
              <div className="bg-white/90 backdrop-blur-xs border border-amber-200/90 rounded-2xl p-4 flex items-center gap-4 shadow-2xs">
                <div className="h-12 w-12 rounded-xl bg-amber-100/80 overflow-hidden shrink-0 border border-amber-300 flex items-center justify-center text-xl font-bold">
                  👨‍🌾
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-600 text-xs">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    <span className="text-[10px] text-amber-900 font-bold ml-1 bg-amber-100/80 px-1.5 py-0.5 rounded">Verified FPO Partner</span>
                  </div>
                  <p className="text-xs text-gray-800 italic leading-snug">
                    &ldquo;KisanKart helped our FPO get 20% higher rates for our tomato harvest with instant payment. No delay at the mandi gate.&rdquo;
                  </p>
                  <p className="text-[11px] text-gray-600 font-medium">
                    — Rajesh Kumar • <span className="text-amber-800 font-bold">Bakshi Ka Talab, Lucknow</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Compliance row */}
            <div className="relative z-10 pt-6 mt-6 border-t border-amber-200/90 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-600 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
                Govt. e-NAM Compliant
              </span>
              <span className="flex items-center gap-1.5">
                <Landmark className="h-3.5 w-3.5 text-amber-700" />
                Instant UPI / Bharat BillPay
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-700" />
                RBI Escrow Guarded
              </span>
            </div>

          </div>

          {/* Right Column: Authentication Form Card */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
            {children}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-gray-500 border-t border-gray-200/80 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] font-medium">
          <p>© 2025 KisanKart AgriTech India Pvt. Ltd. Empowering agrarian prosperity.</p>
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <Link href="/" className="hover:text-amber-800">APMC Mandi Ticker</Link>
            <span>•</span>
            <span className="text-amber-800 font-semibold">Kisan Call Center: 1800-180-1551</span>
            <span>•</span>
            <Link href="/" className="hover:text-amber-800">Fair Price Guarantee</Link>
            <span>•</span>
            <Link href="/" className="hover:text-amber-800">Quality Grading Standards</Link>
            <span>•</span>
            <Link href="/" className="hover:text-amber-800">Privacy Policy</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
