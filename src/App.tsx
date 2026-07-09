import { useEffect, useRef, useState } from 'react';
import AgentCursor from './components/AgentCursor';
import CommandPalette from './components/CommandPalette';
import KeyboardLayer from './components/KeyboardLayer';
import DotGrid from './components/DotGrid';
import TopBar from './sections/TopBar';
import Hero from './sections/Hero';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Stack from './sections/Stack';
import Contact from './sections/Contact';
import PlayHero from './sections/PlayHero';
import Reading from './sections/Reading';
import Travel from './sections/Travel';
import Segue from './sections/Segue';

export type Surface = 'work' | 'play';

type NavDetail = { surface: Surface; selector?: string; travel?: boolean };

const surfaceFromHash = (): Surface =>
  window.location.hash.startsWith('#/after-hours') ? 'play' : 'work';

const WIPE_MS = 520;

function App() {
  const [surface, setSurface] = useState<Surface>(surfaceFromHash);
  const [wipe, setWipe] = useState<{ to: Surface; phase: 'in' | 'out' } | null>(
    null,
  );
  const surfaceRef = useRef(surface);
  surfaceRef.current = surface;
  const pendingRef = useRef<NavDetail | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const land = (detail: NavDetail) => {
      window.scrollTo({ top: 0 });
      if (detail.selector) {
        requestAnimationFrame(() =>
          document.querySelector(detail.selector!)?.scrollIntoView(),
        );
      }
      if (detail.travel) {
        timers.current.push(
          window.setTimeout(
            () => window.dispatchEvent(new Event('jt:travel')),
            600,
          ),
        );
      }
    };

    const runWipe = (detail: NavDetail) => {
      if (reduced) {
        setSurface(detail.surface);
        land(detail);
        return;
      }
      setWipe({ to: detail.surface, phase: 'in' });
      timers.current.push(
        window.setTimeout(() => {
          setSurface(detail.surface);
          land(detail);
          setWipe({ to: detail.surface, phase: 'out' });
          timers.current.push(
            window.setTimeout(() => setWipe(null), WIPE_MS),
          );
        }, WIPE_MS),
      );
    };

    const onNav = (event: Event) => {
      const detail = (event as CustomEvent<NavDetail>).detail;
      if (!detail) return;
      if (detail.surface === surfaceRef.current) {
        if (detail.selector) {
          document
            .querySelector(detail.selector)
            ?.scrollIntoView({ behavior: 'smooth' });
        }
        if (detail.travel) {
          timers.current.push(
            window.setTimeout(
              () => window.dispatchEvent(new Event('jt:travel')),
              500,
            ),
          );
        }
        return;
      }
      const targetHash = detail.surface === 'play' ? '#/after-hours' : '#/';
      pendingRef.current = detail;
      if (window.location.hash === targetHash) {
        runWipe(detail);
        pendingRef.current = null;
      } else {
        window.location.hash = targetHash;
      }
    };

    const onHashChange = () => {
      const next = surfaceFromHash();
      if (next === surfaceRef.current) return;
      const detail =
        pendingRef.current?.surface === next
          ? pendingRef.current
          : { surface: next };
      pendingRef.current = null;
      runWipe(detail);
    };

    window.addEventListener('jt:nav', onNav);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('jt:nav', onNav);
      window.removeEventListener('hashchange', onHashChange);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('is-play', surface === 'play');
  }, [surface]);

  return (
    <div className={`surface${surface === 'play' ? ' surface--play' : ''}`}>
      <DotGrid key={surface} inverted={surface === 'play'} />
      <TopBar surface={surface} />
      {surface === 'work' ? (
        <main>
          <Hero />
          <Experience />
          <Projects />
          <Stack />
          <Contact />
          <Segue to="play" title="After hours" cmd="cd ~/after-hours" />
        </main>
      ) : (
        <main>
          <PlayHero />
          <Reading />
          <Travel />
          <Segue to="work" title="Back to work" cmd="cd ~/work" />
        </main>
      )}
      <AgentCursor />
      <CommandPalette />
      <KeyboardLayer />
      {wipe && (
        <div
          className={`wipe wipe--${wipe.phase} wipe--${wipe.to}`}
          aria-hidden="true"
        >
          <span className="wipe-label">
            cd ~/{wipe.to === 'play' ? 'after-hours' : 'work'}
          </span>
        </div>
      )}
    </div>
  );
}

export default App;
