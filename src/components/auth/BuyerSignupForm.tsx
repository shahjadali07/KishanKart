'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordInput, PasswordStrength } from './PasswordInput';
import { AuthError, AuthSuccess, LoadingButtonState } from './AuthFeedback';
import { useAuth } from '@/context/AuthContext';

export function BuyerSignupForm() {
  const router = useRouter();
  const { signup } = useAuth();

  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessType, setBusinessType] = useState('Restaurant');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Lucknow');
  const [city, setCity] = useState('Hazratganj');
  const [gstNumber, setGstNumber] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!businessName) return setError('Please enter Business or Organization Name.');
    if (!contactPerson) return setError('Please enter Contact Person Name.');
    if (!mobile || mobile.length < 10) return setError('Please enter a valid 10-digit mobile number.');
    if (!email) return setError('Please enter business email.');
    if (!password || password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (!agreeTerms) return setError('Please agree to KisanKart Terms & Privacy Policy.');

    setIsLoading(true);
    const res = await signup({
      businessName,
      name: contactPerson,
      phone: mobile,
      email,
      password,
      role: 'BUYER',
      businessType,
      state,
      district,
      city,
      gstNumber,
      businessAddress,
    });
    setIsLoading(false);

    if (res.success) {
      setSuccess('Buyer profile registered! Redirecting to verification...');
      setTimeout(() => {
        router.push('/verify');
      }, 700);
    } else {
      setError(res.error || 'Failed to register buyer account.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AuthError message={error} />
      <AuthSuccess message={success} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Business / Organization Name <span className="text-amber-700">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Sharma Foods Ltd."
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Contact Person Name <span className="text-amber-700">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Amit Sharma (Procurement)"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Mobile Number <span className="text-amber-700">*</span>
          </label>
          <div className="relative flex rounded-xl border border-gray-200 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-100 overflow-hidden bg-white">
            <span className="bg-gray-50 px-3 py-2.5 border-r border-gray-200 text-xs font-bold text-gray-600">
              +91
            </span>
            <input
              type="tel"
              maxLength={10}
              placeholder="98765 43210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Business Email <span className="text-amber-700">*</span>
          </label>
          <input
            type="email"
            placeholder="procurement@sharmafoods.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <PasswordInput
            label="Password"
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordStrength password={password} />
        </div>

        <div>
          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      {/* Business Type & GST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Business Type <span className="text-amber-700">*</span>
          </label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
          >
            <option value="Hotel">Hotel</option>
            <option value="Restaurant">Restaurant / Cloud Kitchen</option>
            <option value="Retailer">Retailer / Supermarket</option>
            <option value="Wholesaler">Wholesaler / Mandi Trader</option>
            <option value="Distributor">Distributor / FMCG</option>
            <option value="Other">Other Institutional Buyer</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            GST Number <span className="text-gray-400 font-normal">(Optional for FSSAI)</span>
          </label>
          <input
            type="text"
            placeholder="09AAAAA0000A1Z5"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 font-mono"
          />
        </div>
      </div>

      {/* Commercial Location */}
      <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
          <MapPin className="h-4 w-4 text-amber-700" />
          <span>Procurement Hub / Delivery Destination</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">District</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">City / Area</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Warehouse / Store Address</label>
          <input
            type="text"
            placeholder="Plot 14, Commercial Hub, Kanpur Road"
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
          />
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600 select-none">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 rounded border-gray-300 text-amber-700 focus:ring-amber-500"
          />
          <span>
            I agree to the <a href="#" className="font-bold text-amber-800 underline">KisanKart Terms of Service</a> and <a href="#" className="font-bold text-amber-800 underline">Privacy Policy</a>. Includes Escrow security & direct dispatch agreements.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#994200] hover:bg-[#7A3400] text-white font-bold text-sm h-11 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        {isLoading ? (
          <LoadingButtonState text="Creating buyer account..." />
        ) : (
          <>
            <span>Create Buyer Account</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
