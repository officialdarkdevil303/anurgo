import React from 'react';
import { 
  Building2, 
  UtensilsCrossed, 
  ShoppingBag, 
  Flame, 
  RefreshCw, 
  Code2, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  Clock,
  Sparkles
} from 'lucide-react';
import { TiltCard } from '../common/TiltCard';
import { SERVICES, ServiceItem } from '../../data/anurgoData';

interface AnurgoServicesProps {
  onSelectServiceForBooking: (serviceTitle: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-6 h-6 text-orange-400" />,
  UtensilsCrossed: <UtensilsCrossed className="w-6 h-6 text-orange-400" />,
  ShoppingBag: <ShoppingBag className="w-6 h-6 text-orange-400" />,
  Flame: <Flame className="w-6 h-6 text-orange-400" />,
  RefreshCw: <RefreshCw className="w-6 h-6 text-orange-400" />,
  Code2: <Code2 className="w-6 h-6 text-orange-400" />,
};

export const AnurgoServices: React.FC<AnurgoServicesProps> = ({ onSelectServiceForBooking }) => {
  const handleBookService = (service: ServiceItem) => {
    onSelectServiceForBooking(service.title);
    const target = document.getElementById('contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const includedPerks = [
    { label: '100% Handcrafted Code', desc: 'Zero bloated page builder plugins or slow themes' },
    { label: 'Sub-0.6s Mobile Speeds', desc: 'Instant tap response and fluid motion on iPhones & Android' },
    { label: 'Local Search Optimization', desc: 'Google Map Pack & Schema.org LocalBusiness structured data' },
    { label: 'Enterprise SSL & Edge Hosting', desc: 'Ultra-fast global edge hosting with 99.99% uptime guarantee' },
    { label: 'Zero Platform Lock-In', desc: 'You own 100% of your source code and design assets forever' },
    { label: 'Frictionless Conversion', desc: '1-Tap WhatsApp, table booking, and direct lead capture funnels' },
  ];

  return (
    <section id="services" className="relative py-28 bg-[#040508] anurgo-grid-bg border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Website Solutions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            WHAT I <span className="text-gradient-fire">BUILD.</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Modern, responsive, and high-performance websites tailored specifically to how your customers discover, trust, and buy from your business.
          </p>
        </div>

        {/* 6 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service) => (
            <TiltCard
              key={service.id}
              maxTilt={3.5}
              glowColor="amber"
              className="p-6 sm:p-8 rounded-3xl bg-[#090D18]/90 border border-slate-800 hover:border-orange-500/60 anurgo-glass anurgo-card-shine flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header with Icon, Number, and Category */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3.5 rounded-2xl bg-orange-500/15 border border-orange-500/30 shadow-neon-orange-sm">
                      {iconMap[service.icon]}
                    </div>
                    <span className="text-2xl font-mono font-extrabold text-slate-600">
                      {service.number}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {service.popular && (
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold">
                        POPULAR
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-400" />
                      {service.timeline}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-wider">
                    {service.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {service.title}
                  </h3>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {service.tagline}
                </p>

                <p className="text-slate-400 text-xs leading-relaxed">
                  {service.description}
                </p>

                {/* Features Checklist */}
                <div className="pt-3 space-y-2 border-t border-slate-800/80">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Bottom CTA */}
              <div className="pt-6 mt-6 border-t border-slate-800/80">
                <button
                  onClick={() => handleBookService(service)}
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-orange-500 text-slate-200 hover:text-slate-950 font-bold text-xs border border-slate-700 hover:border-orange-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Select & Book Website</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* "Included with Every Build" Value Strip */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#080C18] border border-orange-500/30 anurgo-glass shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-400" />
                <span>The ANURGO Standard — Included with Every Website</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Zero hidden fees. Every single website we build meets these exact standards.
              </p>
            </div>

            <div className="text-xs font-mono text-orange-400 font-bold shrink-0 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30">
              100% BESPOKE
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {includedPerks.map((perk, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80 flex items-start gap-3.5"
              >
                <div className="p-2 rounded-xl bg-orange-500/15 text-orange-400 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{perk.label}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
