import { motion } from 'framer-motion';
import { stackLines } from '../data';

const marqueeText = stackLines.join(' · ');

function Stack() {
  return (
    <section id="stack" className="section" aria-label="Stack">
      <div className="section-head">
        <span className="section-num">03</span>
        <h2>Stack</h2>
      </div>
      {stackLines.map((line, i) => (
        <motion.p
          className="stack-line"
          key={line}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
        >
          {line}
        </motion.p>
      ))}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>{marqueeText} · </span>
          <span>{marqueeText} · </span>
        </div>
      </div>
    </section>
  );
}

export default Stack;
