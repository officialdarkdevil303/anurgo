// ==============================================================================
// ANURGO STUDIO — CLIENT AUTHENTICATION MODAL
// ==============================================================================
// Luxury dark-mode modal for Sign In, Sign Up, Email OTP Verification,
// and Password Reset flows tailored to ANURGO's editorial aesthetic.
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalView,
    verifyEmailTarget,
    closeAuthModal,
    openAuthModal,
    login,
    signup,
    confirmEmailOtp,
    requestPasswordReset,
    resetPasswordWithOtp,
  } = useAuth();

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  
  // UI states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Sync email target when entering verify mode
  useEffect(() => {
    if (verifyEmailTarget) {
      setEmail(verifyEmailTarget);
    }
  }, [verifyEmailTarget]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && authModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Clear messages on view change
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [authModalView]);

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || 'Login failed.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const res = await signup(fullName, email, password, confirmPassword);
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || 'Signup failed.');
    } else {
      if (res.devCode) {
        setDevCode(res.devCode);
      }
      setResendCooldown(60);
      setSuccess('Verification code sent! Please check your email inbox.');
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    const res = await confirmEmailOtp(email, otpCode.trim());
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || 'Invalid code.');
    } else {
      setSuccess('Email verified successfully! You can now log in.');
      setDevCode(null);
      setTimeout(() => {
        openAuthModal('login', email);
      }, 1500);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    try {
      const res = await fetch('/api/verify/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.devCode) {
          setDevCode(data.devCode);
        }
        setResendCooldown(60);
        setSuccess('A new 6-digit code has been sent to your email.');
      } else {
        setError(data.error || 'Failed to resend code.');
      }
    } catch {
      setError('Connection error requesting new code.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    const res = await requestPasswordReset(email);
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || 'Failed to request reset code.');
    } else {
      if (res.devCode) {
        setDevCode(res.devCode);
      }
      setResendCooldown(60);
      setSuccess('Reset code sent! Check your email.');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const res = await resetPasswordWithOtp(email, otpCode.trim(), password, confirmPassword);
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || 'Failed to reset password.');
    } else {
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        openAuthModal('login', email);
      }, 1500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-md rounded-[32px] bg-[#0E121C] border border-[#D7E2EA]/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-6 sm:p-8 overflow-hidden z-10"
        >
          {/* Top Decorative Amber Light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_15px_rgba(255,84,0,0.8)]" />

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-xl bg-[#161B26] hover:bg-[#202738] text-[#D7E2EA]/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Title */}
          <div className="text-center space-y-1.5 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-[10px] font-mono text-orange-400 font-bold tracking-widest uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ANURGO Studio Client Portal</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans">
              {authModalView === 'login' && 'Sign In to Account'}
              {authModalView === 'signup' && 'Create Client Account'}
              {authModalView === 'verify' && 'Verify Your Email'}
              {authModalView === 'forgot' && 'Reset Password'}
              {authModalView === 'reset' && 'Set New Password'}
            </h3>
            <p className="text-xs text-[#D7E2EA]/60 font-sans">
              {authModalView === 'login' && 'Access your submitted project briefs and progress status'}
              {authModalView === 'signup' && 'Register to manage project inquiries and review deliverables'}
              {authModalView === 'verify' && `Enter the 6-digit security code sent to ${email}`}
              {authModalView === 'forgot' && 'We will send a 6-digit reset code to your registered email'}
              {authModalView === 'reset' && 'Enter your reset code and choose a new secure password'}
            </p>
          </div>

          {/* Alerts: Error & Success */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{success}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW: LOGIN */}
          {/* ============================================================== */}
          {authModalView === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Admin Portal Shortcut Card */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/25 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-amber-300 font-mono text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold">ADMIN PORTAL</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('Administration');
                    setPassword('Nehanurag__0308');
                    setError(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-mono text-[10px] font-bold uppercase transition-all cursor-pointer hover:border-amber-400"
                >
                  Fill Admin
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#D7E2EA]/70 uppercase tracking-wider">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D7E2EA]/40" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@company.com or Administration"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141824] border border-[#D7E2EA]/15 text-sm text-white placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-[#D7E2EA]/70 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => openAuthModal('forgot', email)}
                    className="text-[11px] font-mono text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D7E2EA]/40" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141824] border border-[#D7E2EA]/15 text-sm text-white placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,84,0,0.3)] transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'SIGN IN TO PORTAL'}
                {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
              </button>

              <div className="pt-2 text-center text-xs text-[#D7E2EA]/60">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('signup', email)}
                  className="font-bold text-orange-400 hover:text-orange-300 cursor-pointer transition-colors"
                >
                  Create one here
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* VIEW: SIGNUP */}
          {/* ============================================================== */}
          {authModalView === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-mono text-[#D7E2EA]/70 uppercase tracking-wider">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D7E2EA]/40" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141824] border border-[#D7E2EA]/15 text-sm text-white placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[#D7E2EA]/70 uppercase tracking-wider">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D7E2EA]/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Permanent business or personal email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141824] border border-[#D7E2EA]/15 text-sm text-white placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#D7E2EA]/70 uppercase tracking-wider">Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141824] border border-[#D7E2EA]/15 text-sm text-white placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#D7E2EA]/70 uppercase tracking-wider">Confirm *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141824] border border-[#D7E2EA]/15 text-sm text-white placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,84,0,0.3)] transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'CREATE ACCOUNT & VERIFY'}
                {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
              </button>

              <div className="pt-2 text-center text-xs text-[#D7E2EA]/60">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login', email)}
                  className="font-bold text-orange-400 hover:text-orange-300 cursor-pointer transition-colors"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* VIEW: EMAIL VERIFICATION */}
          {/* ============================================================== */}
          {authModalView === 'verify' && (
            <form onSubmit={handleVerifySubmit} className="space-y-5">
              {devCode && (
                <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between gap-2 animate-fadeIn">
                  <div className="text-xs font-mono text-orange-400">
                    <span>💡 Verification Code: </span>
                    <span className="font-bold text-white tracking-widest text-sm">{devCode}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpCode(devCode)}
                    className="px-3 py-1.5 rounded-xl bg-orange-500 text-black font-mono font-bold text-[10px] uppercase hover:bg-orange-400 transition-colors cursor-pointer"
                  >
                    Auto-fill
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-mono text-[#D7E2EA]/70 uppercase tracking-wider block text-center">
                  6-Digit Security Code
                </label>
                <div className="relative max-w-[240px] mx-auto">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="••••••"
                    className="w-full text-center tracking-[12px] text-2xl font-mono py-3 rounded-2xl bg-[#141824] border-2 border-orange-500/50 text-orange-400 placeholder:text-[#D7E2EA]/20 focus:outline-none focus:border-orange-400 transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otpCode.length !== 6}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,84,0,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'VERIFY & ACTIVATE ACCOUNT'}
              </button>

              <div className="flex items-center justify-between text-xs text-[#D7E2EA]/60 pt-1">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                  className="text-orange-400 hover:text-orange-300 disabled:text-[#D7E2EA]/30 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? '' : 'hover:rotate-180 transition-transform'}`} />
                  <span>{resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => openAuthModal('login', email)}
                  className="hover:text-white cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* VIEW: FORGOT PASSWORD */}
          {/* ============================================================== */}
          {authModalView === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#D7E2EA]/70 uppercase tracking-wider">Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D7E2EA]/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141824] border border-[#D7E2EA]/15 text-sm text-white placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,84,0,0.3)] transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'SEND RESET CODE'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => openAuthModal('login', email)}
                  className="text-xs font-mono text-[#D7E2EA]/60 hover:text-white cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* VIEW: RESET PASSWORD WITH OTP */}
          {/* ============================================================== */}
          {authModalView === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-3.5">
              {devCode && (
                <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between gap-2 animate-fadeIn">
                  <div className="text-xs font-mono text-orange-400">
                    <span>💡 Reset Code: </span>
                    <span className="font-bold text-white tracking-widest text-sm">{devCode}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpCode(devCode)}
                    className="px-3 py-1.5 rounded-xl bg-orange-500 text-black font-mono font-bold text-[10px] uppercase hover:bg-orange-400 transition-colors cursor-pointer"
                  >
                    Auto-fill
                  </button>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-mono text-[#D7E2EA]/70 uppercase tracking-wider">6-Digit Reset Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter 6-digit code"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141824] border border-[#D7E2EA]/15 text-sm text-white font-mono placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[#D7E2EA]/70 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D7E2EA]/40" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141824] border border-[#D7E2EA]/15 text-sm text-white placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[#D7E2EA]/70 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D7E2EA]/40" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141824] border border-[#D7E2EA]/15 text-sm text-white placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,84,0,0.3)] transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'UPDATE PASSWORD'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
