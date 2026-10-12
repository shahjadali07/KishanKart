'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthError, AuthSuccess, LoadingButtonState } from './AuthFeedback';
import { useAuth } from '@/context/AuthContext';

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setError('Please enter your registered email or mobile number.');
      return;
    }
    setError('');
    setIsLoading(true);

    const result = await forgotPassword(identifier);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Could not send the reset link. Please try again.');
      return;
    }
    setSent(true);
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
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Forgot Password?
        </h2>
        <p className="text-xs text-gray-500 font-medium mt-1">
          Enter your registered email or mobile number to reset your password.
        </p>
      </div>

      <AuthError message={error} />

      {sent ? (
        <div className="p-6 bg-amber-50/70 rounded-2xl border border-amber-200 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Reset Instructions Sent!</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            We have dispatched a password reset link and SMS code to <strong className="text-gray-900">{identifier}</strong>.
          </p>
          <div className="pt-2">
            <Link
              href="/reset-password"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-white px-4 py-2 rounded-xl border border-amber-300 hover:bg-amber-50 shadow-2xs transition-colors"
            >
              <span>Proceed to Reset Password</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email / Mobile Number <span className="text-amber-700">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. rajesh.farmer@kisankart.in or 9876543210"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#994200] hover:bg-[#7A3400] text-white font-bold text-sm h-11 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <LoadingButtonState text="Sending reset link..." />
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <div className="text-center text-xs font-medium text-gray-500 pt-2">
            <span>Remembered your password? </span>
            <Link href="/login" className="font-bold text-amber-800 hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      )}

    </div>
  );
}
