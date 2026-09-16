// ==============================================================================
// ANURGO STUDIO — CLIENT DASHBOARD MODAL
// ==============================================================================
// Protected client area displaying account details, submitted project briefs,
// submission IDs (ANR-XXXX), and real-time 8-stage lifecycle status stepper.
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  LogOut, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  Layers, 
  Calendar,
  AlertCircle,
  Loader2,
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface ClientProject {
  submissionId: string;
  fullName: string;
  email: string;
  businessName: string;
  phone?: string;
  projectType: string;
  budget: string;
  timeline: string;
  details: string;
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
}

const PROJECT_LIFECYCLE_STAGES = [
  { id: 'Brief Received', label: 'Brief Received' },
  { id: 'Review', label: 'Review' },
  { id: 'Discussion', label: 'Discussion' },
  { id: 'Proposal', label: 'Proposal' },
  { id: 'Confirmed', label: 'Confirmed' },
  { id: 'Payment', label: 'Payment' },
  { id: 'Development', label: 'Development' },
  { id: 'Delivered', label: 'Delivered' },
];

export const ClientDashboardModal: React.FC = () => {
  const { user, token, dashboardModalOpen, closeDashboard, logout } = useAuth();
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);

  // Fetch client projects
  useEffect(() => {
    if (dashboardModalOpen && token) {
      setLoading(true);
      fetch('/api/client/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            setProjects(data.data);
            if (data.data.length > 0) {
              setSelectedProject(data.data[0]);
            }
          }
        })
        .catch((err) => console.error('Error fetching client projects:', err))
        .finally(() => setLoading(false));
    }
  }, [dashboardModalOpen, token]);

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dashboardModalOpen) {
        closeDashboard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dashboardModalOpen, closeDashboard]);

  if (!dashboardModalOpen || !user) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStageIndex = (currentStatus: string) => {
    const idx = PROJECT_LIFECYCLE_STAGES.findIndex(
      (s) => s.id.toLowerCase() === (currentStatus || '').toLowerCase()
    );
    return idx >= 0 ? idx : 0;
  };

  const handleStartNewBrief = () => {
    closeDashboard();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDashboard}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-5xl rounded-[36px] bg-[#0E121C] border border-[#D7E2EA]/15 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Top Decorative Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 shadow-[0_0_15px_rgba(255,84,0,0.8)]" />

          {/* Header Bar */}
          <div className="p-5 sm:p-6 border-b border-[#D7E2EA]/10 flex items-center justify-between gap-4 bg-[#121622]/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-black font-black font-mono flex items-center justify-center text-sm shadow-[0_0_15px_rgba(255,84,0,0.3)]">
                {user.fullName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight font-sans">
                    {user.fullName}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                    <Check className="w-2.5 h-2.5" />
                    <span>Verified Client</span>
                  </span>
                </div>
                <div className="text-xs font-mono text-[#D7E2EA]/60">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={logout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#181D2A] hover:bg-rose-950/40 border border-[#D7E2EA]/15 hover:border-rose-500/40 text-xs font-mono text-[#D7E2EA]/70 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

              <button
                onClick={closeDashboard}
                className="p-2 rounded-xl bg-[#181D2A] hover:bg-[#222A3D] text-[#D7E2EA]/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-orange-400 mx-auto" />
                <p className="text-xs font-mono text-[#D7E2EA]/60">Loading project briefs...</p>
              </div>
            ) : projects.length === 0 ? (
              // Empty State
              <div className="py-14 sm:py-18 text-center max-w-md mx-auto space-y-5">
                <div className="w-16 h-16 rounded-full bg-[#181D2A] border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,84,0,0.15)]">
                  <Layers className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-lg font-bold text-white uppercase tracking-tight">
                    No Project Briefs Yet
                  </h4>
                  <p className="text-xs text-[#D7E2EA]/65 font-sans leading-relaxed">
                    You haven&apos;t submitted a project brief with this account yet. Fill out the brief form below to initiate your bespoke digital project.
                  </p>
                </div>
                <button
                  onClick={handleStartNewBrief}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-black text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2 shadow-[0_0_20px_rgba(255,84,0,0.3)] transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>START A PROJECT BRIEF</span>
                </button>
              </div>
            ) : (
              // Projects Layout: Master-Detail
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Project List Column */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#D7E2EA]/60 px-1">
                    <span>Submitted Projects ({projects.length})</span>
                    <button
                      onClick={handleStartNewBrief}
                      className="text-orange-400 hover:text-orange-300 font-bold transition-colors cursor-pointer"
                    >
                      + New Brief
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                    {projects.map((proj) => {
                      const isSelected = selectedProject?.submissionId === proj.submissionId;
                      return (
                        <div
                          key={proj.submissionId}
                          onClick={() => setSelectedProject(proj)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#181E2E] border-orange-500/50 shadow-[0_0_20px_rgba(255,84,0,0.15)]'
                              : 'bg-[#121622] border-[#D7E2EA]/10 hover:border-[#D7E2EA]/25 hover:bg-[#151A28]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-xs font-mono font-bold text-orange-400">
                              {proj.submissionId}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-[10px] font-mono text-orange-300">
                              {proj.status}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-white truncate mb-1">
                            {proj.businessName}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-[#D7E2EA]/50 font-mono">
                            <span>{proj.projectType}</span>
                            <span>{new Date(proj.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Selected Project Detail & Status Stepper */}
                {selectedProject && (
                  <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-[#121622] border border-[#D7E2EA]/15 space-y-6">
                    {/* Project Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D7E2EA]/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-orange-400 font-bold">
                            {selectedProject.submissionId}
                          </span>
                          <button
                            onClick={() => handleCopy(selectedProject.submissionId)}
                            className="p-1 rounded bg-[#1C2234] hover:bg-[#252E46] text-[#D7E2EA]/60 hover:text-white transition-colors cursor-pointer"
                            title="Copy Submission ID"
                          >
                            {copiedId === selectedProject.submissionId ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight mt-1">
                          {selectedProject.businessName}
                        </h4>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] font-mono text-[#D7E2EA]/50 uppercase">Submission Date</div>
                        <div className="text-xs font-mono text-white flex items-center gap-1.5 justify-end mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-orange-400" />
                          <span>{new Date(selectedProject.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* 8-Stage Lifecycle Progress Stepper */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#D7E2EA]/70 uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-orange-400" />
                          <span>Project Lifecycle Status</span>
                        </span>
                        <span className="font-bold text-orange-400">
                          {selectedProject.status}
                        </span>
                      </div>

                      {/* Stepper Bar */}
                      <div className="pt-2">
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                          {PROJECT_LIFECYCLE_STAGES.map((stage, idx) => {
                            const activeIdx = getStageIndex(selectedProject.status);
                            const isCompleted = idx < activeIdx;
                            const isCurrent = idx === activeIdx;

                            return (
                              <div key={stage.id} className="text-center group">
                                <div
                                  className={`h-2 rounded-full mb-1.5 transition-all ${
                                    isCurrent
                                      ? 'bg-orange-500 shadow-[0_0_10px_rgba(255,84,0,0.8)] animate-pulse'
                                      : isCompleted
                                      ? 'bg-emerald-500'
                                      : 'bg-[#1E2538]'
                                  }`}
                                />
                                <span
                                  className={`text-[9px] sm:text-[10px] font-mono block truncate ${
                                    isCurrent
                                      ? 'text-orange-400 font-bold'
                                      : isCompleted
                                      ? 'text-emerald-400'
                                      : 'text-[#D7E2EA]/40'
                                  }`}
                                  title={stage.label}
                                >
                                  {stage.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#161B2A] border border-[#D7E2EA]/10 text-xs font-mono">
                      <div>
                        <div className="text-[10px] text-[#D7E2EA]/50 uppercase">Project Type</div>
                        <div className="text-white font-bold mt-0.5 truncate">{selectedProject.projectType}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#D7E2EA]/50 uppercase">Budget Range</div>
                        <div className="text-white font-bold mt-0.5">{selectedProject.budget}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#D7E2EA]/50 uppercase">Timeline</div>
                        <div className="text-white font-bold mt-0.5">{selectedProject.timeline}</div>
                      </div>
                    </div>

                    {/* Project Description Box */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-mono text-[#D7E2EA]/70 uppercase tracking-wider">
                        Submitted Description & Requirements
                      </div>
                      <div className="p-4 rounded-2xl bg-[#0E121C] border border-[#D7E2EA]/10 text-xs font-sans text-[#D7E2EA]/90 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                        {selectedProject.details}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
