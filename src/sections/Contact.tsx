import { links } from '../data';

function Contact() {
  return (
    <section id="contact" className="section" aria-label="Contact">
      <div className="section-head">
        <span className="section-num">04</span>
        <h2>Contact</h2>
      </div>
      <a className="contact" href={`mailto:${links.email}`}>
        {links.email}
      </a>
      <footer className="footer">
        <span>© {new Date().getFullYear()} Jeffrey Tseng</span>
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
