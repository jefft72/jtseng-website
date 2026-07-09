import SectionHead from '../components/SectionHead';
import { links } from '../data';

function Contact() {
  return (
    <section id="contact" className="section" aria-label="Contact">
      <SectionHead num="04" title="Contact" />
      <a className="contact" href={`mailto:${links.email}`}>
        {links.email}
      </a>
      <footer className="footer">
        <span>
          © {new Date().getFullYear()} Jeffrey Tseng
          <button
            type="button"
            className="footer-key"
            onClick={() => window.dispatchEvent(new Event('jt:keymap'))}
          >
            ? keymap
          </button>
        </span>
        <div className="footer-links">
          <a href={links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={links.resume} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
      </footer>
    </section>
  );
}

export default Contact;
