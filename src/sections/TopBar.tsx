import { useEffect, useState } from 'react';
import VisitCounter from '../components/VisitCounter';
import { links } from '../data';

function TopBar() {
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
        <a href="#experience">Experience</a>
        <a href="#projects">Projects</a>
        <a href="#stack">Stack</a>
        <a href="#reading">Reading</a>
        <a href="#contact">Contact</a>
        <a href={links.resume} target="_blank" rel="noreferrer">
          Resume
        </a>
        <span className="kbd-hint" aria-hidden="true">
          ⌘K
        </span>
        <VisitCounter />
      </div>
    </nav>
  );
}

export default TopBar;
