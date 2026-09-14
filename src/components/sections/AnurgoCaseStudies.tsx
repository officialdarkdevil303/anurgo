import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Gauge, 
  ArrowRight, 
  Eye, 
  Code2, 
  Target, 
  Compass,
  Cpu
} from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../../data/anurgoData';

interface AnurgoCaseStudiesProps {
  onSelectProjectPreview: (projectId: string) => void;
  onSelectBookProject: (projectTitle: string) => void;
}

export const AnurgoCaseStudies: React.FC<AnurgoCaseStudiesProps> = ({
  onSelectProjectPreview,
  onSelectBookProject,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PORTFOLIO_PROJECTS[0].id);

  const selectedProject = PORTFOLIO_PROJECTS.find((p) => p.id === selectedProjectId) || PORTFOLIO_PROJECTS[0];

  const handleBookFromCaseStudy = () => {
    onSelectBookProject(selectedProject.title);
    const target = document.getElementById('contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="case-studies" className="relative py-28 bg-[#06080F] anurgo-grid-bg border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Architectural Teardowns</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            BEHIND THE <span className="text-gradient-fire">ENGINEERING & STRATEGY.</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            We don't just glue together pretty pictures. Discover the deliberate strategy, performance engineering, and conversion psychology behind each sample concept.
          </p>
        </div>

        {/* Project Selector Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {PORTFOLIO_PROJECTS.map((proj) => (
            <button
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                selectedProjectId === proj.id
                  ? 'bg-orange-500 text-slate-950 font-bold shadow-neon-orange-sm scale-105'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: proj.accentColor }}
              />
              <span>{proj.title.split(' ')[0]} ({proj.businessType.split(' ')[0]})</span>
            </button>
          ))}
        </div>

        {/* Active Case Study Showcase Card */}
        <div className="p-6 sm:p-10 md:p-12 rounded-3xl bg-[#0B0F1E] border border-orange-500/30 anurgo-glass shadow-2xl space-y-8 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-mono font-bold px-3 py-1 rounded-full border"
                  style={{
                    backgroundColor: `${selectedProject.accentColor}20`,
                    color: selectedProject.accentColor,
                    borderColor: `${selectedProject.accentColor}50`,
                  }}
                >
                  {selectedProject.businessType}
                </span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-amber-500/30">
                  {selectedProject.badgeText}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {selectedProject.title}
              </h3>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
                {selectedProject.tagline}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onSelectProjectPreview(selectedProject.id)}
                className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm border border-slate-700 hover:border-orange-400 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-orange-400" />
                <span>Launch Prototype</span>
              </button>

              <button
                onClick={handleBookFromCaseStudy}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-neon-orange hover:shadow-neon-orange-lg transition-all cursor-pointer"
              >
                <span>Book Similar Build</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4-Pillar Deep Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Project Goal */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                <Target className="w-4 h-4 text-orange-400" />
                <span>01. The Challenge & Core Mission</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {selectedProject.caseStudy.projectGoal}
              </p>
            </div>

            {/* 2. Design Approach */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>02. UI/UX Strategy & Visual Tone</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {selectedProject.caseStudy.designApproach}
              </p>
            </div>

            {/* 3. Key Bespoke Features */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>03. Custom Conversion Workflows</span>
              </div>
              <div className="space-y-2">
                {selectedProject.caseStudy.keyFeatures.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Technical Architecture */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>04. Engineering & Code Stack</span>
              </div>
              <div className="space-y-2 font-mono text-xs text-slate-300">
                {selectedProject.caseStudy.technicalArchitecture.map((arch, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">&gt;</span>
                    <span>{arch}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Outcome & Performance Strip */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#090D18] border border-orange-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <span>Measurable Design Outcome & Real-World Speed</span>
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Target: 100/100 Core Web Vitals
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {selectedProject.caseStudy.designOutcome}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-lg font-bold text-emerald-400 font-mono">
                  {selectedProject.caseStudy.performanceMetrics.lighthouse}/100
                </div>
                <div className="text-[10px] font-mono text-slate-400">Google Lighthouse</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-lg font-bold text-cyan-400 font-mono">
                  {selectedProject.caseStudy.performanceMetrics.loadTime}
                </div>
                <div className="text-[10px] font-mono text-slate-400">First Contentful Paint</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-lg font-bold text-purple-400 font-mono">
                  {selectedProject.caseStudy.performanceMetrics.mobileScore}%
                </div>
                <div className="text-[10px] font-mono text-slate-400">Mobile Fluidity</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-lg font-bold text-amber-400 font-mono">
                  {selectedProject.caseStudy.performanceMetrics.seoScore}/100
                </div>
                <div className="text-[10px] font-mono text-slate-400">Local SEO Schema</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
