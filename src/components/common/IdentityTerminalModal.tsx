import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Sparkles, Send, CornerDownLeft, ExternalLink, ShieldCheck, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TERMINAL_COMMANDS, ANURGO_BRAND } from '../../data/anurgoData';

interface IdentityTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LogEntry {
  type: 'input' | 'output' | 'system';
  content: string;
}

export const IdentityTerminalModal: React.FC<IdentityTerminalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      type: 'system',
      content: `===============================================================
ANURGO://IDENTITY
===============================================================`,
    },
    {
      type: 'output',
      content: `NAME       Anurag
STUDIO     ANURGO
FOCUS      Web • 3D • Creative Development
STATUS     Available for Select Projects`,
    },
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    // Add command to history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const newLogs: LogEntry[] = [...logs, { type: 'input', content: `$ ${cmd}` }];

    if (trimmed === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    }

    if (trimmed === 'easter-egg') {
      // Fire confetti burst!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5400', '#FF7824', '#F59E0B', '#FFFFFF'],
      });
    }

    const response = TERMINAL_COMMANDS[trimmed] || `>> Command not recognized: '${trimmed}'. Type 'help' to see all available discovery commands.`;

    newLogs.push({ type: 'output', content: response });
    setLogs(newLogs);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0) {
        const nextIdx = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ANURGO_BRAND.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const quickChips = ['whoami', 'role', 'brand', 'socials', 'stack', 'contact', 'easter-egg', 'help'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-[#090D17] border border-orange-500/40 shadow-[0_0_50px_rgba(255,84,0,0.25)] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Titlebar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0D1220] border-b border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 cursor-pointer" onClick={onClose} />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#161616] border border-orange-500/40 text-xs font-mono font-black tracking-tight text-white">
                A<span className="text-orange-500 font-extrabold">/</span>G
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs text-orange-400 font-bold">
                <Terminal className="w-4 h-4 text-orange-400" />
                <span>ANURGO://IDENTITY</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold hidden sm:inline">
              EASTER EGG ACTIVE
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close terminal modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Output Area */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto font-mono text-xs sm:text-[13px] space-y-3 bg-[#06080D]/95 text-slate-200">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`leading-relaxed whitespace-pre-wrap ${
                log.type === 'input'
                  ? 'text-orange-400 font-bold'
                  : log.type === 'system'
                  ? 'text-slate-400 text-xs'
                  : 'text-slate-200'
              }`}
            >
              {log.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick Command Chips */}
        <div className="px-4 py-2.5 bg-[#0A0F1D] border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0">
            Quick Chips:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {quickChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleCommand(chip)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-orange-500/20 text-slate-300 hover:text-orange-300 border border-slate-700 hover:border-orange-500/40 text-[11px] font-mono transition-all whitespace-nowrap cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Coordinates Toolbar */}
        <div className="px-4 py-2.5 bg-[#0B101E] border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3 text-slate-300">
            <a
              href={ANURGO_BRAND.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-orange-400 flex items-center gap-1 transition-colors"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600">&bull;</span>
            <a
              href={ANURGO_BRAND.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-orange-400 flex items-center gap-1 transition-colors"
            >
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600">&bull;</span>
            <a
              href={ANURGO_BRAND.fiverr}
              target="_blank"
              rel="noreferrer"
              className="hover:text-orange-400 flex items-center gap-1 transition-colors"
            >
              <span>Fiverr</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600">&bull;</span>
            <button
              onClick={handleCopyEmail}
              className="hover:text-orange-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Tip: Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Esc</kbd> to exit
          </div>
        </div>

        {/* Command Input Bar */}
        <div className="p-3 bg-[#0D1426] border-t border-orange-500/30 flex items-center gap-2">
          <span className="font-mono text-orange-400 font-bold pl-2 text-xs sm:text-sm">
            visitor@anurgo-v2:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command (e.g. 'whoami', 'stack', 'socials')..."
            className="flex-1 bg-transparent text-white font-mono text-xs sm:text-sm outline-none placeholder:text-slate-600"
          />
          <button
            onClick={() => handleCommand(inputVal)}
            disabled={!inputVal.trim()}
            className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 disabled:opacity-40 transition-colors cursor-pointer"
            title="Execute Command"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
