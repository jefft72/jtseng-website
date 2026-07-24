import { motion } from 'framer-motion';
import Globe from '../components/Globe';
import SectionHead from '../components/SectionHead';

function Travel() {
  return (
    <section id="travel" className="section" aria-label="Travel log">
      <SectionHead num="01" title="Travel log" />
      <motion.div
        className="travel"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Globe />
      </motion.div>
      <div className="travel-foot">
        <span className="travel-stat">
          Travel log: 24 states and 11 countries
        </span>
        <button
          type="button"
          className="travel-cta"
          onClick={() => window.dispatchEvent(new Event('jt:travel'))}
        >
          some favorite travel destinations ↗
        </button>
      </div>
    </section>
  );
}

export default Travel;
