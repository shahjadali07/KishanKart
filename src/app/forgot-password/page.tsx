'use client';

import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      heroBadge="SECURE ACCOUNT RECOVERY"
      heroTitle={
        <>
          Restore Access to Your Mandi Trading Desk.
        </>
      }
      heroDescription="We verify your registered identity against verified mobile/email records to ensure safe trading account recovery."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
