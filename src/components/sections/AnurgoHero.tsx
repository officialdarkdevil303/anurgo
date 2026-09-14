import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Eye, Sparkles, Zap, Code2, Layers } from 'lucide-react';
import { ANURGO_BRAND } from '../../data/anurgoData';

interface AnurgoHeroProps {
  onSelectProjectPreview?: (projectId: string) => void;
}

export const AnurgoHero: React.FC<AnurgoHeroProps> = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [smoothMouse, setSmoothMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Smooth lerp interpolation for silky mouse look-at parallax
  useEffect(() => {
    let currentX = 0;
    let currentY = 0;

    const loop = () => {
      currentX += (mousePos.x - currentX) * 0.08;
      currentY += (mousePos.y - currentY) * 0.08;
      setSmoothMouse({ x: currentX, y: currentY });
      animFrameRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleNavClick = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[100vh] w-full flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-8 lg:px-14 bg-[#040508] overflow-hidden select-none"
    >
      {/* 1. Cinematic Ambient Lighting & Glow Orbs */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[850px] h-[550px] sm:h-[750px] bg-gradient-to-br from-orange-500/18 via-amber-500/10 to-transparent rounded-full blur-[140px] pointer-events-none transition-transform duration-700 ease-out -z-10"
        style={{
          transform: `translate(calc(-50% + ${smoothMouse.x * 35}px), calc(-50% + ${smoothMouse.y * 35}px))`,
        }}
      />
      <div className="absolute top-16 left-1/4 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-16 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 2. Top Sub-Bar: Studio Status & Creative Category Indicators */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto w-full pt-1 sm:pt-2">
        {/* Availability Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0B0F1C]/90 border border-orange-500/30 text-xs font-mono text-orange-300 shadow-neon-orange-sm backdrop-blur-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="font-bold tracking-wider uppercase text-[11px]">
            {ANURGO_BRAND.availabilityStatus}
          </span>
        </div>

        {/* Creator Meta Pills */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
            3D CREATOR
          </span>
          <span className="text-orange-500 font-bold">•</span>
          <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
            CREATIVE DEV
          </span>
          <span className="text-orange-500 font-bold">•</span>
          <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
            UI/UX DESIGN
          </span>
        </div>
      </div>

      {/* 3. Center Visual Arena: Oversized Typography + 3D Centerpiece */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full my-auto min-h-[460px] sm:min-h-[540px] lg:min-h-[600px]">
        {/* Oversized MotionSites Display Typography behind 3D Object */}
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-[58%] sm:-translate-y-[55%] flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden"
          style={{
            transform: `translate(calc(-0% + ${smoothMouse.x * -16}px), calc(-55% + ${smoothMouse.y * -12}px))`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          <h1
            className="font-display font-extrabold uppercase text-[#2B354C]/40 sm:text-[#2E3B56]/50 lg:text-[#3B4C6E]/60 text-center tracking-tight leading-none select-none whitespace-nowrap"
            style={{
              fontSize: 'clamp(56px, 14vw, 190px)',
              letterSpacing: '-0.04em',
              textShadow: '0 0 100px rgba(0,0,0,0.9), 0 0 40px rgba(255,84,0,0.1)',
            }}
          >
            HI, I'M ANURGO
          </h1>
        </div>

        {/* 3D Centerpiece: Stylized 3D Creator Floating Bust */}
        <div
          className="relative z-10 flex items-center justify-center preserve-3d transition-transform duration-150 ease-out"
          style={{
            transform: `perspective(1200px) rotateY(${smoothMouse.x * 16}deg) rotateX(${smoothMouse.y * -14}deg) translateZ(40px)`,
          }}
        >
          {/* Ambient Glow Aura */}
          <div className="absolute inset-0 -m-10 bg-gradient-to-t from-orange-500/25 via-amber-500/15 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

          {/* 3D Floating Avatar Container */}
          <div className="relative w-[300px] sm:w-[400px] md:w-[460px] lg:w-[500px] aspect-square flex items-center justify-center group animate-float-slow">
            {/* 3D Character Image (Pitch black background blends seamlessly) */}
            <img
              src="/anurgo_3d_creator.jpg"
              alt="ANURGO - 3D Creator & Creative Developer"
              className="w-full h-full object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)] drop-shadow-[0_0_40px_rgba(255,84,0,0.3)] transition-transform duration-700 pointer-events-auto"
              draggable={false}
            />

            {/* Seamless Bottom Vignette Fade */}
            <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#040508] via-[#040508]/80 to-transparent pointer-events-none" />

            {/* Floating 3D Micro UI Pill - Left */}
            <div
              className="hidden md:flex absolute -left-6 lg:-left-12 top-24 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#090E1C]/90 border border-orange-500/30 backdrop-blur-xl shadow-2xl transition-transform duration-300"
              style={{
                transform: `translate(${smoothMouse.x * -24}px, ${smoothMouse.y * -18}px) translateZ(60px)`,
              }}
            >
              <div className="p-1.5 rounded-xl bg-orange-500/20 text-orange-400">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-left font-mono">
                <div className="text-xs font-bold text-white tracking-wide">60 FPS 3D</div>
                <div className="text-[10px] text-slate-400">WebGL & React 19</div>
              </div>
            </div>

            {/* Floating 3D Micro UI Pill - Right */}
            <div
              className="hidden md:flex absolute -right-6 lg:-right-12 bottom-28 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#090E1C]/90 border border-orange-500/30 backdrop-blur-xl shadow-2xl transition-transform duration-300"
              style={{
                transform: `translate(${smoothMouse.x * 24}px, ${smoothMouse.y * 18}px) translateZ(60px)`,
              }}
            >
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left font-mono">
                <div className="text-xs font-bold text-white tracking-wide">&lt; 0.6s Speed</div>
                <div className="text-[10px] text-emerald-400">100/100 Vitals</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Composition: Editorial Subtitle (Left) & MotionSites Glowing CTA (Right) */}
      <div className="relative z-20 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pt-4 border-t border-slate-800/80">
        {/* Editorial Subtitle & Creative Manifesto */}
        <div className="max-w-xl text-center md:text-left space-y-2">
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-200 leading-relaxed font-sans">
            A 3D CREATOR & CREATIVE DEVELOPER DRIVEN BY CRAFTING STRIKING AND UNFORGETTABLE WEB EXPERIENCES.
          </p>
          <div className="flex items-center justify-center md:justify-start gap-2 text-[11px] font-mono text-orange-400/90 font-medium">
            <span>DIGITAL DESIGN</span>
            <span>&bull;</span>
            <span>CREATIVE ENGINEERING</span>
            <span>&bull;</span>
            <span>INTERACTIVE 3D</span>
          </div>
        </div>

        {/* Glowing MotionSites-Style Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-wrap justify-center">
          {/* Secondary Action: Explore Work */}
          <a
            href="#portfolio"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#portfolio');
            }}
            className="px-5 sm:px-6 py-3.5 rounded-full bg-[#0A0F1E] hover:bg-[#12192F] text-slate-300 hover:text-white font-mono text-xs font-bold border border-slate-800 hover:border-orange-500/50 transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-orange-400" />
            <span>EXPLORE WORK</span>
          </a>

          {/* Primary Action: MotionSites Glowing Gradient Pill */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-slate-950 font-display text-sm tracking-wider font-extrabold uppercase shadow-neon-orange hover:shadow-neon-orange-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Shimmer Sheen Layer */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <span className="relative z-10">CONTACT ME</span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default AnurgoHero;
