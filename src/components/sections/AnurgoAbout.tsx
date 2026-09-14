import React from 'react';
import { Terminal, Code, Sparkles, CheckCircle2, User, HeartHandshake, ShieldCheck, ArrowRight, Flame, Cpu, Compass } from 'lucide-react';
import { ANURGO_BRAND } from '../../data/anurgoData';

interface AnurgoAboutProps {
  onOpenTerminal: () => void;
}

export const AnurgoAbout: React.FC<AnurgoAboutProps> = ({ onOpenTerminal }) => {
  const creativePillars = [
    {
      title: 'Artistic 3D & Creative Engineering',
      desc: 'Merging WebGL, subtle 3D lighting, and GPU-accelerated motion to create digital storefronts that stand out effortlessly.',
    },
    {
      title: 'Zero Cookie-Cutter Templates',
      desc: 'Every project is handcrafted from a blank canvas with bespoke typography, curated color palettes, and custom motion.',
    },
    {
      title: 'Obsession with Performance (<0.6s)',
      desc: 'Built on modern React 19 architecture with sub-second mobile loads, 100/100 Core Web Vitals, and smooth 60fps renders.',
    },
    {
      title: 'Direct Creative Collaboration',
      desc: 'Work directly with Anurag — transparent communication, rapid iterations, and complete source code ownership.',
    },
  ];

  return (
    <section id="about" className="relative py-28 sm:py-32 bg-[#06080E] anurgo-grid-bg border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">
            <User className="w-3.5 h-3.5" />
            <span>The Creator Behind The Work</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight">
            ABOUT <span className="text-gradient-fire">ANURGO.</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Crafting the intersection of creative technology, 3D interaction, and high-performance modern web design.
          </p>
        </div>

        {/* Split Grid: Creator Identity & Creative Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Creator Profile Card */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#0B0F1E] border border-orange-500/30 anurgo-glass space-y-6 shadow-2xl">
            {/* 3D Creator Avatar & Badge */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#080B14] border border-orange-500/40 p-0.5 shadow-neon-orange flex items-center justify-center shrink-0">
                <img
                  src="/anurgo_3d_creator.jpg"
                  alt="Anurag - ANURGO 3D Creator"
                  className="w-full h-full object-cover object-top rounded-[14px]"
                />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#080B14] animate-pulse" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  {ANURGO_BRAND.founderName}
                </h3>
                <p className="text-xs font-mono text-orange-400 font-bold">
                  {ANURGO_BRAND.role}
                </p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Creative Technologist & Builder
                </p>
              </div>
            </div>

            {/* Honest Creative Manifesto */}
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {ANURGO_BRAND.bio}
            </p>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-orange-400 font-mono font-bold">
                <Compass className="w-4 h-4" />
                <span>Creative Direction</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                "I believe modern websites shouldn't feel like static PDFs or recycled templates. They should feel alive, artistic, responsive to touch, and memorable from the very first second."
              </p>
            </div>

            {/* Terminal Easter Egg Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-orange-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-orange-400 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-orange-400" />
                  <span>ANURGO://IDENTITY</span>
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold">
                  INTERACTIVE CONSOLE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Explore the developer console, tech benchmarks, creative experiments, and verified handles in an interactive command line.
              </p>
              <button
                onClick={onOpenTerminal}
                className="w-full mt-2 py-2.5 rounded-xl bg-orange-500/15 hover:bg-orange-500 text-orange-300 hover:text-slate-950 border border-orange-500/40 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>&gt; Launch ANURGO://IDENTITY</span>
              </button>
            </div>
          </div>

          {/* Right Column: Creative Principles & Craft Commitments */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-10 rounded-3xl bg-[#080C18] border border-slate-800 space-y-6 shadow-2xl">
              <h3 className="text-lg sm:text-xl font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-5 h-5 text-orange-400" />
                <span>Our Core Creative Principles</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {creativePillars.map((p, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-slate-950/85 border border-slate-800/80 space-y-2 hover:border-orange-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      <span>{p.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Founder's Direct Promise */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-orange-950/40 to-amber-950/30 border border-orange-500/40 flex items-center justify-between gap-4 flex-wrap">
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-bold text-white">
                    "Every project is crafted as a bespoke digital artwork tailored to your vision."
                  </div>
                  <div className="text-[11px] font-mono text-orange-400">
                    — Anurag, 3D Creator & Lead Developer
                  </div>
                </div>

                <a
                  href="#contact"
                  className="px-5 py-2.5 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-neon-orange-sm hover:bg-orange-400 transition-all cursor-pointer shrink-0"
                >
                  <span>Start A Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnurgoAbout;
