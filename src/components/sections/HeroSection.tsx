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
  src: '/anurgo_3d_creator.jpg',
  alt: 'Anurag — Founder & Creative Developer at ANURGO',
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onContactClick,
  onExploreWorkClick,
}) => {
  const heroRef = useRef<HTMLElement | null>(null);

  // Motion values for lively, fluid cursor tracking with physics spring
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Responsive, lively spring physics matching original magnetic feel
  const springConfig = { damping: 18, stiffness: 140, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D perspective orientation / tilt responding dynamically to cursor position
  const rotateX = useTransform(smoothY, [-45, 8], [8, -4]);
  const rotateY = useTransform(smoothX, [-60, 60], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();

      // Track mouse within the viewport / hero area
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.4;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      // Dynamic lively magnetic calculation (like original strength = 2.8)
      const targetX = distX / 2.8;
      const targetY = distY / 2.8;

      // Clamping limits:
      // X allows wide, lively magnetic following (-60px to +60px)
      // Y allows full upward movement (-45px), but strictly clamps downward to +8px
      // so the avatar NEVER crosses the hero bottom boundary
      const clampedX = Math.max(-60, Math.min(60, targetX));
      const clampedY = Math.max(-45, Math.min(8, targetY));

      mouseX.set(clampedX);
      mouseY.set(clampedY);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
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

      {/* 1. Background Typography: "HI, I'M ANURGO" */}
      <div className="w-full flex items-center justify-center z-0 overflow-hidden mt-2 sm:mt-4 md:mt-6 px-2 pointer-events-none">
        <FadeIn delay={0.1} y={30} className="w-full flex justify-center">
          <h2
            className="font-black uppercase tracking-tight leading-none whitespace-nowrap text-center w-full select-none"
            style={{
              fontSize: 'clamp(3.5rem, 13.5vw, 210px)',
              background: 'linear-gradient(180deg, #2D3748 0%, #151B26 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              opacity: 0.55,
            }}
          >
            Hi, i&apos;m anurgo
          </h2>
        </FadeIn>
      </div>

      {/* 2. Center 3D Character with Lively Magnetic Cursor Following & Bottom Clamping */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10 w-[290px] sm:w-[380px] md:w-[460px] lg:w-[520px] top-[37%] sm:top-[40%] md:top-[42%] -translate-y-1/2 pointer-events-auto">
        <FadeIn delay={0.3} y={20}>
          <motion.div
            style={{
              x: smoothX,
              y: smoothY,
              rotateX,
              rotateY,
              transformPerspective: 1000,
            }}
            className="flex flex-col items-center justify-center cursor-default group"
          >
            {/* Smooth Floating Y Bobbing Animation */}
            <motion.div
              animate={{
                y: [-6, 6, -6],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-full flex items-center justify-center"
            >
              <Transparent3DFace
                src={PRIMARY_AVATAR.src}
                alt={PRIMARY_AVATAR.alt}
                isCutout={false}
                className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)] drop-shadow-[0_0_40px_rgba(255,84,0,0.18)]"
              />
            </motion.div>
          </motion.div>
        </FadeIn>
      </div>

      {/* 3. Hero Bottom Content: Headline, Supporting Text & Dual CTAs */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-end relative z-20 mt-36 sm:mt-48 md:mt-56 pt-6 border-t border-[#D7E2EA]/10">
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
