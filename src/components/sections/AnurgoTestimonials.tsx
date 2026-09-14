import React from 'react';
import { ShieldCheck, MessageSquare, Sparkles, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export const AnurgoTestimonials: React.FC = () => {
  return (
    <section id="trust" className="relative py-20 bg-[#080B14] anurgo-grid-bg border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Integrity & Transparency</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
            CLIENT FEEDBACK & <span className="text-orange-500">TRANSPARENCY.</span>
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            We believe trust is earned through verifiable quality, transparent process, and honest communication.
          </p>
        </div>

        {/* Client Reviews Placeholder & Trust Commitment Banner */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0B0F1F] border border-orange-500/30 anurgo-glass space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Verified Client Reviews Hub
                </h3>
                <p className="text-xs text-orange-400 font-mono">
                  ● Early Client Reviews Under Active Rollout
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
              Zero Fabricated Testimonials
            </span>
          </div>

          <div className="text-slate-300 text-xs sm:text-sm leading-relaxed space-y-3">
            <p>
              At ANURGO, we stand strictly against fake client testimonials, invented revenue numbers, or exaggerated years of agency experience. All portfolio pieces on this site are transparently labeled as bespoke demo prototypes built to showcase our technical and design standards.
            </p>
            <p className="text-slate-400">
              Verified client reviews will be published directly here upon completion of active client deliverables.
            </p>
          </div>

          {/* 3 Pillars of Client Safety */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-orange-400 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Milestone Billing</span>
              </div>
              <p className="text-[11px] text-slate-400">Pay in clear stages as deliverables are approved.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>100% Asset Ownership</span>
              </div>
              <p className="text-[11px] text-slate-400">You own your codebase, assets, and domain with zero locks.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Direct Contact</span>
              </div>
              <p className="text-[11px] text-slate-400">Direct WhatsApp and email channel with founder Anurag.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
