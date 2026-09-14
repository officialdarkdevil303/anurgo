import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../common/FadeIn';
import { AnimatedText } from '../common/AnimatedText';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  HeartHandshake,
  ArrowRight,
  MessageSquarePlus,
  Compass,
  GraduationCap,
  Store,
  Terminal,
  ExternalLink,
  Code2,
  Palette,
} from 'lucide-react';
import { ANURGO_BRAND } from '../../data/anurgoData';

interface AboutSectionProps {
  onContactClick?: () => void;
  onOpenFeedback?: () => void;
  onOpenTerminal?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onContactClick,
  onOpenFeedback,
  onOpenTerminal,
}) => {
  const introStatement =
    "I DON'T JUST BUILD WEBSITES. I BUILD DIGITAL EXPERIENCES PEOPLE REMEMBER.";

  const trustPillars = [
    {
      icon: ShieldCheck,
      title: '100% Real Work Only',
      tag: 'Zero Fake Social Proof',
      desc: 'No fabricated project screenshots or fake client reviews. The studio grows strictly through real client deliverables and verified project history.',
    },
    {
      icon: Palette,
      title: 'Built For Real Businesses',
      tag: 'Thoughtful Digital Craft',
      desc: 'I focus on creating distinctive, responsive and purposeful websites for real businesses.',
    },
    {
      icon: HeartHandshake,
      title: 'Direct Creator Access',
      tag: '1-on-1 Collaboration',
      desc: 'Work directly with me (Anurag). Zero account managers, zero bloated agency markups, and complete transparency on timelines and deliverables.',
    },
    {
      icon: Store,
      title: 'Engineered For Real Brands',
      tag: 'Local & Commercial Impact',
      desc: 'Tailored for restaurants, cafés, retail shops, malls, salons, and ambitious founders who need distinctive websites that convert visitors into revenue.',
    },
  ];

  return (
    <section
      id="about"
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0C0C0C] px-4 sm:px-6 md:px-10 py-24 sm:py-32 overflow-hidden select-none"
    >
      {/* 4 Decorative Corner 3D Objects with Floating Animation */}
      {/* Top-Left: Moon Icon */}
      <div className="absolute top-[3%] left-[1%] sm:left-[2%] md:left-[4%] w-[90px] sm:w-[130px] md:w-[170px] pointer-events-none z-10 opacity-70 sm:opacity-90">
        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
            alt="3D Moon Icon"
            className="w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* Bottom-Left: 3D Object */}
      <div className="absolute bottom-[4%] left-[2%] sm:left-[4%] md:left-[6%] w-[80px] sm:w-[110px] md:w-[140px] pointer-events-none z-10 opacity-60 sm:opacity-85">
        <motion.div
          animate={{ y: [8, -8, 8], rotate: [2, -2, 2] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
            alt="3D Floating Element"
            className="w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* Top-Right: Lego Icon */}
      <div className="absolute top-[3%] right-[1%] sm:right-[2%] md:right-[4%] w-[90px] sm:w-[130px] md:w-[170px] pointer-events-none z-10 opacity-70 sm:opacity-90">
        <motion.div
          animate={{ y: [6, -6, 6], rotate: [3, -3, 3] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
            alt="3D Lego Icon"
            className="w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* Bottom-Right: 3D Group */}
      <div className="absolute bottom-[4%] right-[2%] sm:right-[4%] md:right-[6%] w-[100px] sm:w-[140px] md:w-[170px] pointer-events-none z-10 opacity-60 sm:opacity-85">
        <motion.div
          animate={{ y: [-7, 7, -7], rotate: [-2, 2, -2] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
            alt="3D Abstract Group"
            className="w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* Center Content Assembly */}
      <div className="relative z-20 w-full max-w-5xl mx-auto space-y-12 sm:space-y-16">
        {/* Editorial Header Block */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
          {/* Section Badge */}
          <FadeIn delay={0} y={20}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#D7E2EA]/20 text-[10px] sm:text-xs font-mono text-orange-400 uppercase tracking-widest font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Meet The Creator • The Vision Behind ANURGO</span>
            </div>
          </FadeIn>

          {/* Big Editorial Heading */}
          <FadeIn delay={0.1} y={30}>
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight text-center"
              style={{ fontSize: 'clamp(2.75rem, 9vw, 110px)' }}
            >
              About me
            </h2>
          </FadeIn>

          {/* Strong Statement Character Reveal */}
          <div className="max-w-[660px] mx-auto px-2">
            <AnimatedText
              text={introStatement}
              className="text-white font-bold leading-tight tracking-tight uppercase"
              style={{ fontSize: 'clamp(1.15rem, 2.4vw, 1.85rem)' }}
            />
          </div>
        </div>

        {/* Creator Hero Card: Anurag Chauhan Profile */}
        <FadeIn delay={0.2} y={25}>
          <div className="relative p-6 sm:p-10 rounded-3xl bg-[#111317]/90 border border-[#D7E2EA]/15 shadow-2xl backdrop-blur-xl overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Creator Portrait & Credential Badges */}
              <div className="lg:col-span-4 flex flex-col items-center text-center sm:text-left sm:items-start gap-4">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#181B22] border-2 border-orange-500/50 p-1 shadow-[0_0_25px_rgba(255,84,0,0.3)]">
                    <img
                      src="/anurag_photo.jpg"
                      alt="Anurag Chauhan — B.Tech CSE Student & Creative Developer"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  {/* Status Indicator */}
                  <div className="absolute -bottom-1 -right-1 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#0C0C0C] border border-emerald-500/50 text-[10px] font-mono font-bold text-emerald-400 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {ANURGO_BRAND.founderName}
                  </h3>
                  <div className="flex items-start justify-center sm:justify-start gap-2">
                    <GraduationCap className="w-4 h-4 shrink-0 text-orange-400 mt-0.5" />
                    <div className="text-xs font-mono font-bold text-orange-400 space-y-0.5 text-center sm:text-left">
                      <div>B.Tech CSE • 2nd Year</div>
                      <div className="text-orange-400/90">Amity University Jharkhand</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#D7E2EA]/60 font-mono">
                    Creative Developer & Engineering Student
                  </p>
                  <p className="text-[11px] text-[#D7E2EA]/75 italic leading-relaxed pt-0.5">
                    &quot;Balancing my studies with hands-on web development and real-world projects.&quot;
                  </p>
                </div>

                {/* Professional Discipline Badges */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#181B22] border border-[#D7E2EA]/15 text-[10px] font-mono text-[#D7E2EA]/80">
                    B.Tech CSE (Year 2)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#181B22] border border-[#D7E2EA]/15 text-[10px] font-mono text-[#D7E2EA]/80">
                    Amity Univ. Jharkhand
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#181B22] border border-[#D7E2EA]/15 text-[10px] font-mono text-[#D7E2EA]/80">
                    Creative Developer
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#181B22] border border-[#D7E2EA]/15 text-[10px] font-mono text-[#D7E2EA]/80">
                    Web Architecture
                  </span>
                </div>
              </div>

              {/* Creator Story & Purpose */}
              <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm text-[#D7E2EA]/85 leading-relaxed">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#161920] border border-[#D7E2EA]/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                    <Compass className="w-4 h-4" />
                    <span>Why I Built ANURGO</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    {ANURGO_BRAND.story}
                  </p>
                </div>

                {/* Radical Transparency Manifesto Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 via-[#181B22] to-[#121419] border border-orange-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>The Transparency Guarantee</span>
                  </div>
                  <p className="text-xs text-[#D7E2EA]/90 leading-relaxed">
                    &quot;{ANURGO_BRAND.transparencyManifesto}&quot;
                  </p>
                  <p className="text-[11px] font-mono text-orange-400/90 font-medium">
                    {ANURGO_BRAND.purposeSummary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* 4 Core Trust Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {trustPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <FadeIn key={idx} delay={0.25 + idx * 0.08} y={20}>
                <div className="h-full p-5 sm:p-6 rounded-2xl bg-[#111317]/80 border border-[#D7E2EA]/15 hover:border-orange-500/40 transition-all duration-300 space-y-3 group hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:text-white group-hover:bg-orange-500 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-orange-400/80 uppercase tracking-wider block font-bold">
                      {item.tag}
                    </span>
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {item.title}
                    </h4>
                  </div>

                  <p className="text-xs text-[#D7E2EA]/65 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Interactive Direct Actions: Work With Anurag & Feedback Trigger */}
        <FadeIn delay={0.5} y={20}>
          <div className="p-5 sm:p-6 rounded-3xl bg-[#161920]/90 border border-[#D7E2EA]/20 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl">
            <div className="space-y-1 text-center md:text-left">
              <div className="text-sm sm:text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
                <span>Want to build something memorable or share improvement ideas?</span>
              </div>
              <p className="text-xs text-[#D7E2EA]/70">
                You work directly with Anurag Chauhan. No bureaucracy, no cookie-cutter templates.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              {/* Primary Contact CTA */}
              <button
                onClick={onContactClick}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,84,0,0.35)] cursor-pointer"
              >
                <span>Start A Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Feedback CTA */}
              {onOpenFeedback && (
                <button
                  onClick={onOpenFeedback}
                  className="px-4 py-2.5 rounded-xl bg-[#1E222A] hover:bg-[#262C36] text-[#D7E2EA] hover:text-white border border-[#D7E2EA]/20 hover:border-orange-500/40 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5 text-orange-400" />
                  <span>Share Feedback</span>
                </button>
              )}

              {/* Terminal Easter Egg */}
              {onOpenTerminal && (
                <button
                  onClick={onOpenTerminal}
                  className="p-2.5 rounded-xl bg-[#1E222A] hover:bg-[#262C36] text-orange-400 hover:text-orange-300 border border-[#D7E2EA]/15 text-xs font-mono transition-colors cursor-pointer"
                  title="Launch Developer Terminal"
                >
                  <Terminal className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default AboutSection;
