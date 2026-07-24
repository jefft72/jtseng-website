import { motion } from 'framer-motion';
import VariableProximity from '../components/VariableProximity';

const ease = [0.16, 1, 0.3, 1] as const;

function PlayHero() {
  const navWork = () =>
    window.dispatchEvent(
      new CustomEvent('jt:nav', { detail: { surface: 'work' } }),
    );

  return (
    <header className="hero hero--play" id="top">
      <div className="hero-row">
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
        <motion.div
          className="play-hero-aside"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease }}
        >
          <p>some stuff i like outside of work</p>
          <button type="button" className="credit-switch" onClick={navWork}>
            ← Back to work
          </button>
        </motion.div>
      </div>
    </header>
  );
}

export default PlayHero;
