import Header from './components/Header';
import Landing from './components/Landing.tsx';
import About from './components/About.tsx';
import Resume from './components/Resume.tsx';
import Footer from './components/Footer';
import { useRef, useState } from 'react';
import SpiderWebBackground from './components/SpiderWebBackground';
import IntroScreen from './components/IntroScreen';
import PixelatedSpaceBackground from './components/PixelatedSpaceBackground';
import { AnimatePresence } from 'framer-motion';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [startPortfolio, setStartPortfolio] = useState(false);

  const handleEnter = () => {
    setShowIntro(false);
    // Delay showing portfolio to allow zoom animation to complete
    setTimeout(() => setStartPortfolio(true), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: '#000' }}>
      <AnimatePresence mode="wait">
        {showIntro && <IntroScreen onEnter={handleEnter} />}
      </AnimatePresence>
      
      {startPortfolio && (
        <>
          <PixelatedSpaceBackground />
          <SpiderWebBackground />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <Header />
            <main ref={containerRef}>
              <Landing />
              <About fullPage />
              <Resume fullPage />
            </main>
            <Footer />
          </div>
        </>
      )}
    </div>
  );
}

export default App;