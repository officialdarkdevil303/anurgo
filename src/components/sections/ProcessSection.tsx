import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '../common/FadeIn';
import { Compass, Palette, Code2, Sparkles, Rocket, ArrowRight } from 'lucide-react';

interface ProcessStepData {
  number: string;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  icon: React.ElementType;
}

const PROCESS_STEPS: ProcessStepData[] = [
  {
    number: '01',
    title: 'DISCOVER',
    shortDesc: 'Understand the idea, audience and goals.',
    detailedDesc:
      'Deep alignment on your core brand identity, market positioning, target audience psychology, and key business conversion goals before writing a single line of code.',
    icon: Compass,
  },
  {
    number: '02',
    title: 'DESIGN',
    shortDesc: 'Create the visual direction, interaction and experience.',
    detailedDesc:
      'Crafting distinctive editorial aesthetics, 3D asset concepts, custom typography hierarchy, and interactive prototypes that command instant brand authority.',
    icon: Palette,
  },
  {
    number: '03',
    title: 'BUILD',
    shortDesc: 'Turn the concept into a responsive, high-performance website.',
    detailedDesc:
      'Engineered with modern React, TypeScript, and Tailwind CSS. Clean, modular, fully accessible, and optimized for sub-second global edge performance.',
    icon: Code2,
  },
  {
    number: '04',
    title: 'ANIMATE',
    shortDesc: 'Add meaningful motion, interaction and 3D elements.',
    detailedDesc:
      'Infusing purposeful Framer Motion micro-interactions, WebGL 3D depth, and tactile cursor physics that create a memorable, tactile experience.',
    icon: Sparkles,
  },
  {
    number: '05',
    title: 'LAUNCH',
    shortDesc: 'Polish, optimize and deliver the final experience.',
    detailedDesc:
      'Rigorous cross-device testing, SEO optimization, high-speed asset compression, and 100% full source code delivery ready for immediate deployment.',
    icon: Rocket,
  },
];

export const ProcessSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section
      id="process"
      className="w-full bg-[#0C0C0C] px-5 sm:px-8 md:px-12 py-28 sm:py-36 relative z-10 text-[#D7E2EA] select-none border-t border-[#D7E2EA]/10"
    >
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <FadeIn delay={0} y={20}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#D7E2EA]/20 text-[10px] sm:text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Creative Process</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} y={30}>
            <h2
              className="hero-heading font-black uppercase tracking-tight leading-none text-center"
              style={{ fontSize: 'clamp(2.5rem, 9vw, 120px)' }}
            >
              THE ANURGO SYSTEM
            </h2>
          </FadeIn>

          <FadeIn delay={0.2} y={20}>
            <p className="text-[#D7E2EA]/70 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto font-sans">
              A refined 5-step creative pipeline that takes ideas from raw vision to unforgettable digital experiences.
            </p>
          </FadeIn>
        </div>

        {/* Interactive Steps Grid & Step Detail Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 5 Interactive Step Items with Connecting Line */}
          <div className="lg:col-span-7 relative space-y-4">
            {/* Background Connecting Line */}
            <div className="absolute left-[34px] sm:left-[42px] top-6 bottom-6 w-[2px] bg-[#D7E2EA]/10 z-0 pointer-events-none" />

            {PROCESS_STEPS.map((step, idx) => {
              const isSelected = activeStep === idx;
              const IconComponent = step.icon;

              return (
                <motion.div
                  key={step.number}
                  onMouseEnter={() => setActiveStep(idx)}
                  onClick={() => setActiveStep(idx)}
                  className={`relative z-10 p-5 sm:p-6 rounded-[28px] transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#161616] border-orange-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.8)] shadow-orange-500/5'
                      : 'bg-[#121212] border-[#D7E2EA]/15 hover:border-[#D7E2EA]/30'
                  }`}
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    {/* Step Number & Icon Badge */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-mono font-black text-sm sm:text-base shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-orange-500 text-black shadow-[0_0_20px_rgba(255,84,0,0.5)]'
                          : 'bg-[#1C1C1C] text-[#D7E2EA]/70 border border-[#D7E2EA]/20'
                      }`}
                    >
                      {step.number}
                    </div>

                    {/* Step Title & Summary */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`font-black uppercase tracking-tight text-base sm:text-xl transition-colors ${
                            isSelected ? 'text-white' : 'text-[#D7E2EA]/80'
                          }`}
                        >
                          {step.title}
                        </h3>

                        <IconComponent
                          className={`w-4 h-4 transition-colors ${
                            isSelected ? 'text-orange-400' : 'text-[#D7E2EA]/30'
                          }`}
                        />
                      </div>

                      <p className="text-xs sm:text-sm text-[#D7E2EA]/65 font-sans leading-relaxed">
                        {step.shortDesc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Active Step Interactive Deep-Dive Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-8 sm:p-10 rounded-[36px] bg-[#141414] border-2 border-[#D7E2EA]/20 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl sm:text-5xl font-black text-orange-500 font-mono">
                  {PROCESS_STEPS[activeStep].number}
                </span>

                <div className="px-3 py-1 rounded-full bg-[#1F1F1F] border border-[#D7E2EA]/20 text-[10px] font-mono text-[#D7E2EA]/80 uppercase tracking-widest">
                  PHASE {activeStep + 1} OF 5
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                  {PROCESS_STEPS[activeStep].title}
                </h4>
                <p className="text-orange-400 text-xs sm:text-sm font-mono font-medium">
                  {PROCESS_STEPS[activeStep].shortDesc}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#D7E2EA]/75 leading-relaxed font-sans border-t border-[#D7E2EA]/10 pt-4">
                {PROCESS_STEPS[activeStep].detailedDesc}
              </p>

              <div className="pt-2">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-white hover:text-orange-400 uppercase tracking-wider transition-colors"
                >
                  <span>Discuss Your Project</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
