import { useEffect, useState } from 'react';
import VisitCounter from '../components/VisitCounter';
import type { Surface } from '../App';

const nav = (surface: Surface) =>
  window.dispatchEvent(new CustomEvent('jt:nav', { detail: { surface } }));

function TopBar({ surface }: { surface: Surface }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // hysteresis so the bar doesn't flicker at the threshold
      setCollapsed((c) => (c ? window.scrollY > 40 : window.scrollY > 110));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`topbar${collapsed ? ' topbar--collapsed' : ''}`}
      aria-label="Primary"
    >
      <a className="mark" href="#top">
        JT
      </a>
      <div className="topbar-links">
        {surface === 'work' ? (
          <>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#stack">Stack</a>
            <button
              type="button"
              className="topbar-switch"
              onClick={() => nav('play')}
            >
              After hours
            </button>
          </>
        ) : (
          <>
            <a href="#travel">Travel</a>
            <a href="#reading">Reading</a>
            <a href="#terminal">Terminal</a>
            <a href="#climbing">Climbing</a>
            <button
              type="button"
              className="topbar-switch"
              onClick={() => nav('work')}
            >
              Back to work
            </button>
          </>
        )}
        <span className="kbd-hint" aria-hidden="true">
          ⌘K
        </span>
        <VisitCounter />
      </div>
    </nav>
  );
}

export default TopBar;
