import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Terminal, ArrowRight, MessageSquarePlus } from 'lucide-react';
import { AnurgoLogo } from '../common/AnurgoLogo';

interface AnurgoNavbarProps {
  onOpenTerminal: () => void;
  onOpenFeedback?: () => void;
}

export const AnurgoNavbar: React.FC<AnurgoNavbarProps> = ({ onOpenTerminal, onOpenFeedback }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Check if near page bottom -> activate contact
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 120
      ) {
        setActiveSection('contact');
        return;
      }

      // Check key sections
      const sectionMapping: { id: string; navId: string }[] = [
        { id: 'hero', navId: 'hero' },
        { id: 'about', navId: 'about' },
        { id: 'services', navId: 'services' },
        { id: 'process', navId: 'process' },
        { id: 'work', navId: 'work' },
        { id: 'why-anurgo', navId: 'process' },
        { id: 'terms', navId: 'services' },
        { id: 'contact', navId: 'contact' },
      ];

      const scrollPosition = window.scrollY + 220;

      for (let i = sectionMapping.length - 1; i >= 0; i--) {
        const item = sectionMapping[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(item.navId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial evaluation
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', href: '#hero', id: 'hero' },
    { label: 'ABOUT', href: '#about', id: 'about' },
    { label: 'SERVICES', href: '#services', id: 'services' },
    { label: 'PROCESS', href: '#process', id: 'process' },
    { label: 'WORK', href: '#work', id: 'work' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Scroll Progress Indicator Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 z-[60] origin-left shadow-[0_0_10px_rgba(255,84,0,0.8)] pointer-events-none"
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none ${
          isScrolled
            ? 'bg-[#0C0C0C]/90 backdrop-blur-xl border-b border-[#D7E2EA]/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.85)]'
            : 'bg-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Monogram & Studio Title with A/G Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#hero');
              }}
              className="focus:outline-none cursor-pointer"
            >
              <AnurgoLogo size="md" />
            </a>

            {/* Availability Status Badge */}
            <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 ml-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Select Projects</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`relative py-1 text-xs font-mono font-medium tracking-widest transition-all duration-200 cursor-pointer ${
                    isActive ? 'text-white font-bold' : 'text-[#D7E2EA]/60 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>

                  {/* Subtle Orange Glow Active Underline */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 to-amber-400 rounded-full shadow-[0_0_8px_rgba(255,84,0,0.8)]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Hover Underline */}
                  {!isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-500/40 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action: START A PROJECT CTA, Feedback & Terminal Trigger */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {onOpenFeedback && (
              <button
                onClick={onOpenFeedback}
                className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#181818] border border-[#D7E2EA]/20 hover:border-orange-500/50 hover:bg-[#202020] text-[11px] font-mono font-bold text-[#D7E2EA]/80 hover:text-white transition-all cursor-pointer shadow-sm"
                title="Share feedback or improvement ideas with Anurag"
              >
                <MessageSquarePlus className="w-3.5 h-3.5 text-orange-400" />
                <span>FEEDBACK</span>
              </button>
            )}

            <button
              onClick={onOpenTerminal}
              className="w-9 h-9 rounded-xl bg-[#181818] border border-[#D7E2EA]/20 hover:border-orange-500/50 hover:bg-[#202020] text-orange-400 hover:text-orange-300 transition-all flex items-center justify-center cursor-pointer shadow-sm"
              title="Launch ANURGO://IDENTITY Console"
            >
              <Terminal className="w-4 h-4" />
            </button>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-black font-black text-xs font-mono uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,84,0,0.4)] cursor-pointer"
            >
              <span>START A PROJECT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#181818] border border-[#D7E2EA]/20 text-[#D7E2EA] hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 mx-4 p-5 rounded-3xl bg-[#121212]/95 backdrop-blur-2xl border border-[#D7E2EA]/20 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-mono tracking-widest uppercase transition-colors flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-orange-500/15 text-orange-400 font-bold border border-orange-500/30'
                        : 'text-[#D7E2EA]/70 hover:text-white hover:bg-[#1A1A1A]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                  </a>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#D7E2EA]/15 space-y-2">
              {onOpenFeedback && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenFeedback();
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl bg-[#1A1E24] border border-[#D7E2EA]/15 text-xs font-mono text-[#D7E2EA] hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <MessageSquarePlus className="w-4 h-4 text-orange-400" />
                  <span>Share Feedback with Anurag</span>
                </button>
              )}

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#contact');
                }}
                className="w-full py-3 rounded-full bg-orange-500 text-black font-black text-xs font-mono text-center uppercase tracking-wider cursor-pointer block"
              >
                START A PROJECT →
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default AnurgoNavbar;
