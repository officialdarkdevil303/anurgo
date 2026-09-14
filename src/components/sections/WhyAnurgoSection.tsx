import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../common/FadeIn';
import { Sparkles, Layers, MousePointerClick, Smartphone, Zap, CheckCircle } from 'lucide-react';

interface WhyPointData {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const WHY_POINTS: WhyPointData[] = [
  {
    number: '01',
    title: 'BESPOKE DESIGN',
    description: 'Every project is designed specifically for the brand — zero generic templates or cookie-cutter layouts.',
    icon: Layers,
  },
  {
    number: '02',
    title: 'INTERACTIVE EXPERIENCES',
    description: 'Motion, tactile micro-interactions, and 3D depth are used with clear purpose to boost user retention.',
    icon: MousePointerClick,
  },
  {
    number: '03',
    title: 'RESPONSIVE BY DEFAULT',
    description: 'Flawlessly recomposed and touch-optimized across ultra-wide desktop, tablet, and mobile screens.',
    icon: Smartphone,
  },
  {
    number: '04',
    title: 'PERFORMANCE FOCUSED',
    description: 'Sub-second load times and lightweight GPU animations engineered to never compromise website speed.',
    icon: Zap,
  },
  {
    number: '05',
    title: 'ATTENTION TO DETAIL',
    description: 'Editorial typography, balanced spacing, fluid transitions, and micro-interactions meticulously refined.',
    icon: CheckCircle,
  },
];

export const WhyAnurgoSection: React.FC = () => {
  return (
    <section
      id="why-anurgo"
      className="w-full bg-[#0C0C0C] px-5 sm:px-8 md:px-12 py-28 sm:py-36 relative z-10 text-[#D7E2EA] select-none border-t border-[#D7E2EA]/10"
    >
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <FadeIn delay={0} y={20}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#D7E2EA]/20 text-[10px] sm:text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Principles</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} y={30}>
            <h2
              className="hero-heading font-black uppercase tracking-tight leading-none text-center"
              style={{ fontSize: 'clamp(2.5rem, 9vw, 120px)' }}
            >
              WHY ANURGO
            </h2>
          </FadeIn>

          <FadeIn delay={0.2} y={20}>
            <p className="text-[#D7E2EA]/70 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto font-sans">
              Built on the belief that distinctive digital experiences create unfair competitive advantages.
            </p>
          </FadeIn>
        </div>

        {/* 5 Points Minimalist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_POINTS.map((point, idx) => {
            const Icon = point.icon;

            return (
              <FadeIn
                key={point.number}
                delay={idx * 0.1}
                y={30}
                className="p-7 sm:p-8 rounded-[32px] bg-[#121212] border border-[#D7E2EA]/15 hover:border-orange-500/40 hover:bg-[#161616] transition-all duration-300 space-y-5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-2xl sm:text-3xl text-[#D7E2EA]/40 group-hover:text-orange-400 transition-colors">
                    {point.number}
                  </span>

                  <div className="p-3 rounded-2xl bg-[#1A1A1A] border border-[#D7E2EA]/15 text-[#D7E2EA] group-hover:text-orange-400 group-hover:border-orange-500/30 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white group-hover:text-orange-300 transition-colors">
                    {point.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D7E2EA]/70 leading-relaxed font-sans">
                    {point.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyAnurgoSection;
