// ==============================================================================
// ANURGO STUDIO — CLIENT & ADMIN AUTHENTICATION CONTEXT
// ==============================================================================
// Manages authentication state, JWT tokens, modal visibility for Client and
// Administration portals, and active session verification.
// ==============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  userId: string;
  email: string;
  fullName: string;
  role?: string;
  isEmailVerified: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authModalOpen: boolean;
  authModalView: 'login' | 'signup' | 'verify' | 'forgot' | 'reset';
  dashboardModalOpen: boolean;
  adminDashboardOpen: boolean;
  verifyEmailTarget: string;
  openAuthModal: (view?: 'login' | 'signup' | 'verify' | 'forgot' | 'reset', email?: string) => void;
  closeAuthModal: () => void;
  openDashboard: () => void;
  closeDashboard: () => void;
  openAdminDashboard: () => void;
  closeAdminDashboard: () => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string; unverified?: boolean; isAdmin?: boolean }>;
  signup: (fullName: string, email: string, pass: string, confirm: string) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean; devCode?: string }>;
  confirmEmailOtp: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; devCode?: string }>;
  resetPasswordWithOtp: (email: string, code: string, pass: string, confirm: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'anurgo_client_jwt';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup' | 'verify' | 'forgot' | 'reset'>('login');
  const [verifyEmailTarget, setVerifyEmailTarget] = useState<string>('');
  const [dashboardModalOpen, setDashboardModalOpen] = useState<boolean>(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState<boolean>(false);

  // Validate existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            setToken(storedToken);
          } else {
            localStorage.removeItem(TOKEN_KEY);
            setUser(null);
            setToken(null);
          }
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.warn('Network error checking auth session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      }
    } catch {}
  };

  const openAuthModal = (view: 'login' | 'signup' | 'verify' | 'forgot' | 'reset' = 'login', email: string = '') => {
    setAuthModalView(view);
    if (email) setVerifyEmailTarget(email);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const openDashboard = () => {
    setDashboardModalOpen(true);
  };

  const closeDashboard = () => {
    setDashboardModalOpen(false);
  };

  const openAdminDashboard = () => {
    setAdminDashboardOpen(true);
  };

  const closeAdminDashboard = () => {
    setAdminDashboardOpen(false);
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setUser(data.user);
        closeAuthModal();

        // If logged in user is admin, immediately open the Admin Dashboard!
        if (data.user?.role === 'admin') {
          setAdminDashboardOpen(true);
          return { success: true, isAdmin: true };
        } else {
          setDashboardModalOpen(true);
          return { success: true, isAdmin: false };
        }
      } else {
        if (data.unverified) {
          setVerifyEmailTarget(email);
          setAuthModalView('verify');
        }
        return { success: false, error: data.error || 'Login failed.', unverified: data.unverified };
      }
    } catch (err: any) {
      return { success: false, error: 'Connection error while logging in.' };
    }
  };

  const signup = async (fullName: string, email: string, pass: string, confirm: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password: pass, confirmPassword: confirm }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setVerifyEmailTarget(email);
        setAuthModalView('verify');
        return { success: true, requiresVerification: true, devCode: data.devCode };
      } else {
        return { success: false, error: data.error || 'Signup failed.' };
      }
    } catch (err: any) {
      return { success: false, error: 'Connection error while creating account.' };
    }
  };

  const confirmEmailOtp = async (email: string, code: string) => {
    try {
      const res = await fetch('/api/verify/email/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAuthModalView('login');
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid or expired verification code.' };
      }
    } catch (err: any) {
      return { success: false, error: 'Network error verifying code.' };
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setVerifyEmailTarget(email);
        setAuthModalView('reset');
        return { success: true, devCode: data.devCode };
      } else {
        return { success: false, error: data.error || 'Failed to request reset code.' };
      }
    } catch (err: any) {
      return { success: false, error: 'Network error requesting password reset.' };
    }
  };

  const resetPasswordWithOtp = async (email: string, code: string, pass: string, confirm: string) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword: pass, confirmPassword: confirm }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAuthModalView('login');
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to reset password.' };
      }
    } catch (err: any) {
      return { success: false, error: 'Network error resetting password.' };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setDashboardModalOpen(false);
    setAdminDashboardOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin',
        authModalOpen,
        authModalView,
        dashboardModalOpen,
        adminDashboardOpen,
        verifyEmailTarget,
        openAuthModal,
        closeAuthModal,
        openDashboard,
        closeDashboard,
        openAdminDashboard,
        closeAdminDashboard,
        login,
        signup,
        confirmEmailOtp,
        requestPasswordReset,
        resetPasswordWithOtp,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
