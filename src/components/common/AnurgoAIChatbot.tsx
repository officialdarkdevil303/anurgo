import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { ANURGO_BRAND, SERVICES, PORTFOLIO_PROJECTS, PROCESS_STEPS, FAQ_ITEMS } from '../../data/anurgoData';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionButtons?: {
    label: string;
    action: () => void;
    icon?: string;
  }[];
}

interface AnurgoAIChatbotProps {
  onNavigateSection?: (sectionId: string) => void;
}

const INITIAL_QUICK_ACTIONS = [
  'About me',
  'Projects',
  'Skills',
  'Services',
  'Contact',
];

export const AnurgoAIChatbot: React.FC<AnurgoAIChatbotProps> = ({ onNavigateSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Welcome to **ANURGO Creative Studio**! I am your AI assistant. How can I help you explore our design services, projects, skills, or initiate a project today?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages]);

  const scrollToSection = (sectionId: string) => {
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const generateLocalResponse = (query: string): { text: string; actionButtons?: Message['actionButtons'] } => {
    const q = query.toLowerCase().trim();

    // 1. About me / Founder / Anurag / Background
    if (
      q.includes('about') ||
      q.includes('who') ||
      q.includes('founder') ||
      q.includes('anurag') ||
      q.includes('author') ||
      q.includes('bio') ||
      q.includes('creator')
    ) {
      return {
        text: `**ANURGO** is the creative digital studio founded by **Anurag** — a Computer Science student, creative developer, and 3D web creator.

• **Core Philosophy:** "I don't just build websites. I build digital experiences people remember."
• **Specialty:** 3D interactive web experiences, high-performance business websites, and distinctive dark noir visual identities.
• **Standards:** 100% custom handcrafted code, sub-second load times, zero bloated templates.`,
        actionButtons: [
          {
            label: 'Read Studio Bio',
            action: () => scrollToSection('about'),
          },
          {
            label: 'View Services',
            action: () => scrollToSection('services'),
          },
        ],
      };
    }

    // 2. Projects / Portfolio / Work / Case Studies
    if (
      q.includes('project') ||
      q.includes('work') ||
      q.includes('portfolio') ||
      q.includes('case study') ||
      q.includes('demo') ||
      q.includes('nextlevel') ||
      q.includes('aura') ||
      q.includes('solaris') ||
      q.includes('savoria')
    ) {
      return {
        text: `Here are our flagship featured projects and design concepts:

1. **NEXTLEVEL STUDIO** — Immersive 3D agency portfolio featuring fluid WebGL physics and kinetic typography.
2. **AURA BRAND IDENTITY** — Modern SaaS design system with real-time performance analytics.
3. **SOLARIS DIGITAL** — Luxury D2C flagship with interactive 3D product configurations.
4. **SAVORIA TRATTORIA** — Artisanal Italian dining portal with digital menu & direct table reservations.
5. **AURA ROASTERS** — Single-origin coffee roastery with tasting notes & subscription builder.`,
        actionButtons: [
          {
            label: 'Explore Selected Work',
            action: () => scrollToSection('work'),
          },
          {
            label: 'Start a Project',
            action: () => scrollToSection('contact'),
          },
        ],
      };
    }

    // 3. Skills / Tech Stack / Technologies
    if (
      q.includes('skill') ||
      q.includes('stack') ||
      q.includes('tech') ||
      q.includes('code') ||
      q.includes('react') ||
      q.includes('typescript') ||
      q.includes('three') ||
      q.includes('tailwind')
    ) {
      return {
        text: `**Core Engineering & Design Stack:**

• **Frontend:** React 19, TypeScript, Next.js, Vite
• **Motion & 3D:** Framer Motion, WebGL / Three.js, Canvas Micro-interactions
• **Styling:** Tailwind CSS, Custom Modern CSS Glassmorphism
• **Performance:** 100/100 Google Lighthouse Core Web Vitals, WebP/AVIF asset pipelines
• **Design:** Figma prototyping, bespoke typography & dark-mode UI systems`,
        actionButtons: [
          {
            label: 'View Live Demos',
            action: () => scrollToSection('work'),
          },
        ],
      };
    }

    // 4. Services / What do you do / Solutions / Pricing
    if (
      q.includes('service') ||
      q.includes('what do you do') ||
      q.includes('offering') ||
      q.includes('build') ||
      q.includes('solution') ||
      q.includes('pricing') ||
      q.includes('price') ||
      q.includes('cost') ||
      q.includes('terms')
    ) {
      return {
        text: `**ANURGO Commercial Website Solutions:**

1. **Business Websites** — Multi-page corporate & professional portals (2–3 weeks)
2. **Restaurant & Café** — Sensory menus & zero-commission table booking (1.5–2.5 weeks)
3. **Local Business** — Storefronts for salons, boutiques, and clinics (2–3 weeks)
4. **Landing Pages** — High-conversion campaign pages (< 0.6s LCP, 5–8 days)
5. **Website Redesign** — Modernizing outdated sites with razor-sharp dark UI
6. **Custom Web Experiences** — Bespoke interactive portals & 3D configurations

**Project Terms:** Transparent milestone pricing with 50% upfront and 50% on final client approval. 100% full source code ownership.`,
        actionButtons: [
          {
            label: 'Explore Services Section',
            action: () => scrollToSection('services'),
          },
          {
            label: 'Review Project Terms',
            action: () => scrollToSection('terms'),
          },
        ],
      };
    }

    // 5. Contact / Hire / Booking / Email / WhatsApp / Fiverr
    if (
      q.includes('contact') ||
      q.includes('hire') ||
      q.includes('booking') ||
      q.includes('start') ||
      q.includes('email') ||
      q.includes('whatsapp') ||
      q.includes('phone') ||
      q.includes('fiverr') ||
      q.includes('reach')
    ) {
      return {
        text: `**Direct Contact Channels:**

• **Email:** [workwithanuragchauhan@gmail.com](mailto:workwithanuragchauhan@gmail.com)
• **WhatsApp:** [Contact via WhatsApp](https://wa.me/917991192205?text=Hi%20Anurag!%20I%20would%20like%20to%20discuss%20a%20project%20with%20ANURGO.)
• **Fiverr:** [Official Studio Gig](https://www.fiverr.com/s/Q2Y0NpP)
• **LinkedIn:** [Anurag Chauhan](https://www.linkedin.com/in/anurag-chauhan-903b29380)
• **GitHub:** [officialdarkdevil303](https://github.com/officialdarkdevil303)

We typically respond within **24 hours** with initial concept ideas and a fixed quote.`,
        actionButtons: [
          {
            label: 'Contact via WhatsApp',
            action: () => window.open(ANURGO_BRAND.whatsappLink, '_blank'),
          },
          {
            label: 'Open Contact Form',
            action: () => scrollToSection('contact'),
          },
        ],
      };
    }

    // 6. Process / How it works / Steps / Timeline
    if (
      q.includes('process') ||
      q.includes('how it work') ||
      q.includes('step') ||
      q.includes('timeline') ||
      q.includes('how long')
    ) {
      return {
        text: `**The 4-Step ANURGO Launch Playbook:**

• **Phase 01: Strategy & Goals** (1–3 Days) — Brand discovery, audience mapping, and sitemap.
• **Phase 02: Plan & Design** (4–7 Days) — High-fidelity UI mockups, bespoke typography & approval.
• **Phase 03: Build & Refine** (1–2 Weeks) — Clean React/TypeScript coding, touch optimization & speed tuning.
• **Phase 04: Launch & Handoff** (2–3 Days) — Edge CDN deployment, SSL, Google indexing & full code ownership.`,
        actionButtons: [
          {
            label: 'See Process Section',
            action: () => scrollToSection('process'),
          },
        ],
      };
    }

    // 7. General Greetings
    if (
      q === 'hi' ||
      q === 'hello' ||
      q === 'hey' ||
      q === 'yo' ||
      q.startsWith('hi ') ||
      q.startsWith('hello ')
    ) {
      return {
        text: `Hello! I'm the ANURGO Studio AI. What would you like to know about our web design services, 3D experiences, or project process?`,
        actionButtons: [
          {
            label: 'About Studio',
            action: () => handleSendPrompt('About me'),
          },
          {
            label: 'View Services',
            action: () => handleSendPrompt('Services'),
          },
          {
            label: 'Check Projects',
            action: () => handleSendPrompt('Projects'),
          },
        ],
      };
    }

    // 8. Fallback
    return {
      text: `I'd love to help you with that! You can ask about:
• **"About me"** — The story behind ANURGO & founder Anurag
• **"Services"** — Website development, landing pages & redesigns
• **"Projects"** — Interactive portfolio & 3D client concepts
• **"Skills"** — React 19, TypeScript, Three.js & performance
• **"Contact"** — Start a project or direct WhatsApp/Email inquiry`,
      actionButtons: [
        {
          label: 'Explore Services',
          action: () => handleSendPrompt('Services'),
        },
        {
          label: 'Contact Anurag',
          action: () => scrollToSection('contact'),
        },
      ],
    };
  };

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateLocalResponse(promptText);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons: response.actionButtons,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isTyping) return;
    handleSendPrompt(inputVal);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 260 }}
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-[#12141A]/90 hover:bg-[#1A1E26] border border-orange-500/40 hover:border-orange-500 text-white shadow-[0_10px_35px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(255,84,0,0.4)] backdrop-blur-xl transition-all duration-300 cursor-pointer"
              aria-label="Open ANURGO Studio AI Assistant"
            >
              {/* Pulsing Electric Orange Core */}
              <div className="relative flex items-center justify-center">
                <span className="absolute w-3.5 h-3.5 rounded-full bg-orange-500/50 animate-ping" />
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_8px_#FF5400]" />
              </div>

              <div className="flex items-center gap-1.5 font-mono text-xs tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span className="font-bold uppercase text-white">ANURGO AI</span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Panel Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] h-[540px] sm:h-[580px] max-h-[85vh] flex flex-col rounded-[28px] sm:rounded-[32px] bg-[#0E1015]/95 backdrop-blur-2xl border border-[#D7E2EA]/20 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden"
          >
            {/* Top Studio Header */}
            <div className="px-5 py-4 bg-[#141822]/90 border-b border-[#D7E2EA]/10 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-[1.5px] flex items-center justify-center shadow-[0_0_15px_rgba(255,84,0,0.3)]">
                  <div className="w-full h-full rounded-[14px] bg-[#0E1015] flex items-center justify-center">
                    <Bot className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0E1015]" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-mono font-black uppercase tracking-wider text-white">
                      ANURGO AI COPILOT
                    </h4>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 font-mono font-semibold">
                      v2.0
                    </span>
                  </div>
                  <p className="text-[10px] text-[#D7E2EA]/60 font-sans">
                    Creative Studio Intelligence • Instant Local Response
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#1A1F2B] hover:bg-[#252B3B] border border-[#D7E2EA]/15 text-[#D7E2EA] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Chatbot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Category Chips */}
            <div className="px-4 py-2.5 bg-[#0A0C10]/60 border-b border-[#D7E2EA]/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {INITIAL_QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => handleSendPrompt(action)}
                  className="px-3 py-1 rounded-full bg-[#181C26] hover:bg-orange-500 hover:text-black border border-[#D7E2EA]/15 hover:border-orange-400 text-[10px] sm:text-xs font-mono text-[#D7E2EA]/80 whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 active:scale-95"
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 font-sans select-text">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-end gap-2 max-w-[90%]">
                    {msg.sender === 'ai' && (
                      <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0 mb-1">
                        <Sparkles className="w-3 h-3" />
                      </div>
                    )}

                    <div
                      className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black font-semibold rounded-br-none shadow-[0_4px_15px_rgba(255,84,0,0.3)]'
                          : 'bg-[#151922] text-[#D7E2EA] border border-[#D7E2EA]/15 rounded-bl-none shadow-md'
                      }`}
                    >
                      <div className="whitespace-pre-line break-words">{msg.text}</div>

                      {/* Interactive In-Chat Action Buttons */}
                      {msg.actionButtons && msg.actionButtons.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-[#D7E2EA]/10 flex flex-wrap gap-1.5">
                          {msg.actionButtons.map((btn, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                btn.action();
                                setIsOpen(false);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500/15 hover:bg-orange-500 text-orange-300 hover:text-black border border-orange-500/30 hover:border-orange-400 text-[10px] sm:text-xs font-mono font-bold transition-colors cursor-pointer"
                            >
                              <span>{btn.label}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[9px] font-mono text-[#D7E2EA]/40 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3 h-3 animate-spin-slow" />
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-[#151922] border border-[#D7E2EA]/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Field */}
            <form
              onSubmit={handleFormSubmit}
              className="p-3 bg-[#12151D] border-t border-[#D7E2EA]/10 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about projects, skills, pricing..."
                className="flex-1 bg-[#1A1F2C] border border-[#D7E2EA]/15 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#D7E2EA]/40 outline-none transition-colors font-sans"
              />

              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:hover:bg-orange-500 text-black flex items-center justify-center transition-all cursor-pointer shadow-[0_0_15px_rgba(255,84,0,0.3)] shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnurgoAIChatbot;
