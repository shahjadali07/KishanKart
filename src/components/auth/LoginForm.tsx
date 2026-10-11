'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Smartphone, 
  KeyRound, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoleSelector } from './RoleSelector';
import { PasswordInput } from './PasswordInput';
import { OTPInput } from './OTPInput';
import { AuthError, AuthSuccess, LoadingButtonState } from './AuthFeedback';
import { useAuth, UserRole } from '@/context/AuthContext';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<UserRole>('FARMER');
  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');
  const [mobile, setMobile] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOtp = () => {
    if (!mobile || mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setSuccess('OTP sent! Use demo code: 123456');
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (authMode === 'otp') {
      if (!otpSent) {
        handleSendOtp();
        return;
      }
      if (otpCode.length !== 6) {
        setError('Please enter the 6-digit verification code.');
        return;
      }
    } else {
      if (!emailOrPhone) {
        setError('Please enter your email or registered mobile number.');
        return;
      }
      if (!password) {
        setError('Please enter your password.');
        return;
      }
    }

    setIsLoading(true);
    const res = await login({
      identifier: authMode === 'otp' ? mobile : emailOrPhone,
      password,
      otp: otpCode,
      role,
      isOtpMode: authMode === 'otp',
    });

    setIsLoading(false);

    if (res.success) {
      setSuccess('Login successful! Redirecting to dashboard...');
      setTimeout(() => {
        if (role === 'FARMER') router.push('/farmer/dashboard');
        else if (role === 'BUYER') router.push('/buyer/dashboard');
        else router.push('/admin/dashboard');
      }, 700);
    } else {
      setError(res.error || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-200/70 p-6 sm:p-8 shadow-xs">
      
      {/* Top Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Sign In to KisanKart
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Access your personalized harvest dashboard, bids, and mandi contracts.
          </p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FDF4EA] text-[#8C3A00] border border-amber-200/80 shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Secure 256-bit</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Role Selector with Admin option support */}
        <RoleSelector
          selectedRole={role}
          onChange={(newRole) => {
            setRole(newRole);
            setError('');
          }}
          allowAdmin={true}
        />

        {/* Tab Toggle: Mobile OTP vs Password / Email */}
        <div className="flex border-b border-gray-200/90 pt-2">
          <button
            type="button"
            onClick={() => {
              setAuthMode('otp');
              setError('');
              setSuccess('');
            }}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold transition-all relative ${
              authMode === 'otp'
                ? 'text-[#994200] border-b-2 border-[#994200]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>Mobile OTP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('password');
              setError('');
              setSuccess('');
            }}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold transition-all relative ${
              authMode === 'password'
                ? 'text-[#994200] border-b-2 border-[#994200]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <KeyRound className="h-4 w-4" />
            <span>Password / Email</span>
          </button>
        </div>

        {/* Feedback states */}
        <AuthError message={error} />
        <AuthSuccess message={success} />

        {/* Input Fields based on authMode */}
        {authMode === 'otp' ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                10-Digit Mobile Number <span className="text-amber-700">*</span>
              </label>
              <div className="relative flex rounded-xl border border-gray-200 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-100 overflow-hidden bg-white">
                <div className="bg-gray-50 px-3 py-2.5 border-r border-gray-200 text-xs font-bold text-gray-600 flex items-center gap-1 shrink-0">
                  <span>🇮🇳 +91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading || mobile.length < 10}
                    className="px-3 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border-l border-amber-200 transition-colors disabled:opacity-50"
                  >
                    Send OTP
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                OTP will be sent via SMS & WhatsApp to your verified number.
              </p>
            </div>

            {/* OTP input if sent */}
            {otpSent && (
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-950">
                    Enter 6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[11px] font-bold text-amber-700 hover:underline"
                  >
                    Resend Code
                  </button>
                </div>
                <OTPInput
                  value={otpCode}
                  onChange={setOtpCode}
                  disabled={isLoading}
                />
                <p className="text-[10px] text-amber-700 font-semibold">
                  Demo auto-fill: Use <span className="underline font-bold">123456</span> to enter immediately.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email / Mobile Number <span className="text-amber-700">*</span>
              </label>
              <input
                type="text"
                placeholder="rajesh.farmer@kisankart.in or 9876543210"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <PasswordInput
              label="Password"
              placeholder="Enter your account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-amber-700 focus:ring-amber-500"
                />
                <span>Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="font-bold text-amber-800 hover:text-amber-900 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        )}

        {/* Primary Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#994200] hover:bg-[#7A3400] text-white font-bold text-sm h-11 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
        >
          {isLoading ? (
            <LoadingButtonState text="Signing you in..." />
          ) : (
            <>
              <span>Continue to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        {/* Government / Social Single Sign-On */}
        <div className="pt-2">
          <div className="relative flex items-center justify-center mb-3">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider shrink-0">
              or authenticate with government ID
            </span>
            <div className="border-t border-gray-200 w-full" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setSuccess('Connecting to DigiLocker Aadhaar/Kisan registry...');
                setTimeout(() => {
                  login({ identifier: 'digilocker@gov.in', role, isOtpMode: true, otp: '123456' });
                  router.push(role === 'FARMER' ? '/farmer/dashboard' : '/buyer/dashboard');
                }, 1000);
              }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
            >
              <span className="text-amber-700 font-bold">🏛 DigiLocker</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSuccess('Authenticating via Google Workspace...');
                setTimeout(() => {
                  login({ identifier: 'google.user@gmail.com', role, isOtpMode: true, otp: '123456' });
                  router.push(role === 'FARMER' ? '/farmer/dashboard' : '/buyer/dashboard');
                }, 1000);
              }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
            >
              <span className="font-bold">Google</span>
            </button>
          </div>
        </div>

        {/* Bottom Signup Link */}
        <div className="pt-3 border-t border-gray-100 text-center text-xs font-medium text-gray-600">
          <span>New to KisanKart? </span>
          <Link
            href="/signup"
            className="font-bold text-amber-800 hover:text-amber-950 underline underline-offset-2 ml-1"
          >
            Create an Account / Register as Farmer or Buyer →
          </Link>
        </div>

      </form>
    </div>
  );
}
