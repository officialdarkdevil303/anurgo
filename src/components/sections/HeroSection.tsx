import React, { useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { FadeIn } from '../common/FadeIn';
import { Transparent3DFace } from '../common/Transparent3DFace';
import { ArrowRight, Sparkles, Eye } from 'lucide-react';

interface HeroSectionProps {
  onContactClick?: () => void;
  onExploreWorkClick?: () => void;
}

const PRIMARY_AVATAR = {
  src: '/anurgo_3d_creator.png',
  alt: 'Anurag – Founder & Creative Developer at ANURGO',
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onContactClick,
  onExploreWorkClick,
}) => {
  const heroRef = useRef<HTMLElement | null>(null);

  // Motion values for subtle, smooth cursor tracking with cinematic easing
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Highly refined, damped spring physics for silky, cinematic horizontal parallax (no sudden jump, no shaking, no lag)
  const springConfig = { damping: 42, stiffness: 65, mass: 1.0 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Subtle 3D perspective orientation / gentle cinematic tilt (max ~1.5 deg, completely natural, no distortion)
  // smoothY is strictly clamped to [-5, 0] so downward motion is strictly zero
  const rotateX = useTransform(smoothY, [-5, 0], [1.0, 0]);
  const rotateY = useTransform(smoothX, [-10, 10], [-1.5, 1.5]);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Disable cursor following on touch / mobile devices to keep character completely stable
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window);

    if (prefersReducedMotion || isTouchDevice) {
      mouseX.set(0);
      mouseY.set(0);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();

      // Center calculation based on hero section bounds
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.42;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      // Subtle horizontal parallax drift (gentle, cinematic, responsive)
      const targetX = (distX / (rect.width / 2)) * 10;
      const targetY = (distY / (rect.height / 2)) * 5;

      // Strict boundaries:
      // X: small lateral parallax range [-10px, +10px]
      // Y: strictly clamped upward only [-5px, 0px] so the character NEVER moves downward past the divider line
      const clampedX = Math.max(-10, Math.min(10, targetX));
      const clampedY = Math.max(-5, Math.min(0, targetY));

      mouseX.set(clampedX);
      mouseY.set(clampedY);
    };

    const handleMouseLeave = () => {
      // Smoothly return to center when cursor leaves the hero area
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    heroRef.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      heroRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  const handleScrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-between overflow-x-clip bg-[#0C0C0C] pt-24 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-6 md:px-10 select-none"
    >
      {/* Subtle Background Glow behind the Character */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] md:w-[650px] h-[350px] sm:h-[500px] md:h-[650px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* 1. Background Typography: "HI, I'M ANURGO" framing character perfectly */}
      <div className="w-full flex items-center justify-center z-0 overflow-hidden mt-2 sm:mt-4 md:mt-6 px-4 sm:px-6 md:px-8 pointer-events-none">
        <FadeIn delay={0.1} y={30} className="w-full flex justify-center">
          <div
            className="w-full max-w-[1500px] flex items-center justify-between font-black uppercase leading-none select-none tracking-tight"
            style={{
              fontSize: 'clamp(2.75rem, 8.4vw, 130px)',
              background: 'linear-gradient(180deg, #4A5568 0%, #1A202C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              opacity: 0.65,
            }}
          >
            {/* Left Wing: HI, I'M — positioned close to the character's hair */}
            <div className="flex-1 flex items-center justify-end gap-x-4 sm:gap-x-6 md:gap-x-8 pr-1 sm:pr-2">
              <span className="whitespace-nowrap tracking-wide">HI,</span>
              <span className="whitespace-nowrap tracking-tight">I&apos;M</span>
            </div>

            {/* Central Clearance around character head & hair */}
            <div className="w-[190px] sm:w-[240px] md:w-[300px] lg:w-[360px] shrink-0" />

            {/* Right Wing: ANURGO — starting cleanly beside character */}
            <div className="flex-1 flex items-center justify-start pl-1 sm:pl-2">
              <span className="whitespace-nowrap tracking-tight">ANURGO</span>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* 2. Hero Bottom Content: Horizontal Divider line with Character anchored to it */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-end relative z-20 mt-28 sm:mt-36 md:mt-44 pt-6 border-t border-[#D7E2EA]/10">
        {/* Center Character strictly anchored to the divider line: bottom touches the line, NEVER below */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-10 w-[270px] sm:w-[330px] md:w-[390px] lg:w-[440px] pointer-events-auto select-none">
          <FadeIn delay={0.3} y={0}>
            <motion.div
              style={{
                x: smoothX,
                y: smoothY,
                rotateX,
                rotateY,
                transformPerspective: 1000,
              }}
              className="flex flex-col items-center justify-end cursor-default group"
            >
              <div className="w-full flex items-end justify-center">
                <Transparent3DFace
                  src={PRIMARY_AVATAR.src}
                  alt={PRIMARY_AVATAR.alt}
                  isCutout={true}
                  className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)] drop-shadow-[0_0_40px_rgba(255,84,0,0.18)] block align-bottom"
                />
              </div>
            </motion.div>
          </FadeIn>
        </div>

        {/* Left Column: Big Headline */}
        <div className="lg:col-span-6 space-y-2">
          <FadeIn delay={0.35} y={20}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-[10px] sm:text-xs font-mono text-orange-400 uppercase tracking-widest font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Creative Development • 3D Experiences</span>
            </div>

            <h1
              className="font-black uppercase tracking-tight text-white leading-[0.95]"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3.25rem)' }}
            >
              CRAFTING DIGITAL <br />
              <span className="text-orange-500">EXPERIENCES</span> <br />
              PEOPLE REMEMBER.
            </h1>
          </FadeIn>
        </div>

        {/* Right Column: Supporting Description & Dual CTAs */}
        <div className="lg:col-span-6 flex flex-col items-start lg:items-end justify-between space-y-5">
          <FadeIn delay={0.45} y={20} className="max-w-md lg:text-right">
            <p className="text-[#D7E2EA]/75 text-xs sm:text-sm md:text-base leading-relaxed font-sans">
              ANURGO creates immersive websites, interactive experiences, and digital identities designed to make brands stand out.
            </p>
          </FadeIn>

          {/* Dual CTAs: "LET'S BUILD →" & "EXPLORE WORK" */}
          <FadeIn delay={0.55} y={20} className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <button
              onClick={() => {
                if (onContactClick) onContactClick();
                else handleScrollTo('contact');
              }}
              style={{
                background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                boxShadow: '0px 4px 15px rgba(181, 1, 167, 0.3), inset 2px 2px 10px #7721B1',
                outline: '2px solid #FFFFFF',
                outlineOffset: '-2px',
              }}
              className="px-6 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-black text-white font-mono uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,84,0,0.4)] cursor-pointer flex items-center gap-2"
            >
              <span>LET&apos;S BUILD</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (onExploreWorkClick) onExploreWorkClick();
                else handleScrollTo('work');
              }}
              className="px-5 sm:px-6 py-3.5 rounded-full bg-[#181818] hover:bg-[#222222] border-2 border-[#D7E2EA]/30 hover:border-white text-xs sm:text-sm font-bold font-mono text-[#D7E2EA] hover:text-white uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-orange-400" />
              <span>EXPLORE WORK</span>
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
