import { useState } from 'react';
import DitherField from '../components/DitherField';
import { experience, links, projects, stackLines } from '../data';
import './PersonalLanding.css';

export default function PersonalLanding() {
  const [projectIndex, setProjectIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<number | null>(null);
  const [hoveredTool, setHoveredTool] = useState<number | null>(null);
  const activeProject = projects[projectIndex];
  const highlightedTool = hoveredTool ?? selectedTool;
  const tool = highlightedTool === null ? null : activeProject.tools[highlightedTool];

  const selectProject = (index: number) => {
    if (index === projectIndex) return;
    setProjectIndex(index);
    setSelectedTool(null);
    setHoveredTool(null);
  };

  return (
    <div className="personal-home" id="top">
      <a className="personal-skip" href="#about">Skip to content</a>
      <main className="personal-page">
        <header className="personal-header">
          <a href="#top" className="personal-signature" aria-label="Jeffrey Tseng, back to top"><span className="personal-bar" aria-hidden="true" /></a>
          <nav aria-label="Page contents"><a href="#about">about</a><a href="#experience">work</a><a href="#/after-hours">after hours <span aria-hidden="true">↗</span></a></nav>
        </header>

        <section className="personal-intro" id="about" aria-labelledby="personal-name" tabIndex={-1}>
          <h1 id="personal-name">jeffrey tseng<span>.</span></h1>
          <p className="personal-hello">cs at purdue</p>
          <p className="personal-now">Right now, I’m building infrastructure at <a href="#experience">Judi Health</a> and working on aircraft trajectory research with <a href="#experience">Purdue Data Mine / RTX</a>.</p>
          <nav className="personal-contact" aria-label="Contact and social links">
            <a href={`mailto:${links.email}`}>email <span aria-hidden="true">↗</span></a>
            <a href={links.github} target="_blank" rel="noreferrer">github <span aria-hidden="true">↗</span></a>
            <a href={links.linkedin} target="_blank" rel="noreferrer">linkedin <span aria-hidden="true">↗</span></a>
          </nav>
        </section>

        <aside className="personal-art" id="project-explorer" aria-label="Interactive project explorer">
          <div className="personal-art-stage">
            <DitherField projectIndex={projectIndex} toolCount={activeProject.tools.length} highlightedTool={highlightedTool} />
            <span className="personal-art-gesture" aria-hidden="true">drag to explore</span>
          </div>
          <div className="personal-explorer-panel">
            <nav className="personal-project-picker" aria-label="Choose a project">
              {projects.map((project, index) => (
                <button type="button" key={project.name} aria-pressed={projectIndex === index} aria-controls="personal-project-preview" onClick={() => selectProject(index)}>
                  <span className="personal-picker-index" aria-hidden="true">0{index + 1}</span>{project.name}
                </button>
              ))}
            </nav>
            <div className="personal-project-preview" id="personal-project-preview">
              <div className="personal-preview-heading">
                <h2>{activeProject.name}</h2>
                <a href={`#project-${activeProject.name.toLowerCase()}`} onClick={(event) => {
                  const notes = document.getElementById(event.currentTarget.hash.slice(1));
                  if (notes instanceof HTMLDetailsElement) notes.open = true;
                }}>project notes <span aria-hidden="true">↗</span></a>
              </div>
              <p className="personal-preview-blurb">{activeProject.blurb}</p>
              <div className="personal-tool-picker" role="group" aria-label={`Explore tools used in ${activeProject.name}`} onPointerLeave={() => setHoveredTool(null)}>
                <button type="button" aria-pressed={selectedTool === null} onClick={() => { setSelectedTool(null); setHoveredTool(null); }}>all</button>
                {activeProject.tools.map((item, index) => (
                  <button type="button" key={item.name} aria-pressed={selectedTool === index} onClick={() => setSelectedTool(index)} onPointerEnter={(event) => { if (event.pointerType !== 'touch') setHoveredTool(index); }} onPointerLeave={() => setHoveredTool(null)}>
                    <span className="personal-tool-dot" aria-hidden="true" />{item.name}
                  </button>
                ))}
              </div>
              <p className="personal-tool-description" aria-live="polite" aria-atomic="true">{tool ? <><span>{tool.name}</span> {tool.role}</> : activeProject.metric}</p>
            </div>
          </div>
        </aside>

        <section className="personal-experience" id="experience" aria-labelledby="personal-experience-title">
          <div className="personal-section-title"><h2 id="personal-experience-title">experience</h2><span>where I’ve been building</span></div>
          <div className="personal-positions">
            {experience.map((item) => (
              <details className="personal-position" key={item.n}>
                <summary>
                  <span className="personal-position-heading"><span className="personal-position-org">{item.org}</span><span className="personal-role">{item.role}</span></span>
                  <span className="personal-position-period">{item.period.toLowerCase()}</span>
                  <span className="personal-unfold" aria-hidden="true" />
                </summary>
                <div className="personal-position-body">
                  <p>{item.signal}</p>
                  {item.details && <ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="personal-work" id="projects" aria-labelledby="personal-work-title">
          <div className="personal-section-title"><h2 id="personal-work-title">selected projects</h2><span>an ongoing collection</span></div>
          <div className="personal-projects">
            {projects.map((project, index) => (
              <details className={`personal-project${projectIndex === index ? ' is-selected' : ''}`} id={`project-${project.name.toLowerCase()}`} key={project.name} onToggle={(event) => { if (event.currentTarget.open) selectProject(index); }}>
                <summary>
                  <span className="personal-project-name">{project.name}</span>
                  <span className="personal-project-description">{project.blurb}</span>
                  <span className="personal-unfold" aria-hidden="true" />
                </summary>
                <div className="personal-project-body">
                  <p>{project.summary}</p>
                  <p className="personal-project-result">{project.metric}</p>
                  <p className="personal-small">{project.stack.toLowerCase()}</p>
                  {project.href && <a href={project.href} target="_blank" rel="noreferrer">visit {project.name.toLowerCase()} <span aria-hidden="true">↗</span></a>}
                </div>
              </details>
            ))}
          </div>
        </section>

        <div className="personal-background">
          <details className="personal-tools" id="stack">
            <summary><span>things I work with</span><span className="personal-plus" aria-hidden="true" /></summary>
            <ul>{stackLines.map((line) => <li key={line}>{line}</li>)}</ul>
          </details>
        </div>

        <footer className="personal-footer">
          <a href="#/after-hours">a life outside the editor <span aria-hidden="true">↗</span></a>
          <button type="button" onClick={() => window.dispatchEvent(new Event('jt:keymap'))} aria-label="Show keyboard shortcuts"><span aria-hidden="true">[?]</span><span className="personal-keyboard-label">keyboard person?</span></button>
        </footer>
      </main>
    </div>
  );
}
