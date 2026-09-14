import React from 'react';
import { Code, Sparkles, Cpu, Layers, Zap, Check } from 'lucide-react';
import { SKILLS_LIST } from '../../data/anurgoData';

export const AnurgoSkills: React.FC = () => {
  const categories = [
    {
      name: 'Frontend Engineering',
      icon: <Code className="w-4 h-4 text-orange-400" />,
      items: ['React 19', 'TypeScript', 'Next.js', 'Vite', 'HTML5 & Modern Web APIs']
    },
    {
      name: 'Design & Visual Polish',
      icon: <Layers className="w-4 h-4 text-amber-400" />,
      items: ['UI/UX Prototyping (Figma)', 'Tailwind CSS', 'Glassmorphism', 'Micro-Interactions']
    },
    {
      name: 'Performance & Local SEO',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      items: ['Lighthouse 100/100 Optimization', 'Core Web Vitals', 'Schema.org Markup', 'Google Maps Sync']
    },
    {
      name: 'Business Integrations',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      items: ['WhatsApp Direct Chat', 'Table & Service Booking', 'Stripe Payments', 'Email Capture / CRM']
    }
  ];

  return (
    <section id="skills" className="relative py-20 bg-[#06080D] anurgo-grid-bg border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Tools & Architecture</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
            ENGINEERED WITH <span className="text-orange-500">MODERN WEB TECH.</span>
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            We use industry-leading frontend frameworks to deliver lightning-fast load speeds, robust security, and seamless mobile responsiveness.
          </p>
        </div>

        {/* 4 Skill Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#090D18]/90 border border-slate-800 space-y-3 anurgo-glass"
            >
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-white pb-2 border-b border-slate-800">
                {cat.icon}
                <span>{cat.name}</span>
              </div>

              <div className="space-y-1.5">
                {cat.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
