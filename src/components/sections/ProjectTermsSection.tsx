import React from 'react';
import { FadeIn } from '../common/FadeIn';
import { ShieldCheck, CreditCard, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const ProjectTermsSection: React.FC = () => {
  return (
    <section
      id="terms"
      className="w-full bg-[#0C0C0C] px-5 sm:px-8 md:px-12 py-24 sm:py-32 relative z-10 text-[#D7E2EA] select-none border-t border-[#D7E2EA]/10"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <FadeIn delay={0} y={20}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#D7E2EA]/20 text-[10px] sm:text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transparent Collaboration</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} y={30}>
            <h2
              className="hero-heading font-black uppercase tracking-tight leading-none text-center"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 100px)' }}
            >
              PROJECT TERMS
            </h2>
          </FadeIn>

          <FadeIn delay={0.2} y={20}>
            <p className="text-[#D7E2EA]/75 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto font-sans">
              Straightforward milestone-based collaboration with complete transparency and zero hidden surprises.
            </p>
          </FadeIn>
        </div>

        {/* Milestone Cards & Payment Policy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main 50/50 Milestone Card */}
          <div className="lg:col-span-7">
            <FadeIn delay={0.25} y={30} className="p-8 sm:p-10 rounded-[36px] bg-[#121212] border-2 border-orange-500/30 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-orange-400">
                    PAYMENT POLICY
                  </span>
                  <h3
                    className="font-black uppercase tracking-tight text-white leading-none"
                    style={{ fontSize: 'clamp(1.25rem, 3vw, 2.2rem)' }}
                  >
                    50% UPFRONT • 50% BEFORE FINAL DELIVERY
                  </h3>
                </div>

                <div className="p-3 rounded-2xl bg-orange-500/15 text-orange-400 border border-orange-500/30">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Milestone 1 */}
                <div className="p-5 rounded-2xl bg-[#181818] border border-[#D7E2EA]/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-xl text-orange-400">01</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#D7E2EA]/60">Deposit</span>
                  </div>
                  <h4 className="font-bold uppercase text-sm text-white">50% Kickoff Milestone</h4>
                  <p className="text-xs text-[#D7E2EA]/70 font-sans leading-relaxed">
                    Required to reserve your studio sprint slot, finalize creative direction, and begin design & development.
                  </p>
                </div>

                {/* Milestone 2 */}
                <div className="p-5 rounded-2xl bg-[#181818] border border-[#D7E2EA]/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-xl text-orange-400">02</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#D7E2EA]/60">Launch</span>
                  </div>
                  <h4 className="font-bold uppercase text-sm text-white">50% Final Delivery</h4>
                  <p className="text-xs text-[#D7E2EA]/70 font-sans leading-relaxed">
                    Due after final revisions, thorough QA testing, and right before live deployment and code handoff.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#181818]/60 border border-[#D7E2EA]/10 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-[#D7E2EA]/75 leading-relaxed font-sans">
                  Projects are divided into two payment milestones: 50% is required to begin the project. The remaining 50% is due before final delivery and launch.
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Scope Transparency & Key Guarantees */}
          <div className="lg:col-span-5 space-y-6">
            <FadeIn delay={0.35} y={30} className="p-8 rounded-[36px] bg-[#121212] border border-[#D7E2EA]/15 space-y-6">
              <h3 className="font-black uppercase tracking-tight text-lg text-white font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>Scope-Based Pricing</span>
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-[#D7E2EA]/75 font-sans">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Final pricing depends on project scope, complexity, features, and timeline.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Early-client &amp; student friendly: open to all budget tiers, starting from small gigs &amp; local businesses.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Transparent fixed-price proposals provided upfront with zero hidden charges.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>100% intellectual property, source code, and design tokens ownership handoff.</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D7E2EA]/10">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-white hover:text-orange-400 uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>Request A Custom Proposal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectTermsSection;
