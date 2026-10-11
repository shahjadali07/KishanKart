'use client';

import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { VerifyOTPForm } from '@/components/auth/VerifyOTPForm';

export default function VerifyPage() {
  return (
    <AuthLayout
      heroBadge="TWO-FACTOR TRADE VERIFICATION"
      heroTitle={
        <>
          Government Guidelines Two-Factor Authentication.
        </>
      }
      heroDescription="Authenticating your phone number guarantees verified farm-gate weighbridge tare slips and seamless direct bank deposits."
    >
      <VerifyOTPForm />
    </AuthLayout>
  );
}
