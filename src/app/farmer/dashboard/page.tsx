'use client';

import React from 'react';
import { FarmerDashboard } from '@/components/farmer/FarmerDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function FarmerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['FARMER']}>
      <FarmerDashboard />
    </ProtectedRoute>
  );
}
