import React, { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from '../common/FadeIn';
import { ArrowUpRight, Sparkles, Lock } from 'lucide-react';
import { DemoCautionBarrier } from '../common/DemoCautionBarrier';
import { DemoLockedModal } from '../common/DemoLockedModal';

export interface ProjectCardData {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  techStack: string[];
  col1Img1: string;
  col1Img2: string;
  col2Img: string;
  projectType?: 'concept' | 'client';
  badgeLabel?: string;
}

const PROJECTS_DATA: ProjectCardData[] = [
  {
    id: 'nextlevel-studio',
    number: '01',
    category: 'Creative Portfolio • 3D Experience',
    title: 'NEXTLEVEL STUDIO',
    description:
      'An immersive 3D agency portfolio concept featuring fluid WebGL physics, kinetic typography, and interactive showcase grids designed to demonstrate high-end digital craft.',
    techStack: ['React', 'Three.js', 'Framer Motion', 'Tailwind CSS'],
    projectType: 'concept',
    badgeLabel: 'DEMO PROJECT // CASE STUDY SPEC',
    col1Img1:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    col1Img2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
    col2Img:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
  },
  {
    id: 'aura-brand',
    number: '02',
    category: 'SaaS / Startup Website • Design System',
    title: 'AURA BRAND IDENTITY',
    description:
      'Modern concept design system and SaaS dashboard demo featuring real-time analytics visualization, bespoke icon sets, and multi-platform dark mode UI kit.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'WebGL'],
    projectType: 'concept',
    badgeLabel: 'DEMO PROJECT // CASE STUDY SPEC',
    col1Img1:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
    col1Img2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
    col2Img:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
  },
  {
    id: 'solaris-digital',
    number: '03',
    category: 'E-commerce Website • 3D Visualizer',
    title: 'SOLARIS DIGITAL',
    description:
      'Direct-to-consumer digital concept store featuring interactive 3D product configurations, instant cart physics, and sub-second edge CDN hosting architecture.',
    techStack: ['React', '3D Canvas', 'Tailwind CSS', 'Edge CDN'],
    projectType: 'concept',
    badgeLabel: 'DEMO PROJECT // CASE STUDY SPEC',
    col1Img1:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
    col1Img2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
    col2Img:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
  },
];

interface ProjectCardProps {
  project: ProjectCardData;
  index: number;
  totalCards: number;
  onLiveProjectClick?: () => void;
}

const StickyProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  totalCards,
  onLiveProjectClick,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  // Medium-speed 3D Flip-Up calculation
  const rotateX = useTransform(scrollYProgress, [0, 0.45, 0.9, 1], [22, 0, 0, -4]);
  const y = useTransform(scrollYProgress, [0, 0.45], [70, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0.35, 1]);
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [0.94, 1, targetScale]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMouseOffset({ x, y, active: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseOffset((prev) => ({ ...prev, active: false }));
  }, []);

  return (
    <div
      ref={containerRef}
      className="sticky top-20 sm:top-24 md:top-32 mb-14 sm:mb-20 md:mb-24 flex justify-center"
      style={{ top: `calc(5rem + ${index * 30}px)` }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          y,
          opacity,
          scale,
          transformPerspective: 1200,
          transformOrigin: 'top center',
        }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="relative overflow-hidden w-full max-w-6xl rounded-[36px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA]/30 hover:border-orange-500/50 bg-[#0C0C0C] p-5 sm:p-7 md:p-9 space-y-6 shadow-2xl transition-all duration-300 hover:shadow-[0_25px_80px_rgba(255,84,0,0.14)] group"
      >
        {/* Subtle Specular Glow Follower on Card Surface */}
        {mouseOffset.active && (
          <div
            className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 380px at ${mouseOffset.x}px ${mouseOffset.y}px, rgba(255, 84, 0, 0.08), transparent 70%)`,
            }}
          />
        )}

        {/* Top Header Row: Project Number, Category, Title & View Project CTA */}
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[#D7E2EA]/10">
          <div className="flex items-center gap-4 sm:gap-7">
            <span
              className="font-black leading-none text-[#D7E2EA] select-none font-mono group-hover:text-orange-400 transition-colors"
              style={{ fontSize: 'clamp(2.5rem, 6.5vw, 90px)' }}
            >
              {project.number}
            </span>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider ${
                    project.projectType === 'client'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      project.projectType === 'client' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                    }`}
                  />
                  {project.badgeLabel ||
                    (project.projectType === 'client'
                      ? 'CLIENT PROJECT • DELIVERED'
                      : 'SELF-INITIATED CONCEPT')}
                </span>

                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
                  {project.category}
                </span>
              </div>

              <h3
                className="font-black uppercase tracking-tight text-white leading-none group-hover:text-white transition-colors"
                style={{ fontSize: 'clamp(1.1rem, 2.8vw, 2.5rem)' }}
              >
                {project.title}
              </h3>
            </div>
          </div>

          {/* VIEW CONCEPT / VIEW PROJECT CTA Button */}
          <button
            onClick={onLiveProjectClick}
            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#181510] hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/50 hover:border-amber-400 font-mono font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.2)] group-hover:scale-105"
            title="Click to view locked demo project specification"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:text-black transition-colors" />
            <span>LOCKED • DEMO ONLY</span>
          </button>
        </div>

        {/* Project Description & Capabilities Pills */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-[#D7E2EA]/75 max-w-2xl leading-relaxed font-sans">
            {project.description}
          </p>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md bg-[#161616] border border-[#D7E2EA]/15 text-[10px] sm:text-xs font-mono text-[#D7E2EA]/70"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Row: 2-Column Responsive High-Res Image Showcase Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 md:gap-6 pt-2">
          {/* Yellow Crime Scene / Caution Barrier Tape Crossed Over Demo Projects */}
          <DemoCautionBarrier
            projectTitle={project.title}
            projectNumber={project.number}
            onClick={onLiveProjectClick}
          />
          {/* Left Column (40% width on md+): 2 stacked images */}
          <div className="md:col-span-5 flex flex-col gap-3 sm:gap-4 md:gap-6">
            <div className="w-full rounded-[24px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-[#161616] h-[170px] sm:h-[210px] md:h-[240px] relative group/img cursor-pointer" onClick={onLiveProjectClick}>
              <img
                src={project.col1Img1}
                alt={`${project.title} Interface 1`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
            </div>

            <div className="w-full rounded-[24px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-[#161616] h-[210px] sm:h-[270px] md:h-[350px] relative group/img cursor-pointer" onClick={onLiveProjectClick}>
              <img
                src={project.col1Img2}
                alt={`${project.title} Interface 2`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Right Column (60% width on md+): 1 tall flagship interface with Evidence/Case-File DEMO PROJECT Watermark */}
          <div className="md:col-span-7 rounded-[24px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-[#161616] min-h-[320px] md:min-h-[614px] relative group/img cursor-pointer" onClick={onLiveProjectClick}>
            <img
              src={project.col2Img}
              alt={`${project.title} Hero Showcase`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />

            {/* Editorial Evidence / Case-File Style "DEMO PROJECT" Stamped Watermark */}
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 pointer-events-none select-none">
              <div className="rotate-[-6deg] sm:rotate-[-7deg] border-2 border-dashed border-orange-500/80 bg-[#0C0C0C]/90 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded shadow-[0_12px_35px_rgba(0,0,0,0.95)] flex flex-col items-start font-mono">
                <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] uppercase tracking-[0.24em] text-orange-400 font-bold border-b border-orange-500/30 pb-1 w-full justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    <span>EVIDENCE FILE // ARCHIVE</span>
                  </span>
                  <span className="text-[#D7E2EA]/50 text-[7px] sm:text-[8px]">REF: DEMO-{project.number}</span>
                </div>
                <div className="flex items-center gap-2 pt-1.5 pb-0.5">
                  <span className="text-xs sm:text-sm font-black tracking-[0.28em] text-white uppercase drop-shadow">
                    DEMO PROJECT
                  </span>
                </div>
                <span className="text-[7.5px] sm:text-[8.5px] tracking-[0.18em] text-[#D7E2EA]/70 uppercase">
                  CONCEPT DEMONSTRATION · NOT CLIENT WORK
                </span>
              </div>
            </div>

            {/* Subtle Stamped Case Verification Stamp at bottom */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-20 pointer-events-none select-none">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0C0C0C]/85 backdrop-blur-sm border border-[#D7E2EA]/20 rounded-sm font-mono text-[8.5px] sm:text-[9.5px] tracking-[0.2em] text-[#D7E2EA]/75 uppercase -rotate-1">
                <span className="text-orange-400 font-bold">[DEMO SPECIFICATION]</span>
                <span>INTERNAL PORTFOLIO EXHIBIT</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface ProjectsSectionProps {
  onProjectSelect?: (projectId: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onProjectSelect }) => {
  const [lockedProject, setLockedProject] = useState<ProjectCardData | null>(null);

  return (
    <section
      id="work"
      className="w-full bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-4 sm:px-6 md:px-10 pt-24 sm:pt-32 pb-36 select-none"
    >
      {/* Section Heading */}
      <FadeIn delay={0} y={40} className="w-full text-center mb-16 sm:mb-20 md:mb-24">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-orange-500/30 text-[10px] sm:text-xs font-mono text-orange-400 uppercase tracking-widest font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Self-Initiated Concept Showcase • Demo Projects</span>
        </div>

        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Selected Concepts
        </h2>

        {/* Transparent Honest Disclaimer */}
        <div className="mt-5 sm:mt-6 max-w-2xl mx-auto px-5 py-3.5 rounded-2xl bg-[#141414]/80 border border-[#D7E2EA]/10 backdrop-blur-sm">
          <p className="text-xs sm:text-sm text-[#D7E2EA]/85 font-sans leading-relaxed text-center">
            Self-initiated concepts created to demonstrate the kind of digital experiences ANURGO can build for real businesses. These are demo projects, not client work.
          </p>
        </div>
      </FadeIn>

      {/* 3 Stacking Real Digital Project Cards */}
      <div className="w-full max-w-6xl mx-auto relative">
        {PROJECTS_DATA.map((project, index) => (
          <StickyProjectCard
            key={project.id}
            project={project}
            index={index}
            totalCards={PROJECTS_DATA.length}
            onLiveProjectClick={() => setLockedProject(project)}
          />
        ))}
      </div>

      {/* Interactive Locked Demo Modal */}
      <DemoLockedModal
        isOpen={!!lockedProject}
        project={lockedProject}
        onClose={() => setLockedProject(null)}
        onInspectPreview={(projectId) => {
          setLockedProject(null);
          onProjectSelect?.(projectId);
        }}
      />
    </section>
  );
};

export default ProjectsSection;
