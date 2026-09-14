import React, { useRef } from 'react';
import { Sparkles, Eye, ArrowRight, Zap, ExternalLink } from 'lucide-react';
import { SHOWCASE_CONCEPTS, ShowcaseConcept } from '../../data/anurgoData';

interface AnurgoShowcaseMarqueeProps {
  onSelectProjectPreview: (projectId: string) => void;
}

export const AnurgoShowcaseMarquee: React.FC<AnurgoShowcaseMarqueeProps> = ({
  onSelectProjectPreview,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Map showcase item ID to portfolio project ID if exists
  const getProjectId = (conceptId: string) => {
    const map: Record<string, string> = {
      'sc-restaurant': 'savoria-trattoria',
      'sc-cafe': 'aura-coffee',
      'sc-salon': 'lumiere-salon',
      'sc-shop': 'velvet-vine',
      'sc-hotel': 'solstice-hotel',
      'sc-service': 'apex-performance',
    };
    return map[conceptId] || 'savoria-trattoria';
  };

  return (
    <section id="showcase" className="relative py-24 bg-[#040508] border-t border-orange-500/20 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Identity Showcase</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            DIFFERENT BUSINESSES. <span className="text-gradient-fire">ONE GOAL:</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-medium leading-relaxed">
            "Different businesses. Different identities. One goal: a better digital presence."
          </p>

          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
            From candlelit trattorias and specialty coffee roasteries to luxury salons and boutique alpine resorts — explore tailored web concepts built from the ground up.
          </p>
        </div>
      </div>

      {/* Horizontal Continuous Marquee Tracks */}
      <div className="relative mt-12 w-full overflow-hidden group">
        {/* Gradient edge masks */}
        <div className="absolute left-0 inset-y-0 w-16 sm:w-32 bg-gradient-to-r from-[#040508] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-16 sm:w-32 bg-gradient-to-l from-[#040508] to-transparent z-20 pointer-events-none" />

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto no-scrollbar py-4 px-6 select-none cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Double the list for infinite-like horizontal scrolling display */}
          {[...SHOWCASE_CONCEPTS, ...SHOWCASE_CONCEPTS].map((concept, idx) => (
            <div
              key={`${concept.id}-${idx}`}
              onClick={() => onSelectProjectPreview(getProjectId(concept.id))}
              className="w-[300px] sm:w-[360px] md:w-[400px] shrink-0 rounded-3xl bg-[#090D18]/95 border border-slate-800 hover:border-orange-500/70 anurgo-glass anurgo-card-shine overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(255,84,0,0.25)] flex flex-col justify-between cursor-pointer group/card"
            >
              {/* Image Frame & Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src={concept.image}
                  alt={concept.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090D18] via-[#090D18]/30 to-transparent" />

                {/* Top Badge Strip */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-950/90 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                    {concept.demoBadge}
                  </span>

                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-950/90 text-emerald-400 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>{concept.metrics.split('•')[0]}</span>
                  </span>
                </div>

                {/* Category Pill */}
                <div className="absolute bottom-3 left-3">
                  <span
                    className="text-xs font-mono font-bold px-3 py-0.5 rounded-full border shadow-md"
                    style={{
                      backgroundColor: `${concept.accentColor}25`,
                      color: concept.accentColor,
                      borderColor: `${concept.accentColor}60`,
                    }}
                  >
                    {concept.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">
                    CONCEPT {concept.conceptNumber}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-orange-400 group-hover/card:text-orange-300 font-mono font-bold">
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/card:translate-x-1" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white group-hover/card:text-orange-300 transition-colors leading-snug">
                  {concept.title}
                </h3>

                <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed line-clamp-2">
                  {concept.tagline}
                </p>

                {/* Tech Chips */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {concept.tech.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Helper Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex items-center justify-between text-xs font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span>Scroll horizontally or tap any card to test the live prototype viewport</span>
          </span>
          <span className="hidden sm:inline text-slate-400">8 Distinct Business Prototypes</span>
        </div>
      </div>
    </section>
  );
};
