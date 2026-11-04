import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import AgentCursor from './components/AgentCursor';
import CommandPalette from './components/CommandPalette';
import KeyboardLayer from './components/KeyboardLayer';
import DotGrid from './components/DotGrid';
import TopBar from './sections/TopBar';
import Landing from './sections/Landing';
import PlayHero from './sections/PlayHero';
import Travel from './sections/Travel';
import Reading from './sections/Reading';
import TerminalSetup from './sections/TerminalSetup';
import Climbing from './sections/Climbing';
import Segue from './sections/Segue';
import { projects } from './data';

export type Surface = 'work' | 'play';
type NavDetail = { surface: Surface; selector?: string; travel?: boolean };

const playSections = new Set(['travel', 'reading', 'terminal', 'climbing']);
const workSections = new Set(['top', 'about', 'experience', 'projects', 'stack', 'personal-reading', 'nb-background', ...projects.map((project) => `project-${project.name.toLowerCase()}`)]);

function navigationFromHash(): NavDetail {
  const hash = window.location.hash;
  if (hash.startsWith('#/after-hours')) {
    const section = hash.split('/')[2];
    return { surface: 'play', selector: playSections.has(section) ? `#${section}` : undefined };
  }
  const section = hash.slice(1);
  if (playSections.has(section)) return { surface: 'play', selector: hash };
  return { surface: 'work', selector: workSections.has(section) ? hash : undefined };
}

function App() {
  const [navigation, setNavigation] = useState<NavDetail>(navigationFromHash);
  const pendingRef = useRef<NavDetail | null>(null);
  const { surface } = navigation;

  useEffect(() => {
    const onNav = (event: Event) => {
      const detail = (event as CustomEvent<NavDetail>).detail;
      if (!detail) return;
      const hash = detail.surface === 'play'
        ? `#/after-hours${detail.selector ? `/${detail.selector.slice(1)}` : ''}`
        : detail.selector ?? '#/';
      if (window.location.hash === hash) {
        setNavigation(detail);
      } else {
        pendingRef.current = detail;
        window.location.hash = hash;
      }
    };
    const onHashChange = () => {
      setNavigation({ ...navigationFromHash(), travel: pendingRef.current?.travel });
      pendingRef.current = null;
    };
    window.addEventListener('jt:nav', onNav);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('jt:nav', onNav);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('is-play', surface === 'play');
    const target = navigation.selector
      ? document.querySelector(navigation.selector)
      : null;
    if (target instanceof HTMLDetailsElement) target.open = true;
    if (target && !document.querySelector('[data-viewport-page]')) target.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
    if (!navigation.travel) return;
    const timer = window.setTimeout(() => window.dispatchEvent(new Event('jt:travel')), 300);
    return () => window.clearTimeout(timer);
  }, [navigation, surface]);

  return (
    <div className={`surface surface--${surface}`}>
      {surface === 'work' ? (
        <Landing />
      ) : (
        <>
          <DotGrid inverted />
          <TopBar surface={surface} />
          <main>
            <PlayHero />
            <Travel />
            <Reading />
            <TerminalSetup />
            <Climbing />
            <Segue to="work" title="Back to work" cmd="cd ~/work" />
          </main>
          <AgentCursor />
        </>
      )}
      <CommandPalette />
      <KeyboardLayer />
    </div>
  );
}

export default App;
