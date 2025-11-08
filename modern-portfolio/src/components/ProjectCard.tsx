import React from 'react';

export type Project = {
  title: string;
  short: string;
  long?: string;
  tech?: string[];
  repoUrl?: string;
  liveUrl?: string;
  image?: string; // optional thumbnail
  fit?: 'cover' | 'contain';
  position?: string; // e.g., 'center', 'left', '50% 30%'
  scale?: number; // optional scale factor for thumbnail
};

const ProjectCard: React.FC<{ project: Project; onOpen?: () => void }> = ({ project, onOpen }) => {
  return (
    <div
      className="project-card project-card-wrapper cursor-pointer"
      onMouseEnter={() => onOpen && onOpen()}
      onClick={() => onOpen && onOpen()}
      role="button"
      tabIndex={0}
    >
      <div className="panel overflow-hidden p-0 thumb-wrapper w-full h-full">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={`${project.title} thumbnail`}
            className="thumb-img"
            style={{
              objectFit: project.fit || 'cover',
              objectPosition: project.position || 'center',
              transform: project.scale ? `scale(${project.scale})` : undefined,
              transformOrigin: 'center center'
            }}
          />
        ) : (
          <div className="w-full h-full bg-slate-800" />
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
