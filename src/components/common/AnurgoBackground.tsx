import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulseSpeed: number;
  color: string;
}

export const AnurgoBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Subtle sparse particle count for lightweight performance and clean ambiance
    const isMobile = width < 768;
    const particleCount = isMobile ? 18 : 36;
    const particles: Particle[] = [];

    const colors = [
      'rgba(255, 84, 0,',   // Electric Flame Orange
      'rgba(245, 158, 11,',  // Glowing Amber
      'rgba(215, 226, 234,', // Studio Silver
    ];

    for (let i = 0; i < particleCount; i++) {
      const z = Math.random() * 0.8 + 0.5;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        vx: (Math.random() - 0.5) * 0.15 * z,
        vy: (Math.random() - 0.5) * 0.15 * z,
        radius: (Math.random() * 1.2 + 0.6) * z,
        alpha: (Math.random() * 0.25 + 0.08) * z,
        pulseSpeed: Math.random() * 0.006 + 0.002,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;

          p.alpha += p.pulseSpeed;
          if (p.alpha > 0.45 || p.alpha < 0.08) {
            p.pulseSpeed = -p.pulseSpeed;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <>
      {/* Dynamic Ambient Background Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-60"
        aria-hidden="true"
      />

      {/* Subtle Studio Grid lines */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #FFFFFF 1px, transparent 1px),
            linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)
          `,
          backgroundSize: '54px 54px',
        }}
        aria-hidden="true"
      />

      {/* Physical film noise texture overlay */}
      <div className="anurgo-noise-overlay" aria-hidden="true" />

      {/* Ambient background soft glow orbs */}
      <div className="fixed top-1/4 -left-28 w-96 h-96 bg-orange-500/8 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-1/3 -right-28 w-96 h-96 bg-amber-500/6 rounded-full blur-[160px] pointer-events-none z-0" />
    </>
  );
};

export default AnurgoBackground;
