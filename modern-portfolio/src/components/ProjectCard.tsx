import React, { useState } from 'react';

type Project = {
  title: string;
  short: string;
  long?: string;
  tech?: string[];
  repoUrl?: string;
  liveUrl?: string;
  image?: string; // optional thumbnail
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [flipped, setFlipped] = useState(false);

  const onToggle = () => setFlipped((s) => !s);

  return (
    <div
      className={`project-card project-card-wrapper`}
      onClick={onToggle}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
    >
      <div className={`project-card-inner ${flipped ? 'is-flipped' : ''}`}>
        <div className="project-card-front panel p-4 flex flex-col">
          {project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.image} alt={`${project.title} thumbnail`} className="w-full h-36 object-cover rounded-md mb-4" />
          ) : (
            <div className="w-full h-36 bg-slate-800 rounded-md mb-4" />
          )}

          <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
          <p className="text-gray-300 text-sm flex-grow">{project.short}</p>
        </div>

        <div className="project-card-back panel p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
            <p className="text-gray-300 text-sm mb-3">{project.long || project.short}</p>
            {project.tech && (
              <p className="text-gray-400 text-sm">Tech: {project.tech.join(' • ')}</p>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                View
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Repo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
