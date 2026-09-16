import React, { useState, useEffect } from 'react';
import { AnurgoNavbar } from './components/layout/AnurgoNavbar';
import { HeroSection } from './components/sections/HeroSection';
import { MarqueeSection } from './components/sections/MarqueeSection';
import { AboutSection } from './components/sections/AboutSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { ProcessSection } from './components/sections/ProcessSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { WhyAnurgoSection } from './components/sections/WhyAnurgoSection';
import { ProjectTermsSection } from './components/sections/ProjectTermsSection';
import { AnurgoContact } from './components/sections/AnurgoContact';
import { AnurgoFooter } from './components/layout/AnurgoFooter';
import { AnurgoBackground } from './components/common/AnurgoBackground';
import { AnurgoAIChatbot } from './components/common/AnurgoAIChatbot';
import { IdentityTerminalModal } from './components/common/IdentityTerminalModal';
import { ProjectPreviewModal } from './components/common/ProjectPreviewModal';
import { FeedbackModal } from './components/common/FeedbackModal';
import { FloatingFeedbackButton } from './components/common/FloatingFeedbackButton';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { ClientDashboardModal } from './components/client/ClientDashboardModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { PORTFOLIO_PROJECTS, PortfolioProject } from './data/anurgoData';

export const AppContent: React.FC = () => {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState<PortfolioProject | null>(null);
  const [bookingPrefill, setBookingPrefill] = useState<string>('');

  // Keyboard shortcut (Ctrl+I or ~) to trigger ANURGO://IDENTITY easter egg
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      } else if (e.key === '`' || e.key === '~') {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setTerminalOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenPreviewById = (projectId: string) => {
    const proj =
      PORTFOLIO_PROJECTS.find(
        (p) => p.id === projectId || p.projectNumber === projectId
      ) || PORTFOLIO_PROJECTS[0];
    setPreviewProject(proj);
  };

  const handleSelectBookProject = (projectOrServiceTitle: string) => {
    setBookingPrefill(projectOrServiceTitle);
    const target = document.getElementById('contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-sans selection:bg-orange-500/30 selection:text-orange-200 overflow-x-clip">
      {/* Subtle Dynamic Studio Background */}
      <AnurgoBackground />

      {/* Sticky Minimal Navbar */}
      <AnurgoNavbar
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenFeedback={() => setFeedbackOpen(true)}
      />

      {/* Main Assembly */}
      <main className="relative z-10 space-y-0">
        {/* 1. Hero Section */}
        <HeroSection
          onContactClick={() => handleScrollToSection('contact')}
          onExploreWorkClick={() => handleScrollToSection('work')}
        />

        {/* 2. Marquee Section */}
        <MarqueeSection />

        {/* 3. About Section (Creator & Radical Transparency) */}
        <AboutSection
          onContactClick={() => handleScrollToSection('contact')}
          onOpenFeedback={() => setFeedbackOpen(true)}
          onOpenTerminal={() => setTerminalOpen(true)}
        />

        {/* 4. Services Section */}
        <ServicesSection />

        {/* 5. The Anurgo System / Process Section */}
        <ProcessSection />

        {/* 6. Projects / Work Section */}
        <ProjectsSection onProjectSelect={handleOpenPreviewById} />

        {/* 7. Why ANURGO Section */}
        <WhyAnurgoSection />

        {/* 8. Project Terms Section (50% Upfront • 50% Before Final Delivery) */}
        <ProjectTermsSection />

        {/* 9. Contact Section */}
        <AnurgoContact initialServiceOrProject={bookingPrefill} />
      </main>

      {/* Studio Footer */}
      <AnurgoFooter
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenFeedback={() => setFeedbackOpen(true)}
      />

      {/* Floating ANURGO Studio AI Chatbot Copilot */}
      <AnurgoAIChatbot onNavigateSection={handleScrollToSection} />

      {/* Floating Feedback Trigger Widget */}
      <FloatingFeedbackButton onClick={() => setFeedbackOpen(true)} />

      {/* Interactive Creator Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />

      {/* ANURGO://IDENTITY Developer Terminal Easter Egg Modal */}
      <IdentityTerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />

      {/* Interactive Live Demo Preview Modal with Device Switcher */}
      <ProjectPreviewModal
        project={previewProject}
        isOpen={!!previewProject}
        onClose={() => setPreviewProject(null)}
        onSelectBookProject={handleSelectBookProject}
      />

      {/* Client Authentication Modal */}
      <AuthModal />

      {/* Client Dashboard Modal */}
      <ClientDashboardModal />

      {/* Admin Analytics & Lead Pipeline Modal */}
      <AdminDashboardModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
