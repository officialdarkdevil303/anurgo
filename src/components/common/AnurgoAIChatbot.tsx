import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  ExternalLink,
  Volume2,
  VolumeX,
  Phone,
  Mail,
  Plus,
  History,
  Trash2,
  ArrowLeft,
  Smile,
  Check,
  MessageSquare
} from 'lucide-react';
import { ANURGO_BRAND } from '../../data/anurgoData';
import {
  generateConversationalBrainResponse,
  createInitialContext,
  ConversationContext,
} from './anurgoAiBrain';

// ==============================================================================
// TYPES & INTERFACES
// ==============================================================================

export interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionButtons?: {
    label: string;
    action: () => void;
    icon?: 'arrow' | 'whatsapp' | 'mail' | 'external';
  }[];
  suggestions?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
  messages: Message[];
  context?: ConversationContext;
}

interface AnurgoAIChatbotProps {
  onNavigateSection?: (sectionId: string) => void;
}

type SupportedLang = 'en' | 'hi' | 'hinglish' | 'fr' | 'es' | 'de';

// ==============================================================================
// MARKDOWN BOLD & LINK PARSER (COMPLETELY FIXES THE ** TEXT ISSUE)
// ==============================================================================

const renderInlineTokens = (text: string) => {
  const parts: React.ReactNode[] = [];
  // Tokenizer pattern matches **bold**, [label](url), and *italic*
  const tokenRegex = /(\*\*.*?\*\*|\[.*?\]\(.*?\)|\*.*?\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];

    // **Bold Text** -> <strong className="font-bold text-white">
    if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
      const boldContent = token.slice(2, -2);
      parts.push(
        <strong key={`bold-${match.index}`} className="font-bold text-white tracking-wide">
          {boldContent}
        </strong>
      );
    }
    // [Link Label](url) -> <a href="url" ...>
    else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const splitIdx = token.indexOf('](');
      const label = token.slice(1, splitIdx);
      const url = token.slice(splitIdx + 2, -1);
      parts.push(
        <a
          key={`link-${match.index}`}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors font-medium"
        >
          {label}
        </a>
      );
    }
    // *Italic Text* -> <em>
    else if (token.startsWith('*') && token.endsWith('*') && token.length >= 2) {
      const italicContent = token.slice(1, -1);
      parts.push(
        <em key={`italic-${match.index}`} className="italic text-[#D7E2EA]/90">
          {italicContent}
        </em>
      );
    } else {
      parts.push(token);
    }
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    const remainder = text.substring(lastIndex);
    if (remainder.startsWith('**')) {
      parts.push(
        <strong key={`bold-stream-${lastIndex}`} className="font-bold text-white tracking-wide">
          {remainder.slice(2)}
        </strong>
      );
    } else {
      parts.push(remainder);
    }
  }

  return parts.length > 0 ? parts : text;
};

const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed font-sans text-xs sm:text-sm">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5 my-0.5">
              <span className="text-orange-400 font-bold text-xs mt-0.5 select-none shrink-0">•</span>
              <span className="flex-1">{renderInlineTokens(trimmed.slice(2))}</span>
            </div>
          );
        }
        return <div key={idx}>{renderInlineTokens(line)}</div>;
      })}
    </div>
  );
};

// ==============================================================================
// MULTI-LANGUAGE INTELLIGENCE & DETECTION ENGINE
// ==============================================================================

function detectLanguage(text: string): SupportedLang {
  const lower = text.toLowerCase().trim();

  // 1. Devanagari Script (Hindi)
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi';
  }

  // 2. French (Français)
  if (
    lower.includes('bonjour') ||
    lower.includes('salut') ||
    lower.includes('comment') ||
    lower.includes('merci') ||
    lower.includes('combien') ||
    lower.includes('site web') ||
    lower.includes('tarifs') ||
    lower.includes('devis') ||
    lower.includes('ça va') ||
    lower.includes('ca va') ||
    lower.includes('bonsoir') ||
    lower.includes('s\'il vous') ||
    lower.includes('aidez')
  ) {
    return 'fr';
  }

  // 3. Spanish (Español)
  if (
    lower.includes('hola') ||
    lower.includes('buenos dias') ||
    lower.includes('buenas tardes') ||
    lower.includes('buenas noches') ||
    lower.includes('gracias') ||
    lower.includes('cuanto') ||
    lower.includes('sitio web') ||
    lower.includes('como estas') ||
    lower.includes('por favor') ||
    lower.includes('precio') ||
    lower.includes('servicios') ||
    lower.includes('que tal')
  ) {
    return 'es';
  }

  // 4. German (Deutsch)
  if (
    lower.includes('hallo') ||
    lower.includes('guten tag') ||
    lower.includes('guten morgen') ||
    lower.includes('wie geht') ||
    lower.includes('danke') ||
    lower.includes('webseite') ||
    lower.includes('kosten') ||
    lower.includes('preis') ||
    lower.includes('hilfe')
  ) {
    return 'de';
  }

  // 5. Hinglish (Hindi written in Latin characters)
  if (
    lower.includes('kaise ho') ||
    lower.includes('kya haal') ||
    lower.includes('kya chal') ||
    lower.includes('bhai') ||
    lower.includes('karna hai') ||
    lower.includes('banwana') ||
    lower.includes('banani') ||
    lower.includes('banana hai') ||
    lower.includes('kitna') ||
    lower.includes('kharcha') ||
    lower.includes('paisa') ||
    lower.includes('rupaye') ||
    lower.includes('sasta') ||
    lower.includes('chahiye') ||
    lower.includes('batana') ||
    lower.includes('shukriya') ||
    lower.includes('dhanyawad') ||
    lower.includes('namaste') ||
    lower.includes('pranam') ||
    lower.includes('baat karni') ||
    lower.includes('theek ho') ||
    lower.includes('theek hai') ||
    lower.includes('badhiya') ||
    lower.includes('mast') ||
    lower.includes('kya rate') ||
    lower.includes('kuch') ||
    lower.includes('bolie') ||
    lower.includes('batao')
  ) {
    return 'hinglish';
  }

  return 'en';
}

const DEFAULT_SUGGESTIONS: Record<SupportedLang, string[]> = {
  en: ['💰 What are your prices?', '🚀 Show demo websites', '💼 What services do you offer?', '👨‍💻 Who is Anurag?'],
  hinglish: ['💰 Website ka kitna kharcha aayega?', '🚀 Demo projects dikhao', '💼 Services kya hain?', '👨‍💻 Anurag kaun hai?'],
  hi: ['💰 वेबसाइट की कीमत क्या है?', '🚀 डेमो प्रोजेक्ट्स दिखाएं', '💼 आपकी क्या सेवाएं हैं?', '👨‍💻 अनुराग कौन हैं?'],
  fr: ['💰 Quels sont vos tarifs ?', '🚀 Voir les sites démo', '💼 Quels services proposez-vous ?', '👨‍💻 Qui est Anurag ?'],
  es: ['💰 ¿Cuáles son los precios?', '🚀 Ver proyectos demo', '💼 ¿Qué servicios ofrecen?', '👨‍💻 ¿Quién es Anurag?'],
  de: ['💰 Was sind die Preise?', '🚀 Demo-Projekte ansehen', '💼 Welche Dienste bieten Sie an?', '👨‍💻 Wer ist Anurag?'],
};

export const AnurgoAIChatbot: React.FC<AnurgoAIChatbotProps> = ({ onNavigateSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'chat' | 'history'>('chat');
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showTeaser, setShowTeaser] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const streamingTimerRef = useRef<number | null>(null);

  const stopStreaming = () => {
    if (streamingTimerRef.current) {
      clearInterval(streamingTimerRef.current);
      streamingTimerRef.current = null;
    }
    setStreamingMessageId(null);
  };

  useEffect(() => {
    return () => {
      if (streamingTimerRef.current) {
        clearInterval(streamingTimerRef.current);
      }
    };
  }, []);

  // Persistence: Chat Sessions in localStorage
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('anurgo_chat_sessions_v3');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => `session-${Date.now()}`);
  const contextRef = useRef<ConversationContext>(createInitialContext());
  const [, setContextState] = useState<ConversationContext>(createInitialContext());

  const getInitialMessage = (): Message => ({
    id: `welcome-${Date.now()}`,
    sender: 'ai',
    text: `👋 **Hi there! Welcome to ANURGO Studio!**

I'm your AI assistant. How can I help you today? You can ask about our **friendly pricing**, test our **3D demo websites**, or ask any question in **English, Hindi, Hinglish, French, Spanish, or German**!`,
    timestamp: 'Just now',
    actionButtons: [
      {
        label: '💰 Check Friendly Pricing',
        action: () => handleSendPrompt('Budget & Rates'),
      },
      {
        label: '🚀 Test Live Demos',
        action: () => handleSendPrompt('Live Demos'),
      },
      {
        label: '💬 Chat on WhatsApp',
        action: () => window.open(ANURGO_BRAND.whatsappLink, '_blank'),
        icon: 'whatsapp',
      },
    ],
    suggestions: DEFAULT_SUGGESTIONS.en,
  });

  const [messages, setMessages] = useState<Message[]>(() => [getInitialMessage()]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Gentle audio chime synthesizer using Web Audio API
  const playChime = (type: 'sent' | 'received') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'sent') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.025, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.11);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.09);
        gain.gain.setValueAtTime(0.035, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // Audio autoplay policy
    }
  };

  // Sync messages with session list & localStorage (only once streaming has finished)
  useEffect(() => {
    if (messages.length === 0 || streamingMessageId !== null) return;

    // Only save session to history if there is at least one user message
    const firstUserMsg = messages.find((m) => m.sender === 'user');
    if (!firstUserMsg) return;

    setSessions((prevSessions) => {
      const existingIdx = prevSessions.findIndex((s) => s.id === activeSessionId);
      const sessionTitle = firstUserMsg.text.slice(0, 32) + (firstUserMsg.text.length > 32 ? '...' : '');

      let updated: ChatSession[];
      if (existingIdx >= 0) {
        updated = [...prevSessions];
        updated[existingIdx] = {
          ...updated[existingIdx],
          title: sessionTitle,
          updatedAt: Date.now(),
          messages,
          context: contextRef.current,
        };
      } else {
        updated = [
          {
            id: activeSessionId,
            title: sessionTitle,
            updatedAt: Date.now(),
            messages,
            context: contextRef.current,
          },
          ...prevSessions,
        ];
      }

      try {
        localStorage.setItem('anurgo_chat_sessions_v3', JSON.stringify(updated));
        localStorage.setItem('anurgo_active_session_id_v3', activeSessionId);
      } catch {
        // LocalStorage full or private browsing
      }

      return updated;
    });
  }, [messages, activeSessionId]);

  // Show friendly teaser popup after 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTeaser(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen && viewMode === 'chat') {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages, isTyping, viewMode]);

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

  // Close chatbot: resets active conversation to fresh, while retaining history
  const handleCloseChat = () => {
    stopStreaming();
    setIsOpen(false);
    setViewMode('chat');

    // If current conversation had user messages, it is already safely preserved in history.
    // Reset active chat so next time it is opened, it always starts clean and fresh!
    const hasUserMsg = messages.some((m) => m.sender === 'user');
    if (hasUserMsg) {
      const newSessionId = `session-${Date.now()}`;
      setActiveSessionId(newSessionId);
      contextRef.current = createInitialContext();
      setContextState(createInitialContext());
      setMessages([getInitialMessage()]);
    }
  };

  // Close chatbot on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Start a fresh new chat session
  const handleStartNewChat = () => {
    stopStreaming();
    const newSessionId = `session-${Date.now()}`;
    const freshMsg = getInitialMessage();
    setActiveSessionId(newSessionId);
    contextRef.current = createInitialContext();
    setContextState(createInitialContext());
    setMessages([freshMsg]);
    setViewMode('chat');
    playChime('received');
  };

  // Switch to a previous session from history
  const handleSelectSession = (sessionId: string) => {
    stopStreaming();
    const targetSession = sessions.find((s) => s.id === sessionId);
    if (targetSession) {
      setActiveSessionId(sessionId);
      const sessionContext = targetSession.context || createInitialContext();
      contextRef.current = sessionContext;
      setContextState(sessionContext);
      setMessages(targetSession.messages);
      setViewMode('chat');
      playChime('received');
    }
  };

  // Delete a specific session
  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    stopStreaming();
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== sessionId);
      try {
        localStorage.setItem('anurgo_chat_sessions_v3', JSON.stringify(updated));
      } catch {
        // Fallback
      }
      return updated;
    });

    if (sessionId === activeSessionId) {
      handleStartNewChat();
    }
  };

  // Clear all saved history
  const handleClearAllHistory = () => {
    setSessions([]);
    try {
      localStorage.removeItem('anurgo_chat_sessions_v3');
    } catch {
      // Fallback
    }
    handleStartNewChat();
  };

  // ==============================================================================
  // NATURAL CONVERSATIONAL AI ENGINE (POWERED BY ANURGO AI BRAIN)
  // ==============================================================================

  const generateConversationalResponse = (
    query: string
  ): { text: string; actionButtons?: Message['actionButtons']; suggestions?: string[] } => {
    const brainResult = generateConversationalBrainResponse(
      query,
      messages,
      contextRef.current,
      scrollToSection
    );
    contextRef.current = brainResult.updatedContext;
    setContextState(brainResult.updatedContext);
    return brainResult;
  };

  // ChatGPT-style progressive streaming typewriter transition
  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    stopStreaming();
    setShowTeaser(false);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);
    playChime('sent');

    // Natural brief thinking delay before streaming starts (like ChatGPT)
    setTimeout(() => {
      const response = generateConversationalResponse(promptText);
      const fullText = response.text;
      const aiMsgId = `ai-${Date.now()}`;

      // Insert empty streaming AI placeholder message
      const aiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      setStreamingMessageId(aiMsgId);

      // Adaptive streaming speed: smooth 60fps streaming cadence
      let charIndex = 0;
      const step = fullText.length > 350 ? 5 : fullText.length > 120 ? 3 : 2;
      const intervalDelay = 16;

      streamingTimerRef.current = window.setInterval(() => {
        charIndex += step;
        if (charIndex >= fullText.length) {
          if (streamingTimerRef.current) {
            clearInterval(streamingTimerRef.current);
            streamingTimerRef.current = null;
          }
          setStreamingMessageId(null);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId
                ? {
                    ...m,
                    text: fullText,
                    actionButtons: response.actionButtons,
                    suggestions: response.suggestions,
                  }
                : m
            )
          );
          playChime('received');
        } else {
          const partial = fullText.slice(0, charIndex);
          setMessages((prev) =>
            prev.map((m) => (m.id === aiMsgId ? { ...m, text: partial } : m))
          );
        }
      }, intervalDelay);
    }, 350);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isTyping || !!streamingMessageId) return;
    handleSendPrompt(inputVal);
  };

  return (
    <>
      {/* Floating Chat Trigger with Welcome Teaser Tooltip */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
        {/* Proactive Speech Bubble Teaser */}
        <AnimatePresence>
          {showTeaser && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.92 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={() => {
                setIsOpen(true);
                setShowTeaser(false);
              }}
              className="mb-3 max-w-[290px] sm:max-w-[320px] p-3.5 rounded-[22px] bg-[#141822]/95 border border-orange-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.85)] hover:border-orange-400 backdrop-blur-2xl text-xs text-[#D7E2EA] flex items-start gap-3 cursor-pointer group transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-black flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,84,0,0.4)] mt-0.5">
                <Smile className="w-4 h-4" />
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                    ANURGO Studio AI
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTeaser(false);
                    }}
                    className="text-[#D7E2EA]/40 hover:text-white transition-colors p-0.5"
                    aria-label="Dismiss message"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[11px] text-[#D7E2EA]/90 leading-snug font-sans">
                  👋 <strong className="text-white">Need a website?</strong> Ask about friendly pricing, live demos, or say hi!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chatbot Open Launcher Pill (Friendly Copilot Removed completely) */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 260 }}
              onClick={() => {
                setIsOpen(true);
                setShowTeaser(false);
              }}
              className="group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-[#12141A]/95 hover:bg-[#1A1E26] border border-orange-500/40 hover:border-orange-500 text-white shadow-[0_10px_35px_rgba(0,0,0,0.85)] hover:shadow-[0_0_28px_rgba(255,84,0,0.45)] backdrop-blur-2xl transition-all duration-300 cursor-pointer"
              aria-label="Open ANURGO Studio AI Assistant"
            >
              {/* Pulsing Active Indicator */}
              <div className="relative flex items-center justify-center">
                <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-500/50 animate-ping" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
              </div>

              <div className="flex items-center gap-1.5 font-mono text-xs tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-orange-400 group-hover:rotate-12 transition-transform" />
                <span className="font-bold uppercase text-white">ANURGO AI</span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Panel Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Clickable Backdrop for Empty Space Outside (Closes Chatbot on Outside Click) */}
            <motion.div
              key="chatbot-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCloseChat}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] cursor-pointer"
              aria-label="Close chat on outside click"
            />

            <motion.div
              key="chatbot-panel"
              initial={{ opacity: 0, y: 35, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 35, scale: 0.95 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[420px] h-[560px] sm:h-[600px] max-h-[90vh] flex flex-col rounded-[28px] sm:rounded-[34px] bg-[#0E1015]/95 backdrop-blur-2xl border border-orange-500/30 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(255,84,0,0.15)] overflow-hidden"
            >
            {/* Top Studio Header with Status, New Chat, History & Tools */}
            <div className="px-4 sm:px-5 py-3.5 bg-[#141822]/95 border-b border-[#D7E2EA]/10 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-[1.5px] flex items-center justify-center shadow-[0_0_15px_rgba(255,84,0,0.35)]">
                  <div className="w-full h-full rounded-[10px] bg-[#0E1015] flex items-center justify-center">
                    <Bot className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0E1015]" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-mono font-black uppercase tracking-wider text-white">
                      ANURGO AI
                    </h4>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  </div>
                  <p className="text-[10px] text-[#D7E2EA]/60 font-sans">
                    Studio AI Assistant • Multilingual
                  </p>
                </div>
              </div>

              {/* Header Action Tools: New Chat, History, Sound, Close */}
              <div className="flex items-center gap-1">
                {/* New Chat Button */}
                <button
                  onClick={handleStartNewChat}
                  className="px-2.5 py-1 rounded-lg bg-[#1A1F2B] hover:bg-orange-500 text-[#D7E2EA] hover:text-black border border-[#D7E2EA]/15 hover:border-orange-400 text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                  title="Start a new chat"
                  aria-label="New chat"
                >
                  <Plus className="w-3 h-3" />
                  <span className="hidden sm:inline">New Chat</span>
                </button>

                {/* History Drawer Toggle Button */}
                <button
                  onClick={() => setViewMode((prev) => (prev === 'history' ? 'chat' : 'history'))}
                  className={`w-7 h-7 rounded-lg ${
                    viewMode === 'history'
                      ? 'bg-orange-500 text-black'
                      : 'bg-[#1A1F2B] hover:bg-[#252B3B] text-[#D7E2EA]/70 hover:text-white'
                  } flex items-center justify-center transition-colors cursor-pointer relative`}
                  title="View chat history"
                  aria-label="Toggle chat history"
                >
                  <History className="w-3.5 h-3.5" />
                  {sessions.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-orange-500 text-black text-[8px] font-mono font-bold flex items-center justify-center">
                      {sessions.length}
                    </span>
                  )}
                </button>

                {/* Audio Chime Toggle */}
                <button
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className="w-7 h-7 rounded-lg bg-[#1A1F2B] hover:bg-[#252B3B] text-[#D7E2EA]/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title={soundEnabled ? 'Mute sound chime' : 'Enable sound chime'}
                  aria-label="Toggle sound"
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-orange-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={handleCloseChat}
                  className="w-7 h-7 rounded-lg bg-[#1A1F2B] hover:bg-rose-950 text-[#D7E2EA]/70 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close Chatbot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* VIEW MODE: CHAT HISTORY PANEL */}
            {viewMode === 'history' ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B0D12]">
                <div className="flex items-center justify-between pb-2 border-b border-[#D7E2EA]/10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('chat')}
                      className="p-1 rounded-lg bg-[#181C26] hover:bg-[#222836] text-[#D7E2EA] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <h5 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                      Chat History ({sessions.length})
                    </h5>
                  </div>

                  {sessions.length > 0 && (
                    <button
                      onClick={handleClearAllHistory}
                      className="text-[10px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={handleStartNewChat}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,84,0,0.25)] hover:scale-[1.01] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start A New Chat</span>
                </button>

                {sessions.length === 0 ? (
                  <div className="py-12 text-center space-y-2 text-[#D7E2EA]/50 font-sans text-xs">
                    <MessageSquare className="w-8 h-8 mx-auto text-[#D7E2EA]/20" />
                    <p>No saved chat history yet.</p>
                    <p className="text-[11px] text-[#D7E2EA]/40">Your conversations will be saved here automatically.</p>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    {sessions.map((session) => {
                      const isActive = session.id === activeSessionId;
                      const dateStr = new Date(session.updatedAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <div
                          key={session.id}
                          onClick={() => handleSelectSession(session.id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                            isActive
                              ? 'bg-orange-500/10 border-orange-500/50 text-white'
                              : 'bg-[#141822] hover:bg-[#1A202E] border-[#D7E2EA]/10 text-[#D7E2EA]/85'
                          }`}
                        >
                          <div className="flex-1 truncate space-y-0.5">
                            <p className="text-xs font-medium truncate group-hover:text-orange-300 transition-colors">
                              {session.title || 'Conversation'}
                            </p>
                            <p className="text-[10px] font-mono text-[#D7E2EA]/50">
                              {dateStr} • {session.messages.length} messages
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isActive && (
                              <span className="text-[9px] font-mono font-bold text-orange-400 bg-orange-500/20 px-1.5 py-0.5 rounded">
                                Active
                              </span>
                            )}
                            <button
                              onClick={(e) => handleDeleteSession(e, session.id)}
                              className="p-1.5 rounded-lg text-[#D7E2EA]/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete conversation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* VIEW MODE: ACTIVE CONVERSATION */
              <>
                {/* Message Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans select-text">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-end gap-2 max-w-[92%]">
                        {msg.sender === 'ai' && (
                          <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0 mb-1">
                            <Sparkles className="w-3 h-3" />
                          </div>
                        )}

                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            msg.sender === 'user'
                              ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-black font-medium rounded-br-none shadow-[0_4px_20px_rgba(255,84,0,0.3)] text-xs sm:text-sm'
                              : 'bg-[#151922] text-[#D7E2EA] border border-[#D7E2EA]/15 rounded-bl-none shadow-md'
                          }`}
                        >
                          {/* Markdown Formatted Content (Renders bold and links without raw **) */}
                          {msg.sender === 'user' ? (
                            <div className="whitespace-pre-line break-words">{msg.text}</div>
                          ) : (
                            <div className="relative">
                              <FormattedMessage content={msg.text} />
                              {/* ChatGPT style blinking typing block cursor */}
                              {streamingMessageId === msg.id && (
                                <span className="inline-block w-1.5 h-3.5 bg-orange-400 ml-1.5 translate-y-0.5 animate-pulse rounded-sm shadow-[0_0_8px_#FF5400] align-middle" />
                              )}
                            </div>
                          )}

                          {/* Interactive In-Chat Action Buttons (fade in after streaming finishes) */}
                          {streamingMessageId !== msg.id && msg.actionButtons && msg.actionButtons.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-[#D7E2EA]/10 flex flex-wrap gap-1.5 animate-fadeIn">
                              {msg.actionButtons.map((btn, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => btn.action()}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500 text-orange-300 hover:text-black border border-orange-500/30 hover:border-orange-400 text-[10px] sm:text-xs font-mono font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                                >
                                  <span>{btn.label}</span>
                                  {btn.icon === 'whatsapp' ? (
                                    <Phone className="w-3 h-3" />
                                  ) : btn.icon === 'mail' ? (
                                    <Mail className="w-3 h-3" />
                                  ) : btn.icon === 'external' ? (
                                    <ExternalLink className="w-3 h-3" />
                                  ) : (
                                    <ArrowRight className="w-3 h-3" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Conversational Follow-up Suggestion Chips (fade in after streaming finishes) */}
                      {streamingMessageId !== msg.id && msg.sender === 'ai' && msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-2 ml-8 flex flex-wrap gap-1.5 animate-fadeIn">
                          {msg.suggestions.map((suggestion, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendPrompt(suggestion)}
                              className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#181C26] hover:bg-orange-500 hover:text-black border border-[#D7E2EA]/15 hover:border-orange-400 text-[#D7E2EA]/85 transition-all cursor-pointer active:scale-95"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      <span className="text-[9px] font-mono text-[#D7E2EA]/40 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2 animate-fadeIn">
                      <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0">
                        <Sparkles className="w-3 h-3 animate-spin" />
                      </div>
                      <div className="px-3.5 py-2.5 rounded-2xl bg-[#151922] border border-[#D7E2EA]/10 flex items-center gap-1.5 shadow-sm">
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
                    placeholder="Ask ANURGO AI..."
                    disabled={isTyping || !!streamingMessageId}
                    className="flex-1 bg-[#1A1F2C] border border-[#D7E2EA]/15 focus:border-orange-500 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#D7E2EA]/40 outline-none transition-colors font-sans disabled:opacity-50"
                  />

                  <button
                    type="submit"
                    disabled={!inputVal.trim() || isTyping || !!streamingMessageId}
                    className="w-10 h-10 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-40 text-black flex items-center justify-center transition-all cursor-pointer shadow-[0_0_15px_rgba(255,84,0,0.3)] shrink-0 active:scale-95"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
};

export default AnurgoAIChatbot;
