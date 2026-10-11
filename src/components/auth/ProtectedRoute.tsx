'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Unauthenticated user -> redirect to /login
        router.replace('/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // User is authenticated but unauthorized for this role -> redirect to their own dashboard
        if (user.role === 'FARMER') {
          router.replace('/farmer/dashboard');
        } else if (user.role === 'BUYER') {
          router.replace('/buyer/dashboard');
        } else if (user.role === 'ADMIN') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/login');
        }
      }
    }
  }, [user, isLoading, allowedRoles, router]);

  // Loading state while verifying auth session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center animate-spin">
          <Loader2 className="h-5 w-5" />
        </div>
        <p className="text-xs font-semibold text-gray-500">
          Checking KisanKart authentication credentials...
        </p>
      </div>
    );
  }

  // Not logged in or unauthorized for this route
  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center animate-spin">
          <Loader2 className="h-5 w-5" />
        </div>
        <p className="text-xs font-semibold text-gray-500">
          Redirecting to authorized dashboard...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
