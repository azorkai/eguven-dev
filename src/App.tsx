import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import ArticleList from './components/ArticleList';
import Footer from './components/Footer';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import { Terminal } from 'lucide-react';
import { useState } from 'react';
import TerminalOverlay from './components/TerminalOverlay';
import TransitionEffect from './components/TransitionEffect';
import NothingHere from './components/NothingHere';
import ScrollToTop from './components/ScrollToTop';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const Articles = () => (
  <>
    <Hero />
    <div className="container mx-auto px-6 md:px-24 pb-32 flex flex-col lg:flex-row gap-16 relative">
      <Sidebar />
      <ArticleList />
    </div>
  </>
);

function AppContent() {
  const location = useLocation();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [dockPosition, setDockPosition] = useState<'floating' | 'top' | 'bottom' | 'left' | 'right'>('bottom');

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
      className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-white transition-all duration-500 font-sans antialiased min-h-screen flex flex-col relative overflow-x-hidden"
      style={getLayoutStyles()}
    >
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col items-center gap-6 z-10 text-xs tracking-widest text-text-muted dark:text-gray-500">
        <button
          className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          onClick={() => setIsTerminalOpen(true)}
          title="Open Terminal"
        >
          <Terminal size={16} />
        </button>
      </div>

      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col items-center gap-6 z-10 text-[10px] tracking-[0.3em] text-text-muted dark:text-gray-500 rotate-180" style={{ writingMode: 'vertical-rl' }}>
        <span>{location.pathname === '/contact' ? 'CONNECT' : 'SCROLL'}</span>
        <div className="h-12 w-[1px] bg-gray-400 dark:bg-gray-700 mt-4"></div>
      </div>

      <Navbar />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <div key={location.pathname}>
            <TransitionEffect />
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Projects /></PageTransition>} />
              <Route path="/articles" element={<PageTransition><Articles /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            </Routes>
          </div>
        </AnimatePresence>
      </main>

      <Footer />

      {['/', '/articles'].includes(location.pathname) && <NothingHere />}

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
      <AppContent />
    </Router>
  );
}

export default App;
