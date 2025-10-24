import Header from './components/Header';
import Landing from './components/Landing.tsx';
import About from './components/About.tsx';
import Resume from './components/Resume.tsx';
import Footer from './components/Footer';
import { useRef } from 'react';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Rely solely on native CSS scroll-snap for consistent behavior across devices

  return (
    <div className="min-h-screen" style={{ background: '#000' }}>
      <Header />
      <main ref={containerRef} className="snap-container">
        <Landing />
        <About fullPage />
        <Resume fullPage />
      </main>
      <Footer />
    </div>
  );
}

export default App;