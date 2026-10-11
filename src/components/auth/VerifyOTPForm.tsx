'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ShieldCheck, ArrowRight, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OTPInput } from './OTPInput';
import { AuthError, AuthSuccess, LoadingButtonState } from './AuthFeedback';
import { useAuth } from '@/context/AuthContext';

export function VerifyOTPForm() {
  const router = useRouter();
  const { verifyOtp, pendingVerification } = useAuth();

  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const targetIdentifier = pendingVerification?.identifier || '98765 43210';
  const role = pendingVerification?.role || 'FARMER';

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(30);
    setSuccess('New 6-digit verification code sent via SMS & WhatsApp.');
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setError('');
    setIsLoading(true);
    const res = await verifyOtp(otpCode);
    setIsLoading(false);

    if (res.success) {
      setSuccess('Account verified successfully! Directing to dashboard...');
      setTimeout(() => {
        if (role === 'FARMER') router.push('/farmer/dashboard');
        else if (role === 'BUYER') router.push('/buyer/dashboard');
        else router.push('/admin/dashboard');
      }, 800);
    } else {
      setError(res.error || 'Invalid OTP code. Try demo code 123456.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-200/70 p-6 sm:p-8 shadow-xs">
      
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Login</span>
      </Link>

      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Verify Your Account
          </h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDF4EA] text-[#8C3A00] border border-amber-200">
            Govt. OTP
          </span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          We&apos;ve sent a verification code to your registered contact <strong className="text-gray-900">{targetIdentifier}</strong>.
        </p>
      </div>

      <AuthError message={error} />
      <AuthSuccess message={success} />

      <form onSubmit={handleVerify} className="space-y-5">
        
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
          <label className="block text-xs font-bold text-gray-800 text-center">
            Enter 6-Digit Code
          </label>

          <OTPInput
            value={otpCode}
            onChange={setOtpCode}
            disabled={isLoading}
          />

          <div className="flex items-center justify-between text-xs pt-1 px-1">
            <span className="text-gray-500 font-medium">
              Demo Code: <strong className="text-amber-800 underline">123456</strong>
            </span>

            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCw className="h-3 w-3" />
                <span>Resend Code</span>
              </button>
            ) : (
              <span className="text-gray-400 font-medium">
                Resend available in <strong className="text-gray-700">{countdown}s</strong>
              </span>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || otpCode.length !== 6}
          className="w-full bg-[#994200] hover:bg-[#7A3400] text-white font-bold text-sm h-11 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {isLoading ? (
            <LoadingButtonState text="Verifying authentication..." />
          ) : (
            <>
              <span>Verify & Continue to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-[11px] text-amber-800 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
          <span>Verified under National Agriculture Digital Trade Security Guidelines.</span>
        </div>

      </form>

    </div>
  );
}
