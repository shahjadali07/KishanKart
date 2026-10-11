'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'FARMER') {
        router.replace('/farmer/dashboard');
      } else if (user.role === 'BUYER') {
        router.replace('/buyer/dashboard');
      } else if (user.role === 'ADMIN') {
        router.replace('/admin/dashboard');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center animate-spin">
          <Loader2 className="h-5 w-5" />
        </div>
        <p className="text-xs font-semibold text-gray-500">
          Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <AuthLayout
      heroBadge="CONNECTING 120,000+ VERIFIED FARMERS & BUYERS"
      heroTitle={
        <>
          Fair Mandi Prices. Direct Disintermediation. Instant Escrow Payouts.
        </>
      }
      heroDescription="India's most trusted agrarian trade infrastructure connecting farm-gate harvests with institutional commodity buyers, FPOs, and retailers."
    >
      <LoginForm />
    </AuthLayout>
  );
}
