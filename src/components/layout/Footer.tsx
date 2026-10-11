'use client';

import React from 'react';
import { Sprout } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white text-gray-600 border-t border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top row: Brand + Links */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-100">
          
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#FDF4EA] text-[#8C3A00] flex items-center justify-center">
              <Sprout className="h-4 w-4" />
            </div>
            <span className="text-base font-bold text-gray-900 tracking-tight">KisanKart</span>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-gray-600">
            <a href="#" className="hover:text-amber-900 transition-colors">APMC Mandi Ticker</a>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <a href="tel:18001801551" className="hover:text-amber-900 text-amber-900 font-semibold transition-colors">
              Kisan Call Center: 1800-180-1551
            </a>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <a href="#" className="hover:text-amber-900 transition-colors">Fair Price Guarantee</a>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <a href="#" className="hover:text-amber-900 transition-colors">Quality Grading Standards</a>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <a href="#" className="hover:text-amber-900 transition-colors">Privacy Policy</a>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <a href="#" className="hover:text-amber-900 transition-colors">Compliance & Grievance</a>
          </div>

        </div>

        {/* Bottom row: Copyright & Hub address */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-[11px] font-medium text-gray-500">
          <p>© 2025 KisanKart AgriTech India Pvt. Ltd. Empowering agrarian prosperity.</p>
          <p className="flex items-center gap-1.5">
            <span className="text-gray-400">Lucknow Hub:</span>
            <span className="font-semibold text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-200/80">
              Mandi Parishad Road, Gomti Nagar
            </span>
          </p>
        </div>

      </div>
    </footer>
  );
}
