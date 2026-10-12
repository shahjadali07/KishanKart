'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/services/api';

export type UserRole = 'FARMER' | 'BUYER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  location?: string;
  avatar?: string;
  token?: string;
  details?: Record<string, any>;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { identifier: string; password?: string; otp?: string; role: UserRole; isOtpMode?: boolean }) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  verifyOtp: (code: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (identifier: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string }>;
  pendingVerification: { identifier: string; role: UserRole; name?: string; details?: any } | null;
  setPendingVerification: (data: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingVerification, setPendingVerification] = useState<any>(null);
  const router = useRouter();

  // Rehydrate session from localStorage on initial load / refresh
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('kisankart_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.role) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse auth user session:', e);
      localStorage.removeItem('kisankart_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async ({
    identifier,
    password,
    otp,
    role,
    isOtpMode
  }: {
    identifier: string;
    password?: string;
    otp?: string;
    role: UserRole;
    isOtpMode?: boolean;
  }) => {
    setIsLoading(true);

    try {
      // 1. Mobile OTP Mode
      if (isOtpMode) {
        await new Promise((res) => setTimeout(res, 600));

        if (!identifier || identifier.length < 10) {
          setIsLoading(false);
          return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
        }

        if (otp !== '123456' && otp?.length !== 6) {
          setIsLoading(false);
          return { success: false, error: 'Invalid verification code. Please enter 123456.' };
        }

        const authenticatedUser: User = {
          id: 'usr_' + Date.now(),
          name: role === 'FARMER' ? 'Rajesh Kumar' : role === 'BUYER' ? 'Sharma Foods Ltd.' : 'Mandi Administrator',
          email: identifier.includes('@') ? identifier : `${role.toLowerCase()}@kisankart.in`,
          phone: identifier.replace(/[^0-9]/g, ''),
          role,
          location: 'Bakshi Ka Talab Farm-Gate, Lucknow',
          isVerified: true,
          avatar: role === 'FARMER' ? 'RK' : role === 'BUYER' ? 'SF' : 'AD',
        };

        setUser(authenticatedUser);
        localStorage.setItem('kisankart_user', JSON.stringify(authenticatedUser));
        setIsLoading(false);
        return { success: true };
      }

      // 2. Email / Password Mode
      if (!identifier) {
        setIsLoading(false);
        return { success: false, error: 'Please enter your registered email or mobile number.' };
      }

      if (!password || password.length < 6) {
        setIsLoading(false);
        return { success: false, error: 'Password must be at least 6 characters.' };
      }

      // Primary path: real backend authentication.
      // When the backend is reachable we trust its verdict (success OR failure);
      // the local demo fallback only applies when the server is unreachable.
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: { email: identifier, password },
        token: null,
      });

      if (response.status !== 0) {
        // Backend responded — honour its answer instead of silently succeeding.
        if (response.ok && response.data?.success && response.data?.data) {
          const result = response.data.data;
          const apiUser: User = {
            id: result._id || result.id || 'usr_' + Date.now(),
            name: result.name || identifier,
            email: result.email || identifier,
            phone: result.phone,
            role: (result.role as UserRole) || role,
            isVerified: true,
            token: result.token,
            location: result.location || 'Lucknow Mandi Cluster',
            avatar: role === 'FARMER' ? 'RK' : role === 'BUYER' ? 'SF' : 'AD',
          };

          setUser(apiUser);
          localStorage.setItem('kisankart_user', JSON.stringify(apiUser));
          setIsLoading(false);
          return { success: true };
        }

        setIsLoading(false);
        return {
          success: false,
          error: response.error?.message || 'Invalid email or password.',
        };
      }

      // Backend unreachable — validated local mock authentication for demo / dev.
      await new Promise((res) => setTimeout(res, 700));

      const authenticatedUser: User = {
        id: 'usr_' + Date.now(),
        name: role === 'FARMER' ? 'Rajesh Kumar' : role === 'BUYER' ? 'Sharma Foods Ltd.' : 'Mandi Administrator',
        email: identifier.includes('@') ? identifier : `${role.toLowerCase()}@kisankart.in`,
        phone: !identifier.includes('@') ? identifier : '9876543210',
        role,
        location: 'Bakshi Ka Talab Farm-Gate, Lucknow',
        isVerified: true,
        avatar: role === 'FARMER' ? 'RK' : role === 'BUYER' ? 'SF' : 'AD',
      };

      setUser(authenticatedUser);
      localStorage.setItem('kisankart_user', JSON.stringify(authenticatedUser));
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err?.message || 'Invalid email/phone or password.' };
    }
  };

  const signup = async (userData: any) => {
    setIsLoading(true);

    // Primary path: create the account on the backend immediately.
    // The backend has no OTP step, so the OTP screen that follows is a
    // confirmation step over an already-created account.
    const response = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: userData.name || userData.businessName,
        email: userData.email,
        phone: String(userData.phone || '').replace(/\D/g, ''),
        password: userData.password,
        role: userData.role,
        location: userData.location || userData.district || '',
        ...(userData.role === 'FARMER'
          ? {
              farmDetails: {
                village: userData.village,
                district: userData.district,
                state: userData.state,
                pinCode: userData.pinCode,
                farmSize: userData.farmSize,
                farmType: userData.farmType,
                crops: userData.crops,
              },
            }
          : {}),
        ...(userData.role === 'BUYER'
          ? {
              businessDetails: {
                businessName: userData.businessName,
                businessType: userData.businessType,
                gstNumber: userData.gstNumber,
                city: userData.city,
                address: userData.address,
              },
            }
          : {}),
      },
      token: null,
    });

    if (response.ok && response.data?.success && response.data?.data) {
      const created = response.data.data;
      setPendingVerification({
        identifier: userData.phone || userData.email,
        role: userData.role,
        name: created.name || userData.name || userData.businessName,
        details: { ...userData, registered: true },
        apiUser: {
          id: created._id || created.id,
          name: created.name,
          email: created.email,
          phone: created.phone,
          role: created.role,
          location: created.location,
          token: created.token,
        },
      });
      setIsLoading(false);
      return { success: true };
    }

    // Backend unreachable (status 0) -> fall back to the local OTP demo flow.
    // Any other backend error is reported to the caller.
    if (response.status !== 0) {
      setIsLoading(false);
      const message =
        response.error?.errors && Object.keys(response.error.errors).length > 0
          ? Object.values(response.error.errors).flat().join(' ')
          : response.error?.message || 'Registration failed.';
      return { success: false, error: message };
    }

    await new Promise((res) => setTimeout(res, 800));

    setPendingVerification({
      identifier: userData.phone || userData.email,
      role: userData.role,
      name: userData.name || userData.businessName,
      details: userData,
    });

    setIsLoading(false);
    return { success: true };
  };

  const verifyOtp = async (code: string) => {
    setIsLoading(true);

    // Account was already created on the backend during signup;
    // this step just completes the UI verification flow.
    if (pendingVerification?.details?.registered && pendingVerification?.apiUser) {
      const apiUser = pendingVerification.apiUser;
      const newUser: User = {
        id: apiUser.id || 'usr_' + Date.now(),
        name: apiUser.name || pendingVerification.name || 'KisanKart User',
        email: apiUser.email || '',
        phone: apiUser.phone,
        role: (apiUser.role as UserRole) || pendingVerification.role,
        location: apiUser.location || 'Lucknow',
        isVerified: true,
        token: apiUser.token,
        avatar: pendingVerification.role === 'FARMER' ? 'RK' : 'SF',
      };
      setUser(newUser);
      localStorage.setItem('kisankart_user', JSON.stringify(newUser));
      setPendingVerification(null);
      setIsLoading(false);
      return { success: true };
    }

    await new Promise((res) => setTimeout(res, 600));

    if (code !== '123456' && code.length !== 6) {
      setIsLoading(false);
      return { success: false, error: 'Invalid OTP code. Please enter 123456.' };
    }

    if (pendingVerification) {
      const newUser: User = {
        id: 'usr_' + Date.now(),
        name: pendingVerification.name || (pendingVerification.role === 'FARMER' ? 'Rajesh Kumar' : 'Sharma Foods'),
        email: pendingVerification.details?.email || `${pendingVerification.role.toLowerCase()}@kisankart.in`,
        phone: pendingVerification.identifier,
        role: pendingVerification.role,
        location: pendingVerification.details?.district
          ? `${pendingVerification.details.village || ''} ${pendingVerification.details.district}, ${pendingVerification.details.state || 'UP'}`.trim()
          : 'Bakshi Ka Talab, Lucknow',
        isVerified: true,
        details: pendingVerification.details,
        avatar: pendingVerification.role === 'FARMER' ? 'RK' : 'SF',
      };

      setUser(newUser);
      localStorage.setItem('kisankart_user', JSON.stringify(newUser));
      setPendingVerification(null);
    }

    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    // Fire-and-forget: clear the server session when the backend is reachable.
    apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    setUser(null);
    localStorage.removeItem('kisankart_user');
    router.replace('/login');
  };

  const forgotPassword = async (identifier: string) => {
    const response = await apiFetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { identifier },
      token: null,
    });

    if (response.status !== 0) {
      if (response.ok) {
        return { success: true };
      }
      return { success: false, error: response.error?.message || 'Could not send reset link.' };
    }

    // Backend unreachable — simulate success for the demo flow.
    await new Promise((res) => setTimeout(res, 800));
    return { success: true };
  };

  const resetPassword = async (token: string, password: string) => {
    const response = await apiFetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token, password },
      token: null,
    });

    if (response.status !== 0) {
      if (response.ok) {
        return { success: true };
      }
      return { success: false, error: response.error?.message || 'Invalid or expired reset token.' };
    }

    // Backend unreachable — simulate success for the demo flow.
    await new Promise((res) => setTimeout(res, 700));
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        verifyOtp,
        forgotPassword,
        resetPassword,
        pendingVerification,
        setPendingVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
