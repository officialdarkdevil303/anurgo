import React, { useState } from 'react';
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
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FadeIn } from '../common/FadeIn';
import { ANURGO_BRAND } from '../../data/anurgoData';

interface AnurgoContactProps {
  initialServiceOrProject?: string;
}

export const AnurgoContact: React.FC<AnurgoContactProps> = ({ initialServiceOrProject }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    businessName: '',
    phone: '',
    projectType: '3D Website',
    budget: 'Not decided yet',
    timeline: '2–4 Weeks',
    details: initialServiceOrProject ? `Interested in discussing: ${initialServiceOrProject}` : '',
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submittedBriefUrls, setSubmittedBriefUrls] = useState<{ whatsappUrl: string; mailtoUrl: string; rawText: string }>({
    whatsappUrl: '',
    mailtoUrl: '',
    rawText: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Please enter your name';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Please enter a valid email address';
    if (!formData.businessName.trim()) errs.businessName = 'Please enter your business or project name';
    if (!formData.details.trim()) errs.details = 'Please describe what you want to build';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generateBriefMessage = () => {
    return `*ANURGO STUDIO — NEW PROJECT BRIEF*
----------------------------------------
👤 *Name:* ${formData.fullName.trim()}
📧 *Email:* ${formData.email.trim()}
🏢 *Business / Brand:* ${formData.businessName.trim()}
📱 *Phone / WhatsApp:* ${formData.phone.trim() || 'Not specified'}
🎯 *Project Type:* ${formData.projectType}
💰 *Budget Range:* ${formData.budget}
⏱️ *Preferred Timeline:* ${formData.timeline}

📝 *Project Details & Goals:*
${formData.details.trim()}
----------------------------------------
Sent via ANURGO Portfolio Website`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setApiError(null);

    const briefText = generateBriefMessage();
    const whatsappUrl = `https://wa.me/917991192205?text=${encodeURIComponent(briefText)}`;
    
    const emailSubject = `New Project Brief from ${formData.fullName.trim()} — ${formData.businessName.trim()}`;
    const emailBody = `Hi Anurag,

Here are the details for my new project:

Name: ${formData.fullName.trim()}
Email: ${formData.email.trim()}
Business/Brand: ${formData.businessName.trim()}
Phone/WhatsApp: ${formData.phone.trim() || 'Not specified'}
Project Type: ${formData.projectType}
Budget Range: ${formData.budget}
Preferred Timeline: ${formData.timeline}

Project Details:
${formData.details.trim()}

Looking forward to hearing from you!`;

    const mailtoUrl = `mailto:${ANURGO_BRAND.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    setSubmittedBriefUrls({
      whatsappUrl,
      mailtoUrl,
      rawText: briefText,
    });

    try {
      // Dispatch payload to secure serverless API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setSubmitted(true);
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#FF5400', '#FF7A00', '#FFAA00', '#FFFFFF', '#D7E2EA'],
        });
      } else {
        // Handle server error gracefully without losing entered form data
        setApiError(
          data?.message || 'Unable to transmit brief automatically. You can retry or send directly via Email.'
        );
      }
    } catch (err: any) {
      // Network error / offline fallback
      setApiError(
        'Connection error while transmitting brief. Your data is preserved below, and you can send directly via Email.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ANURGO_BRAND.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyBrief = () => {
    if (submittedBriefUrls.rawText) {
      navigator.clipboard.writeText(submittedBriefUrls.rawText);
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2500);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setApiError(null);
    setFormData({
      fullName: '',
      email: '',
      businessName: '',
      phone: '',
      projectType: '3D Website',
      budget: 'Not decided yet',
      timeline: '2–4 Weeks',
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

        {/* Split Container: Direct Channels & Project Brief Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Channels & Professional Trust */}
          <div className="lg:col-span-5 space-y-6">
            <FadeIn delay={0.25} y={30} className="p-7 sm:p-8 rounded-[36px] bg-[#121212] border border-[#D7E2EA]/15 space-y-6 shadow-xl">
              <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                <MessageSquare className="w-5 h-5 text-orange-400" />
                <span>Direct Channels</span>
              </h3>

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

          {/* Right Column: Project Brief Form & Transmission Engine */}
          <div className="lg:col-span-7">
            <FadeIn delay={0.35} y={30} className="p-6 sm:p-10 rounded-[36px] sm:rounded-[44px] bg-[#121212] border-2 border-[#D7E2EA]/20 shadow-2xl space-y-6">
              {submitted ? (
                <div className="py-8 text-center space-y-6 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black uppercase text-white tracking-tight">
                      PROJECT BRIEF RECEIVED
                    </h4>
                    <p className="text-sm text-[#D7E2EA]/85 max-w-md mx-auto font-medium leading-relaxed">
                      Thanks for sharing your idea with ANURGO. Your project brief has been received successfully. I&apos;ll review your requirements and get back to you shortly.
                    </p>
                  </div>

                  {/* Dual Action Dispatch Buttons */}
                  <div className="max-w-md mx-auto space-y-3 pt-2">
                    {/* Send on WhatsApp Button */}
                    <a
                      href={submittedBriefUrls.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Contact via WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Copy Brief to Clipboard */}
                    <button
                      onClick={handleCopyBrief}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#181818] hover:bg-[#222222] border border-[#D7E2EA]/20 text-[#D7E2EA] text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {copiedBrief ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBrief ? 'Project Brief Copied to Clipboard!' : 'Copy Formatted Brief Text'}</span>
                    </button>
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
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase tracking-tight text-white">
                      Project Brief
                    </h3>
                    <p className="text-xs text-[#D7E2EA]/60 font-sans">
                      Fill out your requirements below. Click &quot;LET&apos;S BUILD&quot; to securely transmit your brief to ANURGO.
                    </p>
                  </div>

                  {/* API Error Notification Banner with Retry / Fallback */}
                  {apiError && (
                    <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs space-y-2 animate-fadeIn">
                      <div className="flex items-center gap-2 font-bold font-mono">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>Transmission Notice:</span>
                      </div>
                      <p className="font-sans leading-relaxed">{apiError}</p>
                      <div className="pt-1 flex items-center gap-3">
                        <a
                          href={submittedBriefUrls.whatsappUrl || ANURGO_BRAND.whatsappLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[11px] font-bold"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Contact via WhatsApp</span>
                        </a>
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white font-mono text-[11px]"
                        >
                          Retry Submit
                        </button>
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
                        disabled={isSubmitting}
                        className={`w-full px-4 py-3 rounded-2xl bg-[#1A1A1A] border ${
                          errors.fullName ? 'border-rose-500' : 'border-[#D7E2EA]/20'
                        } text-sm text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50`}
                      />
                      {errors.fullName && (
                        <span className="text-[11px] text-rose-400">{errors.fullName}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#D7E2EA] uppercase tracking-wider">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        disabled={isSubmitting}
                        className={`w-full px-4 py-3 rounded-2xl bg-[#1A1A1A] border ${
                          errors.email ? 'border-rose-500' : 'border-[#D7E2EA]/20'
                        } text-sm text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50`}
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
                        disabled={isSubmitting}
                        className={`w-full px-4 py-3 rounded-2xl bg-[#1A1A1A] border ${
                          errors.businessName ? 'border-rose-500' : 'border-[#D7E2EA]/20'
                        } text-sm text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50`}
                      />
                      {errors.businessName && (
                        <span className="text-[11px] text-rose-400">{errors.businessName}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#D7E2EA] uppercase tracking-wider">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 / International number"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-2xl bg-[#1A1A1A] border border-[#D7E2EA]/20 text-sm text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                      />
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
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-2xl bg-[#1A1A1A] border border-[#D7E2EA]/20 text-sm text-[#D7E2EA] focus:outline-none focus:border-orange-500 transition-colors cursor-pointer font-sans disabled:opacity-50"
                      >
                        <option value="Web Design">Web Design</option>
                        <option value="3D Website">3D Website</option>
                        <option value="Creative Development">Creative Development</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Branding">Branding</option>
                        <option value="Motion Design">Motion Design</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#D7E2EA] uppercase tracking-wider">
                        Budget Range
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-2xl bg-[#1A1A1A] border border-[#D7E2EA]/20 text-sm text-[#D7E2EA] focus:outline-none focus:border-orange-500 transition-colors cursor-pointer font-sans disabled:opacity-50"
                      >
                        <option value="Not decided yet">Not decided yet</option>
                        <option value="₹10K – ₹25K">₹10K – ₹25K</option>
                        <option value="₹25K – ₹50K">₹25K – ₹50K</option>
                        <option value="₹50K – ₹1L">₹50K – ₹1L</option>
                        <option value="₹1L+">₹1L+</option>
                      </select>
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
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-2xl bg-[#1A1A1A] border border-[#D7E2EA]/20 text-sm text-[#D7E2EA] focus:outline-none focus:border-orange-500 transition-colors cursor-pointer font-sans disabled:opacity-50"
                    >
                      <option value="1–2 Weeks">1–2 Weeks (Fast-track)</option>
                      <option value="2–4 Weeks">2–4 Weeks (Standard)</option>
                      <option value="1–2 Months">1–2 Months (Complex)</option>
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
                      placeholder="Tell me about what you want to build, target audience, reference sites, or specific features..."
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 rounded-2xl bg-[#1A1A1A] border ${
                        errors.details ? 'border-rose-500' : 'border-[#D7E2EA]/20'
                      } text-sm text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-orange-500 transition-colors font-sans disabled:opacity-50`}
                    />
                    {errors.details && (
                      <span className="text-[11px] text-rose-400">{errors.details}</span>
                    )}
                  </div>

                  {/* Submit Button with Loading & Double-Click Prevention */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-black font-black text-sm sm:text-base font-mono uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-98 disabled:opacity-60 disabled:hover:scale-100 cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,84,0,0.35)]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                          <span>TRANSMITTING BRIEF...</span>
                        </>
                      ) : (
                        <>
                          <span>LET&apos;S BUILD</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
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
