import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import ArticleList from './components/ArticleList';
import Footer from './components/Footer';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import MachineEdition from './pages/MachineEdition';
import CrmSolid from './pages/CrmSolid';
import PlayerSells from './pages/PlayerSells';
import { Terminal } from 'lucide-react';
import { useCallback, useState } from 'react';
import TerminalOverlay from './components/TerminalOverlay';
import PageTransition from './components/PageTransition';
import NothingHere from './components/NothingHere';
import NotFound from './pages/NotFound';
import CopyCredit from './components/CopyCredit';
import CastOff from './components/CastOff';
import CopyDesk from './components/CopyDesk';
import OnTheStand from './components/OnTheStand';
import PrintColophon from './components/PrintColophon';
import ScrollToTop from './components/ScrollToTop';
import MachineBar from './components/MachineBar';
import DocumentMeta from './components/DocumentMeta';
import LanguageProvider from './i18n/LanguageProvider';
import { useLanguage } from './i18n/useLanguage';

const Articles = () => (
  <>
    <Hero />
    <div className="container mx-auto px-6 md:px-24 pb-32 flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
      <Sidebar />
      <ArticleList />
    </div>
  </>
);

function AppContent() {
  const location = useLocation();
  const { t } = useLanguage();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [dockPosition, setDockPosition] = useState<'floating' | 'top' | 'bottom' | 'left' | 'right'>('bottom');

  /* Stable, because the keyboard listener in <CopyDesk> is keyed on it and a
     new function every render would tear the listener down every render. */
  const openTerminal = useCallback(() => setIsTerminalOpen(true), []);

  const getLayoutStyles = () => {
    // On mobile, we might not want to shift content if it squishes too much
    // Let's only apply padding on larger screens or if we decide to
    const isMobile = window.innerWidth < 768; // Simple check, or use a hook
    if (!isTerminalOpen || dockPosition === 'floating' || isMobile) return {};

    switch (dockPosition) {
      case 'left': return { paddingLeft: '400px' };
      case 'right': return { paddingRight: '400px' };
      case 'top': return { paddingTop: '300px' };
      case 'bottom': return { paddingBottom: '300px' };
      default: return {};
    }
  };

  return (
    <div
      className="text-ink-body transition-all duration-500 font-serif antialiased min-h-screen flex flex-col relative overflow-x-clip"
      style={getLayoutStyles()}
    >
      <div data-print="hide" className="fixed left-6 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col items-center gap-6 z-[36] text-xs tracking-widest text-ink-muted">
        <button
          className="hover:text-ink transition-colors cursor-pointer border border-rule rounded-sm bg-paper-raised p-2"
          onClick={openTerminal}
          title={t.rail.openTerminal}
        >
          <Terminal size={16} />
        </button>
      </div>

      <div data-print="hide" className="fixed right-6 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col items-center gap-6 z-[36] folio text-ink-faint rotate-180" style={{ writingMode: 'vertical-rl' }}>
        <span>{location.pathname === '/contact' ? t.rail.connect : t.rail.scroll}</span>
        <div className="h-12 w-[1px] bg-rule-strong mt-4"></div>
      </div>

      <PrintColophon variant="slug" />

      <MachineBar />

      <Navbar />

      <main className="flex-grow">
        {/* One press pass per address, around the whole switch rather than
            around each page. The key is the whole mechanism: a new address
            remounts the subtree, which starts a new sheet. There is no
            <AnimatePresence> and no exit animation on purpose - waiting for
            one page to leave before the next may start is what makes a site
            feel slow, and the sheet already covers the swap. */}
        <PageTransition key={location.pathname} pathname={location.pathname}>
          <Routes>
            <Route path="/" element={<Projects />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/ai" element={<MachineEdition />} />
            <Route path="/projects/crmsolid" element={<CrmSolid />} />
            <Route path="/projects/playersells" element={<PlayerSells />} />
            {/* Every address that was never printed. */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>

      <PrintColophon />

      <Footer />

      {['/', '/articles'].includes(location.pathname) && <NothingHere />}

      {/* The keyboard, and the tape measure the desk puts over a passage.
          Both sit outside the page so they survive a route change. */}
      <CopyDesk terminalOpen={isTerminalOpen} onOpenTerminal={openTerminal} />

      <CastOff />

      <TerminalOverlay
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        dockPosition={dockPosition}
        setDockPosition={setDockPosition}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <LanguageProvider>
        <DocumentMeta />
        <CopyCredit />
        <OnTheStand />
        <AppContent />
      </LanguageProvider>
    </Router>
  );
}

export default App;
