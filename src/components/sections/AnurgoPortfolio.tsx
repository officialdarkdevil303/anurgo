import React, { useState } from 'react';
import { 
  Eye, 
  Sparkles, 
  Layers, 
  Zap, 
  CheckCircle2, 
  ArrowUpRight,
  Filter,
  Monitor,
  Cpu
} from 'lucide-react';
import { TiltCard } from '../common/TiltCard';
import { PORTFOLIO_PROJECTS, PortfolioProject } from '../../data/anurgoData';

interface AnurgoPortfolioProps {
  onSelectProjectPreview: (projectId: string) => void;
}

type FilterCategory = 'all' | 'restaurant' | 'cafe' | 'salon' | 'shop' | 'hotel' | 'service';

export const AnurgoPortfolio: React.FC<AnurgoPortfolioProps> = ({ onSelectProjectPreview }) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filterTabs: { label: string; value: FilterCategory }[] = [
    { label: 'All Projects (6)', value: 'all' },
    { label: 'Trattorias & Dining', value: 'restaurant' },
    { label: 'Cafés & Roasteries', value: 'cafe' },
    { label: 'Salons & Wellness', value: 'salon' },
    { label: 'Boutiques & Luxury', value: 'shop' },
    { label: 'Hotels & Lodges', value: 'hotel' },
    { label: 'Services & Tech', value: 'service' },
  ];

  const filteredProjects = activeFilter === 'all'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="relative py-28 sm:py-32 bg-[#040508] anurgo-grid-bg border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Selected Works & Case Studies</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight">
              FEATURED <span className="text-gradient-fire">PROJECTS.</span>
            </h2>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              A curated collection of bespoke, interactive web experiences engineered with creative storytelling, sub-second performance, and conversion focus.
            </p>
          </div>

          {/* Transparent Demo Concept Indicator */}
          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#090D18] border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Interactive Live Demo Prototypes</span>
            </span>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-4 py-2 rounded-2xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === tab.value
                  ? 'bg-orange-500 text-slate-950 font-bold shadow-neon-orange-sm scale-105'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cinematic Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredProjects.map((project, idx) => (
            <TiltCard
              key={project.id}
              maxTilt={4}
              glowColor="amber"
              className="rounded-3xl bg-[#090D18]/90 border border-slate-800/90 hover:border-orange-500/60 anurgo-glass anurgo-card-shine overflow-hidden flex flex-col justify-between group shadow-2xl transition-all duration-300"
            >
              {/* Top Widescreen Project Preview */}
              <div>
                <div 
                  className="relative aspect-[16/10] overflow-hidden cursor-pointer"
                  onClick={() => onSelectProjectPreview(project.id)}
                >
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090D18] via-[#090D18]/20 to-black/60 opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

                  {/* Top Bar inside Image: Number & Metrics */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-orange-500 text-slate-950 shadow-md">
                        {project.projectNumber}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-950/90 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                        {project.badgeText}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-950/90 text-emerald-400 border border-emerald-500/40 backdrop-blur-md">
                      <Zap className="w-3 h-3" />
                      <span>{project.caseStudy.performanceMetrics.lighthouse}/100</span>
                    </div>
                  </div>

                  {/* Hover Overlay Prompt */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    <div className="px-4 py-2 rounded-full bg-orange-500 text-slate-950 font-display text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-neon-orange">
                      <Eye className="w-3.5 h-3.5" />
                      <span>LAUNCH PROTOTYPE</span>
                    </div>
                  </div>

                  {/* Category Pill on Image Bottom */}
                  <div className="absolute bottom-3 left-3.5">
                    <span
                      className="text-xs font-mono font-bold px-3 py-1 rounded-full border shadow-md backdrop-blur-md"
                      style={{
                        backgroundColor: `${project.accentColor}25`,
                        color: project.accentColor,
                        borderColor: `${project.accentColor}60`,
                      }}
                    >
                      {project.businessType}
                    </span>
                  </div>
                </div>

                {/* Card Content & Narrative */}
                <div className="p-6 sm:p-7 space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-orange-300 transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-xs font-mono text-slate-500 mt-1">2026</span>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {project.tagline}
                  </p>

                  {/* Key Features */}
                  <div className="pt-3 space-y-1.5 border-t border-slate-800/80">
                    {project.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Action Bar */}
              <div className="p-6 sm:p-7 pt-0 space-y-3">
                <button
                  onClick={() => onSelectProjectPreview(project.id)}
                  className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-neon-orange-sm transition-all cursor-pointer group-hover:shadow-neon-orange"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>VIEW LIVE CASE STUDY</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                  <span>Stack: {project.techStack.slice(0, 2).join(', ')}</span>
                  <span className="text-emerald-400 font-bold">
                    {project.caseStudy.performanceMetrics.loadTime} Load
                  </span>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnurgoPortfolio;
