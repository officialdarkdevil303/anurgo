import React from 'react';
import { 
  Palette, 
  Smartphone, 
  Sparkles, 
  Zap, 
  MessageSquare, 
  Target, 
  ShieldCheck, 
  Flame, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { TiltCard } from '../common/TiltCard';
import { WHY_ANURGO_POINTS, WhyAnurgoPoint } from '../../data/anurgoData';

const iconMap: Record<string, React.ReactNode> = {
  Palette: <Palette className="w-5 h-5 text-orange-400" />,
  Smartphone: <Smartphone className="w-5 h-5 text-orange-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-orange-400" />,
  Zap: <Zap className="w-5 h-5 text-orange-400" />,
  MessageSquare: <MessageSquare className="w-5 h-5 text-orange-400" />,
  Target: <Target className="w-5 h-5 text-orange-400" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-orange-400" />,
  Flame: <Flame className="w-5 h-5 text-orange-400" />,
};

export const AnurgoWhyUs: React.FC = () => {
  return (
    <section id="why-anurgo" className="relative py-28 bg-[#06080D] anurgo-grid-bg border-t border-orange-500/20">
      {/* Radiant ambient glow */}
      <div className="ambient-glow-orange top-1/3 -right-20" />
      <div className="ambient-glow-amber bottom-1/3 -left-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The ANURGO Advantage</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            WHY <span className="text-gradient-fire">ANURGO.</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Most agencies sell bloated, slow templates. We engineer bespoke, lightning-fast digital storefronts that make your business impossible to ignore.
          </p>
        </div>

        {/* 8 Core Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_ANURGO_POINTS.map((point) => (
            <TiltCard
              key={point.id}
              maxTilt={3}
              glowColor="amber"
              className="p-6 rounded-3xl bg-[#090D18]/90 border border-slate-800 hover:border-orange-500/60 anurgo-glass anurgo-card-shine flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-orange-500/15 border border-orange-500/30 shadow-neon-orange-sm">
                    {iconMap[point.icon]}
                  </div>

                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-950/80 text-orange-400 border border-orange-500/30 font-bold">
                    {point.badge}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 block">
                    PILLAR {point.number}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                    {point.title}
                  </h3>
                  <div className="text-xs font-mono text-orange-400 font-semibold mt-0.5">
                    {point.subtitle}
                  </div>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">
                  {point.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verified Standard</span>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Comparison Callout Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#090D1A] border border-orange-500/30 anurgo-glass shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Ready to leave outdated templates behind?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Get a modern website built specifically to convert local visitors into paying customers.
            </p>
          </div>

          <a
            href="#contact"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-slate-950 font-bold text-sm tracking-wide shadow-neon-orange hover:shadow-neon-orange-lg hover:brightness-110 transition-all transform hover:-translate-y-0.5 shrink-0 cursor-pointer"
          >
            <span>Book a Website</span>
          </a>
        </div>
      </div>
    </section>
  );
};
