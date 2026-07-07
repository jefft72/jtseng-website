import { motion } from 'framer-motion';
import Globe from '../components/Globe';
import SectionHead from '../components/SectionHead';

function Travel() {
  return (
    <section id="travel" className="section" aria-label="Travel log">
      <SectionHead num="05" title="Travel log" />
      <motion.div
        className="travel"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Globe />
      </motion.div>
    </section>
  );
}

export default Travel;
