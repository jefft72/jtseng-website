import { motion } from 'framer-motion';
import HalftonePortrait from '../components/HalftonePortrait';
import VariableProximity from '../components/VariableProximity';
import { links } from '../data';

const ease = [0.16, 1, 0.3, 1] as const;

function Hero() {
  return (
    <header className="hero" id="top">
      <h1 aria-label="Jeffrey Tseng">
        {['Jeffrey', 'Tseng'].map((word, i) => (
          <span className="hero-mask" key={word}>
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.09, ease }}
            >
              <VariableProximity text={word} />
            </motion.span>
          </span>
        ))}
      </h1>
      <motion.div
        className="portrait-slot"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease }}
      >
        <HalftonePortrait />
      </motion.div>
      <motion.p
        className="hero-statement"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease }}
      >
        AI engineer building multi-agent systems and the infrastructure that
        lets them improve themselves.
      </motion.p>
      <div className="credit-line">
        <span>Purdue CS + Math — San Francisco</span>
        <div className="credit-links">
          <a href={`mailto:${links.email}`}>Email</a>
          <a href={links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </header>
  );
}

export default Hero;
