import React, { useState } from 'react';
import { Terminal, ArrowUp, X, FileText, MessageSquarePlus } from 'lucide-react';
import { AnurgoLogo } from '../common/AnurgoLogo';
import { ANURGO_BRAND } from '../../data/anurgoData';

interface AnurgoFooterProps {
  onOpenTerminal: () => void;
  onOpenFeedback?: () => void;
}

export const AnurgoFooter: React.FC<AnurgoFooterProps> = ({ onOpenTerminal, onOpenFeedback }) => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0C0C0C] border-t border-[#D7E2EA]/15 pt-16 pb-12 overflow-hidden select-none text-[#D7E2EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-6">
          {/* Col 1: Studio Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <AnurgoLogo size="lg" />

            <p className="text-white text-sm font-medium leading-relaxed">
              &quot;Crafting Digital Experiences People Remember.&quot;
            </p>

            <p className="text-[#D7E2EA]/60 text-xs leading-relaxed max-w-sm font-sans">
              ANURGO creates immersive websites, interactive experiences, and digital identities designed to make brands stand out.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{ANURGO_BRAND.availabilityStatus}</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {/* WhatsApp Profile */}
              <a
                href={ANURGO_BRAND.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#181818] border border-[#D7E2EA]/20 hover:border-emerald-400 flex items-center justify-center text-[#D7E2EA]/70 hover:text-emerald-400 transition-colors"
                aria-label="WhatsApp Contact"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.99.54 1.772.82 2.796.82 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.806-5.768-5.806zm3.376 8.21c-.14.394-.816.745-1.127.79-.31.045-.71.064-2.029-.481-1.683-.695-2.766-2.42-2.85-2.531-.084-.112-.676-.899-.676-1.716 0-.816.427-1.218.579-1.385.152-.167.332-.209.444-.209.112 0 .224 0 .323.005.105.006.245-.04.383.29.14.332.476 1.163.518 1.248.042.085.07.184.014.296-.056.113-.084.183-.168.282-.084.099-.177.221-.253.297-.084.084-.172.176-.074.344.098.168.435.719.934 1.163.642.571 1.183.748 1.351.832.168.084.267.07.366-.042.099-.112.424-.493.537-.662.112-.169.224-.14.378-.084.154.056.981.463 1.149.547.168.084.28.126.322.197.042.07.042.408-.098.802zM12 2C6.48 2 2 6.48 2 12c0 1.95.56 3.77 1.53 5.31L2 22l4.83-1.49C8.32 21.46 10.11 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
              </a>

              {/* GitHub Profile */}
              <a
                href={ANURGO_BRAND.github}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#181818] border border-[#D7E2EA]/20 hover:border-purple-400 flex items-center justify-center text-[#D7E2EA]/70 hover:text-purple-400 transition-colors"
                aria-label="GitHub Profile"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>

              {/* Fiverr Profile */}
              <a
                href={ANURGO_BRAND.fiverr}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#181818] border border-[#D7E2EA]/20 hover:border-emerald-400 flex items-center justify-center text-xs font-mono font-bold text-[#D7E2EA]/70 hover:text-emerald-400 transition-colors"
                aria-label="Fiverr Profile"
              >
                fi
              </a>

              {/* LinkedIn Profile */}
              <a
                href={ANURGO_BRAND.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#181818] border border-[#D7E2EA]/20 hover:border-sky-400 flex items-center justify-center text-[#D7E2EA]/70 hover:text-sky-400 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Direct Email */}
              <a
                href={`mailto:${ANURGO_BRAND.email}`}
                className="w-9 h-9 rounded-xl bg-[#181818] border border-[#D7E2EA]/20 hover:border-orange-400 flex items-center justify-center text-[#D7E2EA]/70 hover:text-orange-400 transition-colors"
                aria-label="Contact Email"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>

              {/* Developer Terminal Trigger */}
              <button
                onClick={onOpenTerminal}
                className="w-9 h-9 rounded-xl bg-[#181818] border border-[#D7E2EA]/30 hover:bg-orange-500/20 hover:border-orange-400 flex items-center justify-center text-orange-400 transition-colors cursor-pointer"
                title="Launch Developer Terminal"
              >
                <Terminal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#D7E2EA]/70">
              <li><a href="#hero" className="hover:text-white transition-colors">HOME</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">ABOUT</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">SERVICES</a></li>
              <li><a href="#work" className="hover:text-white transition-colors">WORK</a></li>
              <li><a href="#process" className="hover:text-white transition-colors">PROCESS</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">PROJECT TERMS</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">CONTACT</a></li>
            </ul>
          </div>

          {/* Col 3: Focus Areas */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              Capabilities
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#D7E2EA]/70">
              <li><a href="#services" className="hover:text-white transition-colors">Web Design</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">3D Web Experiences</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Creative Development</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">UI/UX Design</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Branding & Motion</a></li>
            </ul>
          </div>

          {/* Col 4: Studio & Console */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              Studio & Policy
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#D7E2EA]/70">
              <li>
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Privacy & Client Policy
                </button>
              </li>
              {onOpenFeedback && (
                <li>
                  <button
                    onClick={onOpenFeedback}
                    className="hover:text-white text-orange-400/90 hover:text-orange-300 transition-colors text-left flex items-center gap-1.5 cursor-pointer font-mono"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5 text-orange-400" />
                    <span>Share Feedback with Creator</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={onOpenTerminal}
                  className="text-orange-400 hover:text-orange-300 font-mono transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <span>&gt; ANURGO://IDENTITY</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant Monolithic ANURGO Watermark Signature */}
        <div className="py-8 sm:py-12 lg:py-16 overflow-hidden flex items-center justify-center select-none">
          <span
            className="w-full text-center font-black tracking-tighter uppercase font-sans leading-none text-[#15171a] hover:text-[#1c1f24] transition-colors duration-500 pointer-events-auto cursor-default select-none"
            style={{
              fontSize: 'clamp(4rem, 18.5vw, 19rem)',
              letterSpacing: '-0.035em',
              lineHeight: 0.85,
            }}
          >
            ANURGO
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#D7E2EA]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D7E2EA]/50 font-mono">
          <div className="space-y-0.5 text-center sm:text-left">
            <div>&copy; 2026 ANURGO. All rights reserved.</div>
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden sm:inline-block tracking-widest text-[#D7E2EA]/40 text-[11px] uppercase">
              MADE FOR PEOPLE WHO SHIP
            </span>
            <button
              onClick={scrollToTop}
              className="px-4 py-2 rounded-full bg-[#181818] border border-[#D7E2EA]/20 hover:border-white text-[#D7E2EA] hover:text-white transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>BACK TO TOP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#141414] border border-[#D7E2EA]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-mono font-bold text-sm">
                <FileText className="w-4 h-4 text-orange-400" /> Privacy & Client Data Policy
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-[#D7E2EA]/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-[#D7E2EA]/80 space-y-3 leading-relaxed">
              <p>
                <strong>Zero Unsolicited Data Sharing:</strong> All project details and contact information submitted via ANURGO are strictly confidential and used solely to communicate about your project.
              </p>
              <p>
                <strong>Asset Ownership:</strong> All code, design tokens, high-resolution imagery, and copy created for client deliverables become 100% the property of the client upon final milestone payment.
              </p>
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-6 py-2 rounded-full bg-orange-500 text-black font-bold text-xs font-mono hover:bg-orange-400 transition-colors"
              >
                Close Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default AnurgoFooter;
