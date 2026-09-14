import React, { useState } from 'react';
import { 
  X, 
  Monitor, 
  Tablet, 
  Smartphone, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Gauge, 
  Layers, 
  Palette, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { PortfolioProject } from '../../data/anurgoData';

interface ProjectPreviewModalProps {
  project: PortfolioProject | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectBookProject?: (projectTitle: string) => void;
}

type ViewMode = 'desktop' | 'tablet' | 'mobile';
type ModalTab = 'preview' | 'case-study' | 'design-system';

export const ProjectPreviewModal: React.FC<ProjectPreviewModalProps> = ({
  project,
  isOpen,
  onClose,
  onSelectBookProject,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [activeTab, setActiveTab] = useState<ModalTab>('preview');
  const [activeMenuItem, setActiveMenuItem] = useState<number>(0);

  if (!isOpen || !project) return null;

  const handleBookLikeThis = () => {
    onClose();
    onSelectBookProject?.(project.title);
    const target = document.getElementById('contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[92vh] rounded-2xl bg-[#0A0E18] border border-orange-500/30 shadow-[0_0_60px_rgba(255,94,20,0.25)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-[#0F1424] border-b border-orange-500/20">
          <div className="flex items-center gap-3">
            <div
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: project.accentColor }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  {project.title}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                  {project.badgeText}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                {project.businessType}
              </p>
            </div>
          </div>

          {/* Viewport Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'desktop'
                  ? 'bg-orange-500 text-slate-950 font-bold shadow-neon-orange-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>

            <button
              onClick={() => setViewMode('tablet')}
              className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'tablet'
                  ? 'bg-orange-500 text-slate-950 font-bold shadow-neon-orange-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tablet</span>
            </button>

            <button
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'mobile'
                  ? 'bg-orange-500 text-slate-950 font-bold shadow-neon-orange-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close preview modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2 bg-[#0B0F1C] border-b border-slate-800/80 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Interactive Prototype
            </button>
            <button
              onClick={() => setActiveTab('case-study')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'case-study'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Case Study
            </button>
            <button
              onClick={() => setActiveTab('design-system')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'design-system'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Design Tokens & Palette
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Gauge className="w-3.5 h-3.5" /> Lighthouse: {project.caseStudy.performanceMetrics.lighthouse}/100
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Zap className="w-3.5 h-3.5" /> LCP: {project.caseStudy.performanceMetrics.loadTime}
            </span>
          </div>
        </div>

        {/* Modal Main Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#06080D]">
          {activeTab === 'preview' && (
            <div className="flex flex-col items-center justify-center">
              {/* Device Frame Simulation */}
              <div
                className={`transition-all duration-300 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-[#090D18] flex flex-col ${
                  viewMode === 'desktop'
                    ? 'w-full max-w-5xl'
                    : viewMode === 'tablet'
                    ? 'w-full max-w-[760px]'
                    : 'w-full max-w-[390px]'
                }`}
              >
                {/* Simulated Browser Address Bar */}
                <div className="px-4 py-2.5 bg-[#121829] border-b border-slate-700/80 flex items-center justify-between gap-2 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="px-4 py-1 rounded-md bg-slate-900/90 border border-slate-700 text-slate-300 text-[11px] flex items-center gap-2 max-w-sm truncate">
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">https://demo.{project.id}.anurgo.design</span>
                  </div>
                  <div className="text-[10px] text-orange-400 font-bold hidden sm:block">
                    PROTOTYPE
                  </div>
                </div>

                {/* Simulated Interactive Hero Section */}
                <div className="relative p-6 sm:p-10 md:p-14 overflow-hidden text-center bg-gradient-to-b from-[#11172A] via-[#090D18] to-[#070912]">
                  {/* Subtle Background Image with Dark Overlay */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none mix-blend-luminosity"
                    style={{ backgroundImage: `url(${project.heroImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090D18] via-transparent to-transparent pointer-events-none" />

                  <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border"
                      style={{
                        backgroundColor: `${project.accentColor}20`,
                        color: project.accentColor,
                        borderColor: `${project.accentColor}50`,
                      }}
                    >
                      {project.businessType}
                    </span>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                      {project.livePreviewData.heroHeadline}
                    </h1>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                      {project.livePreviewData.heroSubtitle}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={handleBookLikeThis}
                        className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide text-slate-950 transition-all shadow-lg hover:scale-105 cursor-pointer"
                        style={{ backgroundColor: project.accentColor }}
                      >
                        {project.livePreviewData.ctaLabel}
                      </button>
                      <button
                        onClick={() => setActiveTab('case-study')}
                        className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
                      >
                        Inspect Architecture
                      </button>
                    </div>

                    {/* Stats Strip */}
                    <div className="pt-8 grid grid-cols-3 gap-3 max-w-md mx-auto">
                      {project.livePreviewData.stats.map((stat, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md"
                        >
                          <div
                            className="text-base sm:text-lg font-bold"
                            style={{ color: project.accentColor }}
                          >
                            {stat.value}
                          </div>
                          <div className="text-[10px] sm:text-xs text-slate-400 font-mono">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sample Offerings / Menu / Catalog Showcase */}
                {project.livePreviewData.sampleMenuOrOfferings && (
                  <div className="p-6 sm:p-8 bg-[#0B0F1C] border-t border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-orange-400" />
                        <span>Featured Highlights & Offerings</span>
                      </h4>
                      <span className="text-xs text-slate-400 font-mono">
                        Interactive Showcase
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {project.livePreviewData.sampleMenuOrOfferings.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => setActiveMenuItem(idx)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer ${
                            activeMenuItem === idx
                              ? 'bg-slate-900 border-orange-500/60 shadow-lg'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h5 className="text-sm font-bold text-slate-100">{item.name}</h5>
                            <span
                              className="font-mono text-xs font-bold shrink-0"
                              style={{ color: project.accentColor }}
                            >
                              {item.price}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'case-study' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
              {/* Project Header Info */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {project.title} — Architectural Case Study
                    </h3>
                    <p className="text-xs font-mono text-orange-400 mt-0.5">
                      {project.businessType} &bull; {project.badgeText}
                    </p>
                  </div>

                  <button
                    onClick={handleBookLikeThis}
                    className="px-4 py-2 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-neon-orange-sm hover:bg-orange-400 transition-all cursor-pointer"
                  >
                    <span>Request Similar Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {project.summary}
                </p>
              </div>

              {/* Grid: Goal & Design Approach */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wider font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    Project Challenge & Goal
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {project.caseStudy.projectGoal}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Design & UI/UX Approach
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {project.caseStudy.designApproach}
                  </p>
                </div>
              </div>

              {/* Key Bespoke Features */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Bespoke Interactive Features Implemented
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {project.caseStudy.keyFeatures.map((feat, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Architecture & Performance */}
              <div className="p-5 rounded-2xl bg-[#0C1120] border border-orange-500/30 space-y-4">
                <h4 className="text-sm font-bold text-orange-300 font-mono uppercase tracking-wider flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-orange-400" />
                  Engineering & Performance Targets
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xl font-extrabold text-emerald-400">
                      {project.caseStudy.performanceMetrics.lighthouse}/100
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">Lighthouse Score</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xl font-extrabold text-cyan-400">
                      {project.caseStudy.performanceMetrics.loadTime}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">Page Load (LCP)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xl font-extrabold text-purple-400">
                      {project.caseStudy.performanceMetrics.mobileScore}%
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">Mobile Usability</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xl font-extrabold text-amber-400">
                      {project.caseStudy.performanceMetrics.seoScore}/100
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">Local SEO Score</div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  {project.caseStudy.technicalArchitecture.map((arch, i) => (
                    <div key={i} className="text-xs font-mono text-slate-300 flex items-center gap-2">
                      <span className="text-orange-400">&gt;</span>
                      <span>{arch}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'design-system' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4 text-orange-400" />
                  <span>Color Tokens & Typography Palette</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Every ANURGO project features a bespoke design system created exclusively for that business identity.
                </p>

                {/* Swatches */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {project.livePreviewData.colorPalette.map((color, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3"
                    >
                      <div
                        className="w-10 h-10 rounded-lg shadow-md shrink-0 border border-white/10"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{color.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{color.hex}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>Selected Typography Pairing:</span>
                  <span className="text-orange-400 font-bold">
                    {project.livePreviewData.typography}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Strip */}
        <div className="px-4 sm:px-6 py-3 bg-[#0F1424] border-t border-orange-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>100% Bespoke Code &bull; Zero Template Bloat</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close Preview
            </button>
            <button
              onClick={handleBookLikeThis}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-neon-orange hover:shadow-neon-orange-lg transition-all cursor-pointer"
            >
              <span>Book a Website for Your Business</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
