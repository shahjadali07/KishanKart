'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sprout, Building2 } from 'lucide-react';
import { FarmerSignupForm } from './FarmerSignupForm';
import { BuyerSignupForm } from './BuyerSignupForm';

export function SignupForm() {
  const [accountType, setAccountType] = useState<'FARMER' | 'BUYER'>('FARMER');

  return (
    <div className="bg-white rounded-3xl border border-amber-200/70 p-6 sm:p-8 shadow-xs">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Create Your KisanKart Account
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Join the digital marketplace built for direct and smarter agricultural trade.
          </p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FDF4EA] text-[#8C3A00] border border-amber-200/80 shadow-2xs">
          <span>Step 1 of 2</span>
        </span>
      </div>

      {/* Account Type Selector: Farmer or Buyer (Admin explicitly forbidden here) */}
      <div className="space-y-2 mb-5">
        <label className="block text-xs font-bold text-gray-700">
          Choose Account Type <span className="text-amber-700">*</span>
        </label>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAccountType('FARMER')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
              accountType === 'FARMER'
                ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20 shadow-2xs'
                : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/30 text-gray-700 bg-white'
            }`}
          >
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                accountType === 'FARMER' ? 'bg-[#994200] text-white shadow-2xs' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold block leading-tight">🌾 Farmer</span>
              <span className="text-[11px] text-gray-500 leading-tight mt-0.5 block">
                Sell your produce directly.
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAccountType('BUYER')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
              accountType === 'BUYER'
                ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20 shadow-2xs'
                : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/30 text-gray-700 bg-white'
            }`}
          >
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                accountType === 'BUYER' ? 'bg-[#994200] text-white shadow-2xs' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold block leading-tight">🏢 Buyer</span>
              <span className="text-[11px] text-gray-500 leading-tight mt-0.5 block">
                Buy fresh produce directly.
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Render selected registration form */}
      {accountType === 'FARMER' ? <FarmerSignupForm /> : <BuyerSignupForm />}

      {/* Bottom Switch to Login */}
      <div className="pt-4 mt-4 border-t border-gray-100 text-center text-xs font-medium text-gray-600">
        <span>Already have an account? </span>
        <Link
          href="/login"
          className="font-bold text-amber-800 hover:text-amber-950 underline underline-offset-2 ml-1"
        >
          Sign In to your Account →
        </Link>
      </div>

    </div>
  );
}
