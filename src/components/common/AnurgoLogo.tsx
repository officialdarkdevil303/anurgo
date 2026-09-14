import React from 'react';

interface AnurgoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  withGlow?: boolean;
}

export const AnurgoLogo: React.FC<AnurgoLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
  withGlow = false,
}) => {
  const sizeMap = {
    sm: {
      mark: 'text-base font-black px-2 py-0.5 rounded-lg',
      wordmark: 'text-sm font-black',
      sub: 'text-[8px]',
      slash: 'text-xs',
    },
    md: {
      mark: 'text-lg sm:text-xl font-black px-2.5 py-1 rounded-xl',
      wordmark: 'text-lg sm:text-xl font-black',
      sub: 'text-[9px] sm:text-[10px]',
      slash: 'text-sm sm:text-base',
    },
    lg: {
      mark: 'text-2xl sm:text-3xl font-black px-3.5 py-1.5 rounded-2xl',
      wordmark: 'text-2xl sm:text-3xl font-black',
      sub: 'text-xs font-bold',
      slash: 'text-xl sm:text-2xl',
    },
    xl: {
      mark: 'text-4xl sm:text-5xl md:text-6xl font-black px-5 py-2.5 rounded-3xl',
      wordmark: 'text-4xl sm:text-5xl font-black',
      sub: 'text-sm font-bold',
      slash: 'text-3xl sm:text-4xl md:text-5xl',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* The Iconic A/G Monogram Box */}
      <div
        className={`relative bg-[#161616] border border-[#D7E2EA]/25 group-hover:border-orange-500/60 flex items-center justify-center transition-all duration-300 ${
          currentSize.mark
        } ${
          withGlow ? 'shadow-[0_0_20px_rgba(255,84,0,0.25)]' : 'group-hover:shadow-[0_0_20px_rgba(255,84,0,0.2)]'
        }`}
      >
        <div className="flex items-center tracking-tighter leading-none">
          <span className="text-white group-hover:text-[#F0F4F8] transition-colors font-black">
            A
          </span>
          <span className="text-orange-500 font-extrabold mx-0.5 transform -skew-x-12 select-none">
            /
          </span>
          <span className="text-white group-hover:text-[#F0F4F8] transition-colors font-black">
            G
          </span>
        </div>

        {/* Subtle Corner Amber Dot */}
        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-orange-500 opacity-80 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Optional Wordmark */}
      {showWordmark && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`tracking-tight text-white group-hover:text-orange-200 transition-colors uppercase ${currentSize.wordmark}`}
            >
              ANUR<span className="text-orange-500">GO</span>
            </span>
          </div>
          <span
            className={`font-mono text-[#D7E2EA]/50 tracking-wider block uppercase ${currentSize.sub}`}
          >
            STUDIO BY ANURAG
          </span>
        </div>
      )}
    </div>
  );
};

export default AnurgoLogo;
