import React from 'react';
import { MessageSquarePlus, Sparkles } from 'lucide-react';

interface FloatingFeedbackButtonProps {
  onClick: () => void;
}

export const FloatingFeedbackButton: React.FC<FloatingFeedbackButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 group">
      <button
        onClick={onClick}
        className="relative flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-full bg-[#111317]/90 hover:bg-[#181B22] border border-[#D7E2EA]/20 hover:border-orange-500/60 shadow-[0_4px_25px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 group-hover:scale-105 cursor-pointer text-xs font-mono font-bold text-[#D7E2EA] hover:text-white"
        aria-label="Send Feedback to Creator"
        title="Share Feedback & Suggestions with Anurag"
      >
        {/* Subtle Ambient Pulse Dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
        </span>

        <MessageSquarePlus className="w-4 h-4 text-orange-400 group-hover:rotate-6 transition-transform" />

        <span className="tracking-wider uppercase text-[11px] font-semibold">
          Feedback
        </span>

        {/* Hover Tooltip on desktop */}
        <div className="absolute left-0 bottom-full mb-2 hidden sm:group-hover:flex flex-col items-start pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-[#161920] border border-orange-500/30 text-white text-[10px] font-sans px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span>Improve ANURGO • Talk to Anurag</span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default FloatingFeedbackButton;
