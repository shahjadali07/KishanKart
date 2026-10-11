'use client';

import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <AuthLayout
      heroBadge="NEW PRODUCER & BUYER ONBOARDING"
      heroTitle={
        <>
          Direct Trade. Zero Commission. Guaranteed Digital Payments.
        </>
      }
      heroDescription="Join thousands of Indian farmers and businesses trading quality agri-commodities with verified weighbridges, lab grading, and instant escrow settlements."
    >
      <SignupForm />
    </AuthLayout>
  );
}
