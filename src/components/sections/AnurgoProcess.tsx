import React, { useState } from 'react';
import { MessageSquareText, Palette, Sliders, Rocket, CheckCircle2, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { PROCESS_STEPS, ProcessStep } from '../../data/anurgoData';

const stepIconMap: Record<string, React.ReactNode> = {
  MessageSquareText: <MessageSquareText className="w-5 h-5 text-orange-400" />,
  Palette: <Palette className="w-5 h-5 text-orange-400" />,
  Sliders: <Sliders className="w-5 h-5 text-orange-400" />,
  Rocket: <Rocket className="w-5 h-5 text-orange-400" />,
};

export const AnurgoProcess: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeStep = PROCESS_STEPS[activeStepIndex];

  return (
    <section id="process" className="relative py-28 bg-[#040508] anurgo-grid-bg border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Structured 4-Step Playbook</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            HOW IT <span className="text-gradient-fire">WORKS.</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From initial business discovery to global edge launch, we keep everything transparent, collaborative, and fast.
          </p>
        </div>

        {/* 4 Process Step Cards Grid with Interactive Focus */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((item, index) => {
            const isActive = activeStepIndex === index;
            return (
              <div
                key={item.step}
                onClick={() => setActiveStepIndex(index)}
                className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#0E1426] border-orange-500 shadow-neon-orange anurgo-card-shine scale-[1.03]'
                    : 'bg-[#080B14]/85 border-slate-800 hover:border-orange-500/50 hover:bg-[#0B0F1C]'
                }`}
              >
                <div className="space-y-4">
                  {/* Step Badge & Duration */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold font-mono text-orange-400">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-400" />
                      {item.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30">
                      {stepIconMap[item.icon]}
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Deliverables List */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider block">
                    Deliverables:
                  </span>
                  {item.deliverables.map((deliv, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="truncate">{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Phase In-Depth Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#090D1A] border border-orange-500/30 anurgo-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 font-bold">
              <span>ACTIVE PHASE BREAKDOWN &bull; {activeStep.number}</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white">
              {activeStep.title} ({activeStep.duration})
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {activeStep.details}
            </p>
          </div>

          <a
            href="#contact"
            className="px-7 py-3.5 rounded-2xl bg-orange-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-neon-orange hover:bg-orange-400 transition-all shrink-0 cursor-pointer"
          >
            <span>Book a Website</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
