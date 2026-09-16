import React from 'react';
import { Lock, AlertTriangle } from 'lucide-react';

interface DemoCautionBarrierProps {
  projectTitle?: string;
  projectNumber?: string;
  onClick?: () => void;
}

const TAPE_TEXT_1 =
  '⚠️ DEMO PROJECT // DO NOT ORDER ⚠️ DEMO PROJECT // DO NOT ENTER ⚠️ DEMO PROJECT // RESTRICTED ACCESS ⚠️ DEMO PROJECT // CONCEPT ONLY ⚠️ DEMO PROJECT // DO NOT ORDER ⚠️';
const TAPE_TEXT_2 =
  '🚧 DEMO PROJECT // NOT CLIENT WORK 🚧 DEMO PROJECT // LOCKED ARCHIVE 🚧 DEMO PROJECT // SELF-INITIATED SPEC 🚧 DEMO PROJECT // NOT CLIENT WORK 🚧';
const TAPE_TEXT_3 =
  '⚠️ ACCESS RESTRICTED ⚠️ DEMO PROJECT ⚠️ SPECIFICATION EXHIBIT ⚠️ DEMO PROJECT ⚠️ NO COMMERCIAL SALE ⚠️ DEMO PROJECT ⚠️';

export const DemoCautionBarrier: React.FC<DemoCautionBarrierProps> = ({
  projectTitle,
  projectNumber,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="absolute inset-0 z-30 overflow-hidden pointer-events-auto cursor-pointer rounded-[24px] sm:rounded-[40px] md:rounded-[50px] transition-all duration-300 group/barrier"
      title="Click to view locked demo project details"
    >
      {/* Subtle Vignette / Dark Ambient Dimmer to make Yellow Tapes Pop */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px] group-hover/barrier:bg-black/35 transition-colors duration-300" />

      {/* ------------------------------------------------------------------ */}
      {/* TAPE 1: Crossing from Top-Left to Bottom-Right (Angle ~ -14deg)    */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="absolute w-[160%] -left-[30%] top-[30%] sm:top-[32%] -rotate-[14deg] shadow-[0_10px_35px_rgba(0,0,0,0.9),0_2px_8px_rgba(0,0,0,0.7)] group-hover/barrier:brightness-105 transition-transform duration-500 group-hover/barrier:scale-[1.01]"
        style={{ transformOrigin: 'center center' }}
      >
        {/* Top Hazard Stripe Border */}
        <div className="h-[3px] w-full bg-[repeating-linear-gradient(45deg,#000,#000_8px,#FFE600_8px,#FFE600_16px)]" />

        {/* Yellow Tape Body */}
        <div className="bg-[#FFE600] py-1.5 sm:py-2 px-4 flex items-center border-y-2 border-black overflow-hidden relative">
          {/* Subtle Plastic Sheen Highlight */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/15 pointer-events-none" />

          <div className="flex whitespace-nowrap animate-marquee font-mono font-black text-[11px] sm:text-xs text-black tracking-[0.22em] uppercase select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
            <span className="mx-2">{TAPE_TEXT_1}</span>
            <span className="mx-2">{TAPE_TEXT_1}</span>
          </div>
        </div>

        {/* Bottom Hazard Stripe Border */}
        <div className="h-[3px] w-full bg-[repeating-linear-gradient(-45deg,#000,#000_8px,#FFE600_8px,#FFE600_16px)]" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TAPE 2: Crossing from Bottom-Left to Top-Right (Angle ~ +16deg)   */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="absolute w-[160%] -left-[30%] top-[62%] sm:top-[60%] rotate-[16deg] shadow-[0_10px_35px_rgba(0,0,0,0.9),0_2px_8px_rgba(0,0,0,0.7)] group-hover/barrier:brightness-105 transition-transform duration-500 group-hover/barrier:scale-[1.01]"
        style={{ transformOrigin: 'center center' }}
      >
        {/* Top Hazard Stripe Border */}
        <div className="h-[3px] w-full bg-[repeating-linear-gradient(45deg,#000,#000_8px,#FFE600_8px,#FFE600_16px)]" />

        {/* Yellow Tape Body */}
        <div className="bg-[#FFE600] py-1.5 sm:py-2 px-4 flex items-center border-y-2 border-black overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/15 pointer-events-none" />

          <div className="flex whitespace-nowrap font-mono font-black text-[11px] sm:text-xs text-black tracking-[0.22em] uppercase select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
            <span className="mx-2">{TAPE_TEXT_2}</span>
            <span className="mx-2">{TAPE_TEXT_2}</span>
          </div>
        </div>

        {/* Bottom Hazard Stripe Border */}
        <div className="h-[3px] w-full bg-[repeating-linear-gradient(-45deg,#000,#000_8px,#FFE600_8px,#FFE600_16px)]" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TAPE 3: Counter Slight Diagonal Ribbon (Angle ~ -3deg)             */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="absolute w-[160%] -left-[30%] top-[48%] -rotate-[3deg] shadow-[0_8px_30px_rgba(0,0,0,0.85)] opacity-95 group-hover/barrier:brightness-105"
        style={{ transformOrigin: 'center center' }}
      >
        <div className="h-[2px] w-full bg-[repeating-linear-gradient(45deg,#000,#000_6px,#FFE600_6px,#FFE600_12px)]" />
        <div className="bg-[#FFDD00] py-1 sm:py-1.5 px-4 flex items-center border-y border-black overflow-hidden relative">
          <div className="flex whitespace-nowrap font-mono font-black text-[10px] sm:text-[11px] text-black tracking-[0.25em] uppercase select-none">
            <span className="mx-2">{TAPE_TEXT_3}</span>
            <span className="mx-2">{TAPE_TEXT_3}</span>
          </div>
        </div>
        <div className="h-[2px] w-full bg-[repeating-linear-gradient(-45deg,#000,#000_6px,#FFE600_6px,#FFE600_12px)]" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* CENTER INTERSECTION: Glowing High-Tech Locked Padlock Seal        */}
      {/* ------------------------------------------------------------------ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 select-none pointer-events-none">
        <div className="relative group-hover/barrier:scale-105 transition-transform duration-300">
          {/* Pulsing Outer Amber Warning Glow */}
          <div className="absolute -inset-2 rounded-2xl bg-amber-500/25 blur-xl animate-pulse" />

          <div className="relative rotate-[-3deg] px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl bg-[#0C0C0C]/95 border-2 border-amber-400 shadow-[0_15px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(245,158,11,0.4)] backdrop-blur-xl flex flex-col items-center gap-1 text-center">
            {/* Top Status Pill */}
            <div className="flex items-center gap-2 text-amber-400 font-mono text-[9.5px] sm:text-[11px] font-black uppercase tracking-widest">
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" />
              <span>PROJECT LOCKED</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>

            {/* Main Title Stamp */}
            <div className="text-xs sm:text-sm md:text-base font-mono font-black text-white tracking-[0.22em] uppercase drop-shadow flex items-center gap-1.5">
              <span>DEMO PROJECT</span>
              <span className="text-amber-400">//</span>
              <span className="text-amber-300">NOT FOR ORDER</span>
            </div>

            {/* Sub-label */}
            <div className="flex items-center gap-2 pt-0.5 text-[8px] sm:text-[9.5px] font-mono text-[#D7E2EA]/75 tracking-wider uppercase">
              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
              <span>INTERNAL CRAFT SHOWCASE • CLICK TO INSPECT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoCautionBarrier;
