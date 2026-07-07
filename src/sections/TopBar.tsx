import VisitCounter from '../components/VisitCounter';
import { links } from '../data';

function TopBar() {
  return (
    <nav className="topbar" aria-label="Primary">
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
