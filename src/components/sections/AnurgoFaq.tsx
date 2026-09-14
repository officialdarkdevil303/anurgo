import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, MessageSquare } from 'lucide-react';
import { FAQ_ITEMS, FaqItem } from '../../data/anurgoData';

export const AnurgoFaq: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="relative py-24 bg-[#06080D] anurgo-grid-bg border-t border-orange-500/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            FREQUENTLY ASKED <span className="text-gradient-fire">QUESTIONS.</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Everything you need to know about working with ANURGO, project timelines, mobile optimization, and how we start.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openFaqId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#0B0F1F] border-orange-500/60 shadow-[0_0_25px_rgba(255,84,0,0.15)]'
                    : 'bg-[#090D18]/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-white flex items-center gap-3">
                    <span className="text-orange-400 font-mono text-xs font-bold shrink-0">
                      Q:
                    </span>
                    <span>{item.question}</span>
                  </span>

                  <div
                    className={`p-1.5 rounded-lg bg-slate-900 border border-slate-700 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 bg-orange-500/20 border-orange-500/40 text-orange-400' : 'text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 animate-fadeIn">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="p-6 rounded-2xl bg-[#0A0E1A] border border-orange-500/30 anurgo-glass flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Have a specific question about your website?</h4>
            <p className="text-xs text-slate-400">Feel free to message directly on WhatsApp or drop an email anytime.</p>
          </div>

          <a
            href="#contact"
            className="px-6 py-3 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs shadow-neon-orange-sm hover:bg-orange-400 transition-all shrink-0 cursor-pointer"
          >
            Ask a Question
          </a>
        </div>
      </div>
    </section>
  );
};
