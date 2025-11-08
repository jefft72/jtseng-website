import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from './ProjectCard';

const ProjectOverlay: React.FC<{ project: Project | null; onClose: () => void }> = ({ project, onClose }) => {
  return (
    <AnimatePresence mode="wait">
      {project && (
        <motion.div
          key={project.title}
          className="project-overlay-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="project-overlay"
            initial={{ scale: 0.2, rotateY: 90, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ scale: 0.95, rotateY: -45, opacity: 0 }}
            transition={{ 
              scale: { type: 'spring', stiffness: 200, damping: 22 },
              rotateY: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.4 }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="btn btn-outline project-overlay-close" onClick={onClose}>Close</button>

            <div className="w-full h-full overflow-hidden rounded-lg">
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.image} alt={`${project.title} large`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-800" />
              )}
            </div>

            <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-gray-300 mb-3">{project.long || project.short}</p>
              {project.tech && (
                <p className="text-gray-400 mb-4">Tech: {project.tech.join(' • ')}</p>
              )}

              <div className="mt-auto flex gap-2">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">View</a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Repo</a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectOverlay;
