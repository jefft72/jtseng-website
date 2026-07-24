import { motion } from 'framer-motion';
import VariableProximity from '../components/VariableProximity';

const ease = [0.16, 1, 0.3, 1] as const;

function PlayHero() {
  const navWork = () =>
    window.dispatchEvent(
      new CustomEvent('jt:nav', { detail: { surface: 'work' } }),
    );

  return (
    <header className="hero" id="top">
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
        <button type="button" className="credit-switch" onClick={navWork}>
          ← Back to work
        </button>
      </div>
    </header>
  );
}

export default PlayHero;
