import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Sparkles, MessageCircle, ExternalLink, AlertTriangle, ArrowRight } from 'lucide-react';
import { ANURGO_BRAND, PortfolioProject } from '../../data/anurgoData';

interface DemoLockedModalProps {
  isOpen: boolean;
  project: {
    id: string;
    number: string;
    title: string;
    category: string;
    description: string;
    techStack: string[];
    col2Img?: string;
  } | null;
  onClose: () => void;
  onInspectPreview?: (projectId: string) => void;
}

export const DemoLockedModal: React.FC<DemoLockedModalProps> = ({
  isOpen,
  project,
  onClose,
  onInspectPreview,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const handleScrollToContact = () => {
    onClose();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappUrl = `https://wa.me/917991192205?text=Hi%20Anurag!%20I%20saw%20your%20locked%20demo%20concept%20"${encodeURIComponent(
    project.title
  )}"%20on%20ANURGO.%20Can%20you%20build%20a%20similar%20custom%20website%20for%20my%20business?`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 25 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-[28px] sm:rounded-[36px] bg-[#0E1015] border-2 border-amber-500/40 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(245,158,11,0.2)] overflow-hidden z-10 my-auto"
        >
          {/* Top Yellow Hazard Warning Ribbon */}
          <div className="w-full bg-[#FFE600] py-2 px-4 border-b-2 border-black flex items-center justify-between select-none">
            <div className="flex items-center gap-2 text-black font-mono font-black text-[10px] sm:text-xs tracking-[0.2em] uppercase">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>RESTRICTED ACCESS // DEMO PROJECT</span>
            </div>
            <span className="text-black/80 font-mono text-[9px] font-bold">
              REF: DEMO-{project.number}
            </span>
          </div>

          <div className="p-5 sm:p-7 space-y-5">
            {/* Header with Lock Icon & Title */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-mono font-black uppercase text-white tracking-tight">
                    {project.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-[#1A1F2B] hover:bg-[#252B3B] text-[#D7E2EA]/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Funny & Creative Explanation Card */}
            <div className="p-4 rounded-2xl bg-[#141822] border border-amber-500/20 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Why is this project locked?</span>
              </div>
              <p className="text-xs sm:text-sm text-[#D7E2EA]/85 font-sans leading-relaxed">
                This is an <strong className="text-white">internal concept demonstration</strong> hand-crafted by{' '}
                <strong className="text-orange-400">Anurag Chauhan</strong> to exhibit high-performance 3D physics,
                responsive touch tuning, and modern visual design.
              </p>
              <p className="text-[11px] sm:text-xs text-[#D7E2EA]/65 font-sans leading-relaxed">
                Because it’s a self-initiated craft demo, direct purchase or checkout is locked. However,{' '}
                <strong className="text-white">Anurag can build an even better custom website</strong> specifically
                tailored for your brand, restaurant, or store!
              </p>
            </div>

            {/* Tech Stack Pills */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-[#D7E2EA]/50 uppercase tracking-wider">
                Technologies Demonstrated in this Concept:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-md bg-[#161922] border border-[#D7E2EA]/15 text-[10px] font-mono text-amber-300/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleScrollToContact}
                className="w-full py-3 sm:py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-mono font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,84,0,0.35)] cursor-pointer active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>Build Similar Website for My Brand</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => window.open(whatsappUrl, '_blank')}
                  className="py-2.5 px-4 rounded-xl bg-[#1A1F2C] hover:bg-[#252C3D] text-[#D7E2EA] hover:text-white border border-[#D7E2EA]/15 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Discuss on WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onInspectPreview?.(project.id);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-[#1A1F2C] hover:bg-[#252C3D] text-[#D7E2EA] hover:text-white border border-[#D7E2EA]/15 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect Locked Concept</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DemoLockedModal;
