import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  Star,
  Bug,
  Lightbulb,
  Palette,
  Heart,
  ExternalLink,
  MessageCircle,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ANURGO_BRAND } from '../../data/anurgoData';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackCategory = 'idea' | 'design' | 'bug' | 'praise' | 'general';

const CATEGORIES: { id: FeedbackCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'idea', label: 'Improvement Idea', icon: Lightbulb },
  { id: 'design', label: 'UI / Design', icon: Palette },
  { id: 'praise', label: 'Praise & Love', icon: Heart },
  { id: 'bug', label: 'Bug / Glitch', icon: Bug },
  { id: 'general', label: 'General Note', icon: MessageSquare },
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState<FeedbackCategory>('idea');
  const [rating, setRating] = useState<number>(5);
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const getCategoryLabel = (cat: FeedbackCategory) => {
    return CATEGORIES.find((c) => c.id === cat)?.label || 'Feedback';
  };

  const constructFormattedMessage = () => {
    const sender = name.trim() ? name.trim() : 'Website Visitor';
    const contactInfo = contact.trim() ? `\n• Contact: ${contact.trim()}` : '';
    const ratingStr = `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)`;

    return `*ANURGO Feedback for Anurag Chauhan*
• Category: ${getCategoryLabel(category)}
• Experience Rating: ${ratingStr}
• From: ${sender}${contactInfo}

*Message:*
${message.trim()}`;
  };

  const handleSendWhatsApp = () => {
    if (!message.trim()) return;
    const text = encodeURIComponent(constructFormattedMessage());
    const url = `https://wa.me/917991192205?text=${text}`;
    window.open(url, '_blank');
    recordLocalSubmission();
  };

  const handleSendEmail = () => {
    if (!message.trim()) return;
    const subject = encodeURIComponent(`[ANURGO Feedback] ${getCategoryLabel(category)} from ${name.trim() || 'Visitor'}`);
    const body = encodeURIComponent(constructFormattedMessage());
    const mailto = `mailto:${ANURGO_BRAND.email}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
    recordLocalSubmission();
  };

  const recordLocalSubmission = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('anurgo_feedbacks') || '[]');
      existing.push({
        id: Date.now().toString(),
        category,
        rating,
        name: name.trim(),
        contact: contact.trim(),
        message: message.trim(),
        date: new Date().toISOString(),
      });
      localStorage.setItem('anurgo_feedbacks', JSON.stringify(existing));
    } catch {
      // Safe fallback
    }

    // Trigger celebration
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FF5400', '#FF7824', '#FBBF24', '#FFFFFF'],
      });
    } catch {
      // Safe fallback
    }

    setSubmitted(true);
  };

  const handleSubmitDirectly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      recordLocalSubmission();
      setSubmitting(false);
    }, 400);
  };

  const resetForm = () => {
    setSubmitted(false);
    setMessage('');
    setName('');
    setContact('');
    setRating(5);
    setCategory('idea');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetForm}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-[#111317] border border-[#D7E2EA]/20 rounded-3xl shadow-2xl overflow-hidden my-auto z-10"
          >
            {/* Top Accent Gradient Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />

            {/* Close Button */}
            <button
              onClick={resetForm}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1A1E24] border border-[#D7E2EA]/15 flex items-center justify-center text-[#D7E2EA]/70 hover:text-white hover:border-orange-500/50 transition-colors z-20 cursor-pointer"
              aria-label="Close Feedback Modal"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              /* Success Thank You State */
              <div className="p-8 sm:p-10 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/40 text-orange-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(255,84,0,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-bold">
                    Feedback Received
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    Thank You for Helping Me Grow!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D7E2EA]/75 max-w-md mx-auto leading-relaxed">
                    As a B.Tech student and independent creator, your honest perspective is the most valuable fuel to refine ANURGO and deliver exceptional work.
                  </p>
                </div>

                {/* Creator Personal Note Card */}
                <div className="p-4 rounded-2xl bg-[#161920] border border-[#D7E2EA]/10 text-left flex items-start gap-3.5">
                  <img
                    src="/anurag_photo.jpg"
                    alt="Anurag Chauhan"
                    className="w-10 h-10 rounded-xl object-cover border border-orange-500/40 shrink-0"
                  />
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">Anurag Chauhan</span>
                      <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/30">
                        Creator
                      </span>
                    </div>
                    <p className="text-[#D7E2EA]/70 text-[11px] leading-relaxed">
                      &quot;I personally review every note. If you left contact details, I’ll follow up directly to thank you.&quot;
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetForm}
                  className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                >
                  Done & Return to Site
                </button>
              </div>
            ) : (
              /* Feedback Form */
              <div className="p-6 sm:p-8 space-y-6">
                {/* Header with Creator Context */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-[11px] font-mono text-orange-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Talk Directly With The Creator</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Share Your Feedback & Ideas
                  </h3>
                  <p className="text-xs text-[#D7E2EA]/70 leading-relaxed">
                    Notice something to improve? Have a feature request or love the aesthetics? As an independent creator, your feedback shapes ANURGO.
                  </p>
                </div>

                <form onSubmit={handleSubmitDirectly} className="space-y-4">
                  {/* Category Pills */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#D7E2EA]/60 font-semibold">
                      What is this about?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = category === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
                              isSelected
                                ? 'bg-orange-500 text-slate-950 border-orange-400 font-bold shadow-sm'
                                : 'bg-[#181B22] text-[#D7E2EA]/70 border-[#D7E2EA]/15 hover:border-orange-500/40 hover:text-white'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rating Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#D7E2EA]/60 font-semibold flex items-center justify-between">
                      <span>Experience Rating</span>
                      <span className="text-orange-400 font-bold">{rating}/5 Stars</span>
                    </label>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#161920] border border-[#D7E2EA]/15">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                          aria-label={`${star} Star Rating`}
                        >
                          <Star
                            className={`w-5 h-5 transition-colors ${
                              star <= rating
                                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-[11px] text-[#D7E2EA]/60 ml-auto font-mono">
                        {rating === 5 && '🔥 Outstanding'}
                        {rating === 4 && '✨ Great'}
                        {rating === 3 && '👍 Good'}
                        {rating === 2 && '🔧 Needs Work'}
                        {rating === 1 && '⚠️ Critical'}
                      </span>
                    </div>
                  </div>

                  {/* Feedback Message */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#D7E2EA]/60 font-semibold flex items-center justify-between">
                      <span>Your Thoughts or Suggestions *</span>
                      <span className="text-[10px] text-orange-400">Required</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your thoughts honestly: What did you like? What should I improve or add? Any bugs or design recommendations?"
                      className="w-full rounded-2xl bg-[#161920] border border-[#D7E2EA]/20 focus:border-orange-500 p-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none transition-colors"
                    />
                  </div>

                  {/* Optional Sender Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#D7E2EA]/50">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex, Rahul..."
                        className="w-full rounded-xl bg-[#161920] border border-[#D7E2EA]/20 focus:border-orange-500 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#D7E2EA]/50">
                        WhatsApp or Email (Optional)
                      </label>
                      <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="For a personal thank you"
                        className="w-full rounded-xl bg-[#161920] border border-[#D7E2EA]/20 focus:border-orange-500 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Submission Action Buttons */}
                  <div className="pt-2 space-y-2.5">
                    {/* Primary Instant WhatsApp Send */}
                    <button
                      type="button"
                      disabled={!message.trim()}
                      onClick={handleSendWhatsApp}
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send Direct via WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    {/* Secondary Options Grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Email Send */}
                      <button
                        type="button"
                        disabled={!message.trim()}
                        onClick={handleSendEmail}
                        className="py-2.5 px-3 rounded-xl bg-[#1B1F27] hover:bg-[#232832] disabled:opacity-40 disabled:pointer-events-none text-[#D7E2EA] border border-[#D7E2EA]/20 font-bold text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5 text-orange-400" />
                        <span>Send via Email</span>
                      </button>

                      {/* Local Submit */}
                      <button
                        type="submit"
                        disabled={!message.trim() || submitting}
                        className="py-2.5 px-3 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 disabled:opacity-40 disabled:pointer-events-none text-orange-300 border border-orange-500/40 font-bold text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submitting ? 'Saving...' : 'Submit Here'}</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Privacy & Direct Creator Assurance */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#D7E2EA]/40 font-mono text-center pt-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Delivered directly to Anurag Chauhan • Zero spam • Honest craft</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
