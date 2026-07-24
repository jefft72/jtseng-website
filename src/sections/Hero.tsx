import { motion } from 'framer-motion';
import VariableProximity from '../components/VariableProximity';
import { links } from '../data';

const ease = [0.16, 1, 0.3, 1] as const;

function Hero() {
  return (
    <header className="hero hero--work" id="top">
      <div className="hero-row">
        <div className="hero-left">
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
          <motion.p
            className="hero-statement"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease }}
          >
            I find lots of AI/ML stuff to be the most interesting, but I also
            love working on frontends
          </motion.p>
        </div>
        <motion.figure
          className="hero-photo"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease }}
        >
          <div className="hero-photo-frame">
            <img src="/sahara.jpg" alt="Jeffrey in the Sahara at sunset" />
          </div>
          <figcaption>
            This was taken when I went camping in the Sahara, in the Merzouga sand dunes.
          </figcaption>
        </motion.figure>
      </div>
      <div className="credit-line">
        <span>Purdue CS - San Francisco</span>
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
