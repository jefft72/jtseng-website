import { motion } from 'framer-motion';
import Globe from '../components/Globe';
import SectionHead from '../components/SectionHead';
import { offDutyLine, places } from '../data';

const fmt = (value: number, pos: string, neg: string) =>
  `${Math.abs(value).toFixed(2)}°${value >= 0 ? pos : neg}`;

function Travel() {
  return (
    <section id="travel" className="section" aria-label="Travel log">
      <SectionHead num="05" title="Travel log" />
      <div className="travel">
        <motion.div
          className="travel-globe"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Globe />
        </motion.div>
        <div className="travel-list">
          {places.map((place, i) => (
            <motion.p
              className="travel-place"
              key={place.name}
              initial={{ opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <span className="travel-coords">
                {fmt(place.lat, 'N', 'S')} {fmt(place.lng, 'E', 'W')}
              </span>
              <strong>{place.name}</strong>
              <em>{place.note}</em>
            </motion.p>
          ))}
          <p className="travel-etc">{offDutyLine}</p>
        </div>
      </div>
    </section>
  );
}

export default Travel;
