'use client';

import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      heroBadge="CREDENTIAL SECURITY"
      heroTitle={
        <>
          Set a Strong Password for Your KisanKart Account.
        </>
      }
      heroDescription="Protect your direct escrow payouts, dispatch passes, and harvest bids with high-strength authentication."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
