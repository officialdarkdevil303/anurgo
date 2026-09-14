import React from 'react';

interface LiveProjectButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string;
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  onClick,
  className = '',
  label = 'Live Project',
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base hover:bg-[#D7E2EA]/10 hover:border-white hover:text-white transition-all duration-300 active:scale-95 cursor-pointer whitespace-nowrap ${className}`}
    >
      {label}
    </button>
  );
};
