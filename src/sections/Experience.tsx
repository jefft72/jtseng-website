import { motion } from 'framer-motion';
import SectionHead from '../components/SectionHead';
import { experience } from '../data';

function Experience() {
  return (
    <section id="experience" className="section" aria-label="Experience">
      <SectionHead num="01" title="Experience" />
      {experience.map((item, i) => (
        <motion.div
          className="index-row"
          key={`${item.role}-${item.org}`}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, delay: i * 0.05 }}
        >
          <span className="row-num">{item.n}</span>
          <div className="row-body">
            <h3>{item.role}</h3>
            <p className="row-org">{item.org}</p>
            <p className="row-signal">{item.signal}</p>
          </div>
          <span className="row-period">{item.period}</span>
        </motion.div>
      ))}
    </section>
  );
}

export default Experience;
