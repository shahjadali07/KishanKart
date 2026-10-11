'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sprout, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Camera 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordInput, PasswordStrength } from './PasswordInput';
import { AuthError, AuthSuccess, LoadingButtonState } from './AuthFeedback';
import { useAuth } from '@/context/AuthContext';

export function FarmerSignupForm() {
  const router = useRouter();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Lucknow');
  const [village, setVillage] = useState('Bakshi Ka Talab');
  const [farmSize, setFarmSize] = useState('3.5 Acres');
  const [mainCrops, setMainCrops] = useState('Tomatoes, Potatoes, Green Peas');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName) return setError('Please enter your full name.');
    if (!mobile || mobile.length < 10) return setError('Please enter a valid 10-digit mobile number.');
    if (!password || password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (!agreeTerms) return setError('Please agree to KisanKart Terms & Privacy Policy.');

    setIsLoading(true);
    const res = await signup({
      name: fullName,
      phone: mobile,
      email: email || `${mobile}@kisankart.in`,
      password,
      role: 'FARMER',
      state,
      district,
      village,
      farmSize,
      mainCrops,
    });
    setIsLoading(false);

    if (res.success) {
      setSuccess('Farmer profile created! Redirecting to verification...');
      setTimeout(() => {
        router.push('/verify');
      }, 700);
    } else {
      setError(res.error || 'Failed to create account.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AuthError message={error} />
      <AuthSuccess message={success} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Full Name <span className="text-amber-700">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Rajesh Kumar"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Mobile Number (WhatsApp linked) <span className="text-amber-700">*</span>
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
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Email Address <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <input
          type="email"
          placeholder="rajesh.farmer@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
        />
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

      {/* Farm Location Details */}
      <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
          <MapPin className="h-4 w-4 text-amber-700" />
          <span>Farm Gate Location & Mandi Cluster</span>
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
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Village / Tehsil</label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Farm Land Size</label>
            <input
              type="text"
              placeholder="e.g. 5 Acres"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Main Crops Cultivated</label>
            <input
              type="text"
              placeholder="e.g. Tomato, Potato, Wheat"
              value={mainCrops}
              onChange={(e) => setMainCrops(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
            />
          </div>
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
            I agree to the <a href="#" className="font-bold text-amber-800 underline">KisanKart Terms of Service</a> and <a href="#" className="font-bold text-amber-800 underline">Privacy Policy</a>. Zero registration fee for farmers.
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
          <LoadingButtonState text="Creating farmer account..." />
        ) : (
          <>
            <span>Create Farmer Account</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
