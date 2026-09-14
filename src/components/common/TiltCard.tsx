import React, { useRef, useState, useCallback } from 'react';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum rotation in degrees (default: 4.5)
  glareOpacity?: number;
  scale?: number;
  glowColor?: 'cyan' | 'purple' | 'emerald' | 'rose' | 'amber';
  disabled?: boolean;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 4.5,
  glareOpacity = 0.14,
  scale = 1.015,
  glowColor = 'cyan',
  disabled = false,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    // Calculate rotation between -maxTilt and +maxTilt
    const rotateY = ((x / width) - 0.5) * (maxTilt * 2);
    const rotateX = ((y / height) - 0.5) * -(maxTilt * 2);

    const glareX = (x / width) * 100;
    const glareY = (y / height) * 100;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
    );
    setGlarePosition({ x: glareX, y: glareY, opacity: glareOpacity });
  }, [disabled, maxTilt, glareOpacity, scale]);

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  const glowBorderClass = {
    cyan: 'hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(0,240,255,0.22)]',
    purple: 'hover:border-purple-400/60 hover:shadow-[0_0_25px_rgba(168,85,247,0.22)]',
    emerald: 'hover:border-emerald-400/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.22)]',
    rose: 'hover:border-rose-400/60 hover:shadow-[0_0_25px_rgba(239,68,68,0.22)]',
    amber: 'hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(245,158,11,0.22)]',
  }[glowColor];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
        willChange: 'transform',
      }}
      className={`relative preserve-3d transition-shadow duration-300 ${glowBorderClass} ${className}`}
      {...rest}
    >
      {/* Dynamic Moving Specular Reflection Layer */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-10 transition-opacity duration-300 overflow-hidden"
        style={{
          opacity: glarePosition.opacity,
          background: `radial-gradient(circle 280px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.4), transparent 70%)`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Card Content with subtle 3D Elevation */}
      <div className="relative z-0 w-full h-full">
        {children}
      </div>
    </div>
  );
};
