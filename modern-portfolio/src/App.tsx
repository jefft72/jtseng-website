import Header from './components/Header';
import Landing from './components/Landing.tsx';
import About from './components/About.tsx';
import Resume from './components/Resume.tsx';
import Footer from './components/Footer';
import { useEffect, useRef, useState } from 'react';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (locked) return;
      e.preventDefault();
      if (e.deltaY > 20) {
        setLocked(true);
        setIndex((i) => Math.min(i + 1, 1));
        setTimeout(() => setLocked(false), 700);
      } else if (e.deltaY < -20) {
        setLocked(true);
        setIndex((i) => Math.max(i - 1, 0));
        setTimeout(() => setLocked(false), 700);
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel as any);
  }, [locked]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const sections = Array.from(el.querySelectorAll('.snap-section')) as HTMLElement[];
    sections[index]?.scrollIntoView({ behavior: 'smooth' });
  }, [index]);

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