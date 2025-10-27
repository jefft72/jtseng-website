import Header from './components/Header';
import Landing from './components/Landing.tsx';
import About from './components/About.tsx';
import Resume from './components/Resume.tsx';
import Footer from './components/Footer';
import { useRef } from 'react';
import SpiderWebBackground from './components/SpiderWebBackground';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Regular scrolling (no snap)

  return (
    <div className="min-h-screen" style={{ background: '#000' }}>
      <SpiderWebBackground />
      <Header />
  <main ref={containerRef}>
        <Landing />
        <About fullPage />
        <Resume fullPage />
      </main>
      <Footer />
    </div>
  );
}

export default App;