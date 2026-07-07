import { motion } from 'framer-motion';
import SectionHead from '../components/SectionHead';
import { pursuits } from '../data';

function OffDuty() {
  return (
    <section id="offduty" className="section" aria-label="Off duty">
      <SectionHead num="05" title="Off duty" />
      {pursuits.map((pursuit, i) => (
        <motion.div
          className="index-row"
          key={pursuit.name}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, delay: i * 0.05 }}
        >
          <span className="row-num">{pursuit.n}</span>
          <div className="row-body">
            <h3>{pursuit.name}</h3>
            <p className="row-org">{pursuit.detail}</p>
            <p className="row-signal">{pursuit.signal}</p>
          </div>
          <span className="row-period" />
        </motion.div>
      ))}
    </section>
  );
}

export default OffDuty;
