'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordInput, PasswordStrength } from './PasswordInput';
import { AuthError, AuthSuccess, LoadingButtonState } from './AuthFeedback';
import { useAuth } from '@/context/AuthContext';

export function ResetPasswordForm() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Read the reset token from the URL once mounted (avoids blocking prerender).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token') || '');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(token, password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Could not reset the password. The link may have expired.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/login');
    }, 1500);
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
          Reset Your Password
        </h2>
        <p className="text-xs text-gray-500 font-medium mt-1">
          Create a strong and secure new password for your KisanKart account.
        </p>
      </div>

      <AuthError message={error} />

      {success ? (
        <div className="p-6 bg-amber-50/70 rounded-2xl border border-amber-200 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Password Reset Successful!</h3>
          <p className="text-xs text-gray-600">
            Your new password has been saved. Redirecting to login...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordStrength password={password} />
          </div>

          <div>
            <PasswordInput
              label="Confirm New Password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#994200] hover:bg-[#7A3400] text-white font-bold text-sm h-11 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <LoadingButtonState text="Updating password..." />
            ) : (
              <>
                <span>Reset Password</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      )}

    </div>
  );
}
