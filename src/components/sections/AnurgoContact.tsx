// ==============================================================================
// ANURGO STUDIO — PROJECT BRIEF INITIATION SECTION
// ==============================================================================
// Production-ready client acquisition pipeline featuring multi-tier validation,
// disposable email blocking, phone & email OTP verification, compact pre-submit
// confirmation step, and automated backend submission with ANR-XXXX tracking.
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Mail, 
  Check, 
  Copy, 
  ExternalLink, 
  CheckCircle2, 
  Phone, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Lock,
  RefreshCw,
  Edit3,
  Send,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FadeIn } from '../common/FadeIn';
import { ANURGO_BRAND } from '../../data/anurgoData';
import { useAuth } from '../../context/AuthContext';

interface AnurgoContactProps {
  initialServiceOrProject?: string;
}

// Client-side quick list of disposable domains to give immediate feedback
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com', 'tempmail.net', '10minutemail.com', '10minutemail.net',
  'mailinator.com', 'guerrillamail.com', 'throwawaymail.com', 'yopmail.com',
  'trashmail.com', 'burnermail.io', 'sharklasers.com', 'getnada.com',
  'dispostable.com', 'inboxkitten.com', 'dropmail.me'
]);

export const AnurgoContact: React.FC<AnurgoContactProps> = ({ initialServiceOrProject }) => {
  const { user, token, isAuthenticated, openAuthModal, openDashboard } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    businessName: '',
    phone: '',
    projectType: 'Landing Page / Single Page',
    budget: "Flexible / Let's Discuss",
    timeline: '1–2 Weeks',
    details: initialServiceOrProject ? `Interested in discussing: ${initialServiceOrProject}` : '',
  });

  const [customBudget, setCustomBudget] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [copiedSubmissionId, setCopiedSubmissionId] = useState(false);
  
  // Verification states
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifyingTarget, setVerifyingTarget] = useState<'email' | 'phone' | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);

  // Pipeline states
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submissionData, setSubmissionData] = useState<{
    submissionId: string;
    details: string;
    whatsappUrl?: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill and mark email verified if user is authenticated
  useEffect(() => {
    if (user && isAuthenticated) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName,
        email: prev.email || user.email,
      }));
      if (user.isEmailVerified) {
        setEmailVerified(true);
      }
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (initialServiceOrProject) {
      setFormData((prev) => ({
        ...prev,
        details: prev.details ? prev.details : `Interested in discussing: ${initialServiceOrProject}`,
      }));
    }
  }, [initialServiceOrProject]);

  // Resend cooldown timer
  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  // Client-Side Validation with Spam / Gibberish Heuristics
  const validate = () => {
    const errs: Record<string, string> = {};

    // 1. Full name
    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your name';
    }

    // 2. Email & Disposable email check
    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      errs.email = 'Please enter a valid email address';
    } else {
      const domain = cleanEmail.split('@')[1];
      if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
        errs.email = 'Please use a permanent email address. Temporary or disposable email addresses are not accepted.';
      }
    }

    // 3. Business Name
    if (!formData.businessName.trim()) {
      errs.businessName = 'Please enter your business or project name';
    }

    // 4. Phone Validation
    const cleanPhone = formData.phone.replace(/[^0-9+]/g, '');
    const rawDigits = cleanPhone.replace(/\+/g, '');
    if (!cleanPhone || rawDigits.length < 8 || rawDigits.length > 15) {
      errs.phone = 'Please enter a valid phone or WhatsApp number (8–15 digits)';
    } else if (/^(\d)\1{7,}$/.test(rawDigits)) {
      errs.phone = 'Please enter your genuine phone or WhatsApp number';
    }

    // 5. Project Description & Gibberish Heuristics
    const details = formData.details.trim();
    if (!details) {
      errs.details = 'Please describe what you want to build';
    } else if (details.length < 12 || details.split(/\s+/).length < 3) {
      errs.details = 'Please provide a little more detail about your project goals or desired features.';
    } else if (/(.)\1{4,}/i.test(details)) {
      errs.details = 'Project description contains repeated characters. Please describe your project requirements clearly.';
    } else {
      const lower = details.toLowerCase();
      const keyboardSmashes = ['asdfgh', 'asdfghjkl', 'qwerty', 'qwertyuiop', 'zxcvbn', 'zxcvbnm'];
      let foundSmash = false;
      for (const smash of keyboardSmashes) {
        if (lower.includes(smash)) {
          errs.details = 'Please enter a genuine project description rather than keyboard smash text.';
          foundSmash = true;
          break;
        }
      }

      if (!foundSmash) {
        // Consonant cluster test
        const words = details.split(/\s+/);
        for (const w of words) {
          const cleanW = w.replace(/[^a-zA-Z]/g, '');
          if (cleanW.length >= 6 && /[bcdfghjklmnpqrstvwxz]{5,}/i.test(cleanW)) {
            errs.details = `The text contains unrecognized or random words ("${w}"). Please describe your project in natural language.`;
            break;
          }
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getEffectiveBudget = () => {
    if (formData.budget === 'Custom Budget') {
      return customBudget.trim() ? `Custom: ${customBudget.trim()}` : 'Custom / To be discussed';
    }
    return formData.budget;
  };

  // Trigger Email OTP Send
  const handleSendEmailOtp = async () => {
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: 'Enter a valid email address first.' }));
      return;
    }
    setOtpLoading(true);
    setOtpError(null);
    setOtpNotice(null);

    try {
      const res = await fetch('/api/verify/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVerifyingTarget('email');
        setOtpCooldown(60);
        setOtpNotice(`6-digit code sent to ${formData.email}.`);
        if (data.devCode) {
          setDevCode(data.devCode);
        }
      } else {
        setOtpError(data.error || 'Failed to send verification code.');
      }
    } catch {
      setOtpError('Network error requesting email code.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Trigger Phone OTP Send
  const handleSendPhoneOtp = async () => {
    const rawDigits = formData.phone.replace(/[^0-9]/g, '');
    if (!formData.phone || rawDigits.length < 8) {
      setErrors((prev) => ({ ...prev, phone: 'Enter a valid phone number first.' }));
      return;
    }
    setOtpLoading(true);
    setOtpError(null);
    setOtpNotice(null);

    try {
      const res = await fetch('/api/verify/phone/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVerifyingTarget('phone');
        setOtpCooldown(60);
        setOtpNotice(`6-digit verification code dispatched to ${formData.phone}.`);
        if (data.devCode) {
          setDevCode(data.devCode);
        }
      } else {
        setOtpError(data.error || 'Failed to send phone code.');
      }
    } catch {
      setOtpError('Network error requesting phone code.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Confirm OTP for either Email or Phone
  const handleConfirmOtp = async () => {
    if (!otpInput || otpInput.trim().length !== 6) {
      setOtpError('Please enter the 6-digit code.');
      return;
    }
    setOtpLoading(true);
    setOtpError(null);

    try {
      if (verifyingTarget === 'email') {
        const res = await fetch('/api/verify/email/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email.trim(), code: otpInput.trim() }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setEmailVerified(true);
          setVerifyingTarget(null);
          setOtpInput('');
          setDevCode(null);
          setOtpNotice('Email verified successfully!');
        } else {
          setOtpError(data.error || 'Invalid code.');
        }
      } else if (verifyingTarget === 'phone') {
        const res = await fetch('/api/verify/phone/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formData.phone.trim(), code: otpInput.trim() }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setPhoneVerified(true);
          setVerifyingTarget(null);
          setOtpInput('');
          setDevCode(null);
          setOtpNotice('Phone number verified successfully!');
        } else {
          setOtpError(data.error || 'Invalid code.');
        }
      }
    } catch {
      setOtpError('Connection error verifying code.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 1: Pre-Submission Review Trigger
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Check if email or phone need verification
    if (!emailVerified) {
      handleSendEmailOtp();
      return;
    }
    if (!phoneVerified) {
      handleSendPhoneOtp();
      return;
    }

    setIsReviewing(true);
  };

  // Step 2: Final Submission to Backend
  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setApiError(null);

    const effectiveBudget = getEffectiveBudget();

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...formData,
          budget: effectiveBudget,
          emailVerified: true,
          phoneVerified: true,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        setIsReviewing(false);

        // Optional secondary WhatsApp link
        const briefText = `*ANURGO STUDIO — PROJECT BRIEF (${data.submissionId})*
----------------------------------------
👤 *Name:* ${formData.fullName.trim()}
🏢 *Brand:* ${formData.businessName.trim()}
🎯 *Type:* ${formData.projectType}
💰 *Budget:* ${effectiveBudget}
⏱️ *Timeline:* ${formData.timeline}
📝 *Goals:* ${formData.details.trim()}
----------------------------------------
Submission ID: ${data.submissionId}`;

        setSubmissionData({
          submissionId: data.submissionId,
          details: formData.details,
          whatsappUrl: `https://wa.me/917991192205?text=${encodeURIComponent(briefText)}`,
        });

        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#FF5400', '#FF7A00', '#FFAA00', '#FFFFFF', '#D7E2EA'],
        });
      } else {
        setApiError(data.error || 'Failed to submit project brief. Please try again.');
        setIsReviewing(false);
      }
    } catch {
      setApiError('Network connection error while submitting brief. Your details are preserved.');
      setIsReviewing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ANURGO_BRAND.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopySubmissionId = () => {
    if (submissionData?.submissionId) {
      navigator.clipboard.writeText(submissionData.submissionId);
      setCopiedSubmissionId(true);
      setTimeout(() => setCopiedSubmissionId(false), 2000);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setIsReviewing(false);
    setApiError(null);
    setCustomBudget('');
    setPhoneVerified(false);
    if (!isAuthenticated) setEmailVerified(false);
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      businessName: '',
      phone: '',
      projectType: 'Landing Page / Single Page',
      budget: "Flexible / Let's Discuss",
      timeline: '1–2 Weeks',
      details: '',
    });
  };

  return (
    <section id="contact" className="relative py-28 sm:py-36 bg-[#0C0C0C] border-t border-[#D7E2EA]/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <FadeIn delay={0} y={20}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161616] border border-[#D7E2EA]/20 text-[10px] sm:text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Initiate Project</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} y={30}>
            <h2
              className="hero-heading font-black uppercase tracking-tight leading-none text-center"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 90px)' }}
            >
              READY TO CREATE <br />
              <span className="text-orange-500">SOMETHING UNFORGETTABLE?</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.2} y={20}>
            <p className="text-[#D7E2EA]/75 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-sans">
              Have an idea, a brand or a project that deserves a better digital experience? Let&apos;s build it.
            </p>
          </FadeIn>
        </div>

        {/* Split Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Channels & Studio Trust */}
          <div className="lg:col-span-5 space-y-6">
            <FadeIn delay={0.25} y={30} className="p-7 sm:p-8 rounded-[36px] bg-[#121212] border border-[#D7E2EA]/15 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                  <MessageSquare className="w-5 h-5 text-orange-400" />
                  <span>Direct Channels</span>
                </h3>
                {isAuthenticated ? (
                  <button
                    onClick={openDashboard}
                    className="text-xs font-mono text-orange-400 hover:text-orange-300 font-bold cursor-pointer"
                  >
                    Client Portal →
                  </button>
                ) : (
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-xs font-mono text-[#D7E2EA]/60 hover:text-white cursor-pointer"
                  >
                    Client Sign In
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {/* WhatsApp Direct */}
                <a
                  href={ANURGO_BRAND.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-2xl bg-[#181818] hover:bg-[#202020] border border-emerald-500/30 hover:border-emerald-400 text-[#D7E2EA] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-emerald-300">
                        Contact via WhatsApp
                      </div>
                      <div className="text-xs text-[#D7E2EA]/60">Direct Studio Channel • Instant Reply</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* Email Direct */}
                <div className="p-4 rounded-2xl bg-[#181818] border border-orange-500/30 flex items-center justify-between gap-2 shadow-lg">
                  <div className="flex items-center gap-3 truncate">
                    <div className="p-2.5 rounded-xl bg-orange-500/15 text-orange-400 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white">Direct Email</div>
                      <a
                        href={`mailto:${ANURGO_BRAND.email}`}
                        className="text-xs font-mono text-[#D7E2EA]/90 hover:text-orange-400 transition-colors truncate block"
                      >
                        {ANURGO_BRAND.email}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyEmail}
                    className="p-2.5 rounded-xl bg-[#242424] hover:bg-[#2F2F2F] text-[#D7E2EA] border border-[#D7E2EA]/20 text-xs font-mono transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* LinkedIn Profile */}
                <a
                  href={ANURGO_BRAND.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-2xl bg-[#181818] hover:bg-[#202020] border border-[#D7E2EA]/15 text-[#D7E2EA] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-sky-300">
                        Connect on LinkedIn
                      </div>
                      <div className="text-xs text-[#D7E2EA]/60">Anurag Chauhan • ANURGO</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#D7E2EA]/50 group-hover:text-white transition-colors" />
                </a>

                {/* Fiverr Direct */}
                <a
                  href={ANURGO_BRAND.fiverr}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-2xl bg-[#181818] hover:bg-[#202020] border border-emerald-500/25 hover:border-emerald-400 text-[#D7E2EA] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold font-mono text-sm flex items-center justify-center">
                      fi
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-emerald-300">
                        Hire on Fiverr
                      </div>
                      <div className="text-xs text-[#D7E2EA]/60">Custom 3D & Web Studio Gigs</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-400/70 group-hover:text-emerald-300 transition-colors" />
                </a>
              </div>

              {/* Trust Pillars */}
              <div className="pt-4 border-t border-[#D7E2EA]/10 space-y-2 text-xs text-[#D7E2EA]/70">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bespoke Projects • 100% Code & Asset Ownership</span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Project Brief Form & Automation Engine */}
          <div className="lg:col-span-7">
            <FadeIn delay={0.35} y={30} className="p-6 sm:p-10 rounded-[36px] sm:rounded-[44px] bg-[#121212] border-2 border-[#D7E2EA]/20 shadow-2xl space-y-6">
              
              {/* ============================================================== */}
              {/* STATE 1: SUCCESS CONFIRMATION SCREEN */}
              {/* ============================================================== */}
              {submitted && submissionData ? (
                <div className="py-8 text-center space-y-6 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-2xl font-black uppercase text-white tracking-tight">
                      PROJECT BRIEF RECEIVED
                    </h4>
                    <p className="text-sm text-[#D7E2EA]/90 max-w-md mx-auto leading-relaxed">
                      Your project details have been securely received by ANURGO.
                    </p>
                    <p className="text-xs text-[#D7E2EA]/65 font-mono max-w-md mx-auto">
                      An email confirmation has been sent to your verified email address.
                    </p>
                  </div>

                  {/* Submission ID Card */}
                  <div className="max-w-xs mx-auto p-4 rounded-2xl bg-[#181D2A] border border-orange-500/40 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-[#D7E2EA]/50 uppercase">Submission ID</div>
                      <div className="text-base font-black font-mono text-orange-400 tracking-wider">
                        {submissionData.submissionId}
                      </div>
                    </div>
                    <button
                      onClick={handleCopySubmissionId}
                      className="p-2 rounded-xl bg-[#222A3E] hover:bg-[#2A344E] text-[#D7E2EA] transition-colors cursor-pointer text-xs font-mono flex items-center gap-1"
                      title="Copy Submission ID"
                    >
                      {copiedSubmissionId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSubmissionId ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="max-w-md mx-auto space-y-3 pt-2">
                    {isAuthenticated && (
                      <button
                        onClick={openDashboard}
                        className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,84,0,0.3)] transition-all cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Track Status in Client Portal</span>
                      </button>
                    )}

                    {/* Secondary WhatsApp Message (Optional Convenience Only) */}
                    {submissionData.whatsappUrl && (
                      <a
                        href={submissionData.whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-[#1A2234] hover:bg-[#202C44] border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-300 font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Contact via WhatsApp (Optional)</span>
                        <ExternalLink className="w-3 h-3 text-emerald-400/60" />
                      </a>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={resetForm}
                      className="text-xs font-mono text-[#D7E2EA]/60 hover:text-white transition-colors cursor-pointer underline underline-offset-4"
                    >
                      ← Submit Another Project Brief
                    </button>
                  </div>
                </div>
              ) : isReviewing ? (
                /* ============================================================== */
                /* STATE 2: COMPACT CONFIRMATION & REVIEW STEP */
                /* ============================================================== */
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider">
                      <span>Step 2 of 2: Final Confirmation</span>
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white">
                      Review your project brief
                    </h3>
                    <p className="text-xs text-[#D7E2EA]/60 font-sans">
                      Please confirm your project requirements below before transmitting to ANURGO.
                    </p>
                  </div>

                  {apiError && (
                    <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{apiError}</span>
                    </div>
                  )}

                  {/* Summary Table */}
                  <div className="p-5 rounded-2xl bg-[#0E121C] border border-[#D7E2EA]/15 space-y-3 text-xs font-mono">
                    <div className="grid grid-cols-2 gap-2 border-b border-[#D7E2EA]/10 pb-2.5">
                      <span className="text-[#D7E2EA]/50 uppercase">Name:</span>
                      <span className="text-white font-bold text-right">{formData.fullName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b border-[#D7E2EA]/10 pb-2.5">
                      <span className="text-[#D7E2EA]/50 uppercase">Email:</span>
                      <span className="text-emerald-400 font-bold text-right truncate">
                        {formData.email} ✓
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b border-[#D7E2EA]/10 pb-2.5">
                      <span className="text-[#D7E2EA]/50 uppercase">Phone / WhatsApp:</span>
                      <span className="text-emerald-400 font-bold text-right">
                        {formData.phone} ✓
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b border-[#D7E2EA]/10 pb-2.5">
                      <span className="text-[#D7E2EA]/50 uppercase">Business / Project:</span>
                      <span className="text-white font-bold text-right">{formData.businessName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b border-[#D7E2EA]/10 pb-2.5">
                      <span className="text-[#D7E2EA]/50 uppercase">Project Type:</span>
                      <span className="text-white font-bold text-right">{formData.projectType}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b border-[#D7E2EA]/10 pb-2.5">
                      <span className="text-[#D7E2EA]/50 uppercase">Budget Range:</span>
                      <span className="text-orange-400 font-bold text-right">{getEffectiveBudget()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b border-[#D7E2EA]/10 pb-2.5">
                      <span className="text-[#D7E2EA]/50 uppercase">Preferred Timeline:</span>
                      <span className="text-white font-bold text-right">{formData.timeline}</span>
                    </div>
                    <div className="pt-1">
                      <span className="text-[#D7E2EA]/50 uppercase block mb-1">Description:</span>
                      <div className="p-3 rounded-xl bg-[#141824] text-xs font-sans text-[#D7E2EA] whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
                        {formData.details}
                      </div>
                    </div>
                  </div>

                  {/* Submission Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleFinalSubmit}
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-black font-black text-sm sm:text-base font-mono uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,84,0,0.35)] transition-all cursor-pointer hover:scale-[1.01] active:scale-98 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                          <span>TRANSMITTING BRIEF TO ANURGO...</span>
                        </>
                      ) : (
                        <>
                          <span>[ CONFIRM &amp; SUBMIT ]</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setIsReviewing(false)}
                      disabled={isSubmitting}
                      className="w-full py-2.5 text-xs font-mono text-[#D7E2EA]/60 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Brief Details</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* ============================================================== */
                /* STATE 3: INTERACTIVE PROJECT BRIEF FORM */
                /* ============================================================== */
                <form onSubmit={handleProceedToReview} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase tracking-tight text-white">
                      Project Brief
                    </h3>
                    <p className="text-xs text-[#D7E2EA]/60 font-sans">
                      Fill out your requirements below. Your email and phone will be verified before final transmission.
                    </p>
                  </div>

                  {/* API / Global Error Banner */}
                  {apiError && (
                    <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="font-sans leading-relaxed">{apiError}</span>
                    </div>
                  )}

                  {/* Inline OTP Verification Sub-panel */}
                  {verifyingTarget && (
                    <div className="p-4 rounded-2xl bg-[#141A28] border-2 border-orange-500/50 space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-mono text-orange-400 font-bold uppercase">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Verify {verifyingTarget === 'email' ? 'Email Address' : 'Phone Number'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setVerifyingTarget(null)}
                          className="text-[11px] font-mono text-[#D7E2EA]/50 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      {otpNotice && (
                        <p className="text-xs font-mono text-[#D7E2EA]/80">{otpNotice}</p>
                      )}
                      {otpError && (
                        <p className="text-xs font-mono text-rose-400">{otpError}</p>
                      )}

                      {devCode && (
                        <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between gap-2 animate-fadeIn">
                          <div className="text-xs font-mono text-orange-400">
                            <span>💡 Verification Code: </span>
                            <span className="font-bold text-white tracking-widest text-sm">{devCode}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setOtpInput(devCode)}
                            className="px-3 py-1 rounded-lg bg-orange-500 text-black font-mono font-bold text-[10px] uppercase hover:bg-orange-400 transition-colors cursor-pointer"
                          >
                            Auto-fill
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="6-digit code"
                          className="flex-1 px-4 py-2.5 rounded-xl bg-[#0E121C] border border-orange-500/40 text-center font-mono text-sm tracking-widest text-orange-400 focus:outline-none focus:border-orange-300"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleConfirmOtp}
                          disabled={otpLoading || otpInput.length !== 6}
                          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-mono font-bold text-xs uppercase cursor-pointer disabled:opacity-50"
                        >
                          {otpLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#D7E2EA]/50 font-mono pt-1">
                        <button
                          type="button"
                          onClick={verifyingTarget === 'email' ? handleSendEmailOtp : handleSendPhoneOtp}
                          disabled={otpCooldown > 0}
                          className="text-orange-400 hover:text-orange-300 disabled:text-[#D7E2EA]/30 cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>{otpCooldown > 0 ? `Resend in ${otpCooldown}s` : 'Resend Code'}</span>
                        </button>
                        <span>Valid for 10 minutes</span>
                      </div>
                    </div>
                  )}

                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#D7E2EA] uppercase tracking-wider">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Your full name"
                        className={`w-full px-4 py-3 rounded-2xl bg-[#1A1A1A] border ${
                          errors.fullName ? 'border-rose-500' : 'border-[#D7E2EA]/20'
                        } text-sm text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors`}
                      />
                      {errors.fullName && (
                        <span className="text-[11px] text-rose-400">{errors.fullName}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-[#D7E2EA] uppercase tracking-wider">
                          Email *
                        </label>
                        {emailVerified ? (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Verified
                          </span>
                        ) : formData.email ? (
                          <button
                            type="button"
                            onClick={handleSendEmailOtp}
                            className="text-[10px] font-mono text-orange-400 hover:text-orange-300 underline cursor-pointer"
                          >
                            Verify Email
                          </button>
                        ) : null}
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          setEmailVerified(false);
                        }}
                        placeholder="your@email.com"
                        className={`w-full px-4 py-3 rounded-2xl bg-[#1A1A1A] border ${
                          errors.email ? 'border-rose-500' : emailVerified ? 'border-emerald-500/50' : 'border-[#D7E2EA]/20'
                        } text-sm text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors`}
                      />
                      {errors.email && (
                        <span className="text-[11px] text-rose-400">{errors.email}</span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Business Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#D7E2EA] uppercase tracking-wider">
                        Business / Project Name *
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="Brand or studio name"
                        className={`w-full px-4 py-3 rounded-2xl bg-[#1A1A1A] border ${
                          errors.businessName ? 'border-rose-500' : 'border-[#D7E2EA]/20'
                        } text-sm text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors`}
                      />
                      {errors.businessName && (
                        <span className="text-[11px] text-rose-400">{errors.businessName}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-[#D7E2EA] uppercase tracking-wider">
                          Phone / WhatsApp *
                        </label>
                        {phoneVerified ? (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Verified
                          </span>
                        ) : formData.phone ? (
                          <button
                            type="button"
                            onClick={handleSendPhoneOtp}
                            className="text-[10px] font-mono text-orange-400 hover:text-orange-300 underline cursor-pointer"
                          >
                            Verify Phone
                          </button>
                        ) : null}
                      </div>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          setPhoneVerified(false);
                        }}
                        placeholder="+91 / International number"
                        className={`w-full px-4 py-3 rounded-2xl bg-[#1A1A1A] border ${
                          errors.phone ? 'border-rose-500' : phoneVerified ? 'border-emerald-500/50' : 'border-[#D7E2EA]/20'
                        } text-sm text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors`}
                      />
                      {errors.phone && (
                        <span className="text-[11px] text-rose-400">{errors.phone}</span>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Project Type & Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#D7E2EA] uppercase tracking-wider">
                        Project Type *
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-[#1A1A1A] border border-[#D7E2EA]/20 text-sm text-[#D7E2EA] focus:outline-none focus:border-orange-500 transition-colors cursor-pointer font-sans"
                      >
                        <option value="Landing Page / Single Page">Landing Page / Single Page</option>
                        <option value="Business Website">Business Website (Multi-Page)</option>
                        <option value="Restaurant & Café Website">Restaurant &amp; Café Website</option>
                        <option value="Local Shop / Boutique Website">Local Shop / Storefront</option>
                        <option value="Portfolio Website">Portfolio / Personal Website</option>
                        <option value="Website Redesign / Fixes">Website Redesign / Bug Fixes</option>
                        <option value="3D & Interactive Web Experience">3D &amp; Interactive Web Experience</option>
                        <option value="UI/UX Design">UI/UX Design &amp; Prototyping</option>
                        <option value="Other">Other / Let&apos;s Discuss</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-[#D7E2EA] uppercase tracking-wider">
                          Budget Range
                        </label>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          Open to All Budgets
                        </span>
                      </div>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-[#1A1A1A] border border-[#D7E2EA]/20 text-sm text-[#D7E2EA] focus:outline-none focus:border-orange-500 transition-colors cursor-pointer font-sans"
                      >
                        <option value="Flexible / Let's Discuss">Flexible / Let&apos;s Discuss (Recommended)</option>
                        <option value="Under ₹3,000">Under ₹3,000 (Quick Page / Edits / Fixes)</option>
                        <option value="₹3,000 – ₹7,000">₹3,000 – ₹7,000 (Starter / Single-Page Website)</option>
                        <option value="₹7,000 – ₹15,000">₹7,000 – ₹15,000 (Small Business / Multi-Page)</option>
                        <option value="₹15,000 – ₹25,000">₹15,000 – ₹25,000 (Advanced / Custom UI)</option>
                        <option value="₹25,000+">₹25,000+ (Comprehensive Project)</option>
                        <option value="Custom Budget">Custom Budget (Enter your own amount)</option>
                        <option value="Not decided yet">Not decided yet</option>
                      </select>

                      {formData.budget === 'Custom Budget' && (
                        <div className="pt-1.5 animate-fadeIn">
                          <input
                            type="text"
                            value={customBudget}
                            onChange={(e) => setCustomBudget(e.target.value)}
                            placeholder="Enter your budget (e.g. ₹1,500, ₹4,000, $50)"
                            className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-orange-500/50 text-xs text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                            autoFocus
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Preferred Timeline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#D7E2EA] uppercase tracking-wider">
                      Preferred Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#1A1A1A] border border-[#D7E2EA]/20 text-sm text-[#D7E2EA] focus:outline-none focus:border-orange-500 transition-colors cursor-pointer font-sans"
                    >
                      <option value="2–4 Days">2–4 Days (Quick Turnaround / Fixes)</option>
                      <option value="1–2 Weeks">1–2 Weeks (Fast-track Website)</option>
                      <option value="2–4 Weeks">2–4 Weeks (Standard Project)</option>
                      <option value="1–2 Months">1–2 Months (Complex Platform)</option>
                      <option value="Flexible">Flexible Timeline</option>
                    </select>
                  </div>

                  {/* Row 5: Project Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#D7E2EA] uppercase tracking-wider">
                      Project Description *
                    </label>
                    <textarea
                      rows={4}
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder="Tell me about what you want to build, target audience, reference sites, or any specific budget expectations..."
                      className={`w-full px-4 py-3 rounded-2xl bg-[#1A1A1A] border ${
                        errors.details ? 'border-rose-500' : 'border-[#D7E2EA]/20'
                      } text-sm text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors font-sans`}
                    />
                    {errors.details && (
                      <span className="text-[11px] text-rose-400">{errors.details}</span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-black font-black text-sm sm:text-base font-mono uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,84,0,0.35)]"
                    >
                      <span>LET&apos;S BUILD</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnurgoContact;
