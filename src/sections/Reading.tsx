import { motion } from 'framer-motion';
import SectionHead from '../components/SectionHead';
import { reading } from '../data';

function Reading() {
  return (
    <section id="reading" className="section" aria-label="Currently reading">
      <SectionHead num="02" title="Reading" />
      <motion.div
        className="reading"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.45 }}
      >
        {reading.cover ? (
          <img className="book-cover" src={reading.cover} alt={`${reading.title} cover`} />
        ) : (
          <div className="book-cover book-cover--type" aria-hidden="true">
            <span>{reading.title}</span>
          </div>
        )}
        <div className="reading-body">
          <p className="row-org">
            Currently reading — started {reading.started}
          </p>
          <h3>{reading.title}</h3>
          <p className="reading-author">{reading.author}</p>
          <p className="reading-thoughts">{reading.thoughts}</p>
        </div>
      </motion.div>
    </section>
  );
}

export default Reading;
