import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SectionHead from '../components/SectionHead';
import { projects } from '../data';

function Projects() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section
      id="projects"
      className="section section--invert"
      aria-label="Projects"
    >
      <SectionHead num="02" title="Projects" />
      {projects.map((project, i) => {
        const isOpen = open === project.n;
        return (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
          >
            <button
              type="button"
              className={`index-row index-row--button${isOpen ? ' is-open' : ''}`}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : project.n)}
            >
              <span className="row-num">{project.n}</span>
              <div className="row-body">
                <h3>{project.name}</h3>
                <p className="row-org">{project.type}</p>
              </div>
              <span className="row-period">{project.year}</span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className="index-row__expand"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="expand-inner">
                    <p className="expand-summary">{project.summary}</p>
                    <p className="expand-stack">{project.stack}</p>
                    <strong className="metric">{project.metric}</strong>
                    {project.href && (
                      <a
                        className="expand-link"
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit <ArrowUpRight size={16} />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </section>
  );
}

export default Projects;
