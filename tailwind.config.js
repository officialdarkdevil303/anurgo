/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#0C0C0C',
        anurgo: {
          void: '#0C0C0C',
          dark: '#0C0C0C',
          navy: '#121212',
          slate: '#1A1A1A',
          card: 'rgba(18, 18, 18, 0.85)',
          'card-hover': 'rgba(25, 25, 25, 0.95)',
          orange: '#FF5400',
          'orange-glow': 'rgba(255, 84, 0, 0.55)',
          'orange-light': '#FF7824',
          'orange-deep': '#D93800',
          amber: '#FBBF24',
          cyan: '#06B6D4',
          emerald: '#10B981',
          purple: '#A855F7',
          rose: '#F43F5E',
          neon: '#FF3366',
          gold: '#FFD700',
          platinum: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['"Kanit"', 'sans-serif'],
        kanit: ['"Kanit"', 'sans-serif'],
        display: ['"Kanit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-orange': '0 0 30px rgba(255, 84, 0, 0.45)',
        'neon-orange-lg': '0 0 55px rgba(255, 84, 0, 0.75)',
        'neon-orange-sm': '0 0 15px rgba(255, 84, 0, 0.35)',
        'neon-gold': '0 0 30px rgba(251, 191, 36, 0.45)',
        'neon-cyan': '0 0 30px rgba(6, 182, 212, 0.45)',
        'glass-orange': '0 8px 32px 0 rgba(255, 84, 0, 0.18)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.65)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'border-pulse': 'borderPulse 3s ease-in-out infinite',
        'text-shimmer': 'textShimmer 4s ease infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(255, 84, 0, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 35px rgba(255, 84, 0, 0.85))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        borderPulse: {
          '0%, 100%': { borderColor: 'rgba(255, 84, 0, 0.2)' },
          '50%': { borderColor: 'rgba(255, 84, 0, 0.75)' },
        },
        textShimmer: {
          '0%, 100%': { 'background-size': '200% auto', 'background-position': '0% center' },
          '50%': { 'background-size': '200% auto', 'background-position': '100% center' },
        }
      }
    },
  },
  plugins: [],
}
