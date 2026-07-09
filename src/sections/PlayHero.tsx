import { motion } from 'framer-motion';
import VariableProximity from '../components/VariableProximity';

const ease = [0.16, 1, 0.3, 1] as const;

function PlayHero() {
  return (
    <header className="hero" id="top">
      <h1 aria-label="After hours">
        {['After', 'Hours'].map((word, i) => (
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
      <motion.p
        className="hero-statement"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease }}
      >
        The parts that don't fit on a resume — what I'm reading and where
        I've been.
      </motion.p>
      <div className="credit-line">
        <span>Off the clock — still curious</span>
        <div className="credit-links">
          <button
            type="button"
            className="credit-switch"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent('jt:nav', { detail: { surface: 'work' } }),
              )
            }
          >
            ← Back to work
          </button>
        </div>
      </div>
    </header>
  );
}

export default PlayHero;
