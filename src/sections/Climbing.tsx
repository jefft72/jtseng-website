import { motion } from 'framer-motion';
import SectionHead from '../components/SectionHead';

function Climbing() {
  return (
    <section id="climbing" className="section" aria-label="Rock climbing">
      <SectionHead num="04" title="Climbing" />
      <motion.div
        className="climbing"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <figure className="climbing-photo">
          <picture>
            <source srcSet="/climbingPic.webp" type="image/webp" />
            <img
              src="/climbingPic.jpg"
              alt="Indoor bouldering wall covered with colorful climbing holds"
              width="1301"
              height="1800"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </figure>
        <div className="climbing-copy">
          <p>
            I got really into climbing this summer, and I currently climb V4.
            I've been projecting a V5 though so V5 coming soon!!
          </p>
        </div>
      </motion.div>
    </section>
  );
}

export default Climbing;
