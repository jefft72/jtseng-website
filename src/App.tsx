import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import AtmosphereCanvas from './components/AtmosphereCanvas';
import profileImage from '../DSC08402.JPEG';
import resumePdf from '../modern-portfolio/public/JeffreyTsengResume.pdf?url';

type Mode = 'all' | 'ai' | 'frontend' | 'mobile' | 'leadership';
type FieldMode = Mode;

type LogEntry = {
  title: string;
  context: string;
  period: string;
  signal: string;
  tags: Mode[];
};

type Project = {
  name: string;
  type: string;
  summary: string;
  stack: string;
  metric: string;
  tags: Mode[];
  href?: string;
};

const modes: Array<{ id: Mode; command: string; label: string }> = [
  { id: 'all', command: 'all', label: 'Everything' },
  { id: 'ai', command: 'ai', label: 'AI systems' },
  { id: 'frontend', command: 'interfaces', label: 'Interfaces' },
  { id: 'mobile', command: 'mobile', label: 'Mobile' },
  { id: 'leadership', command: 'leadership', label: 'Leadership' },
];

const logEntries: LogEntry[] = [
  {
    title: 'Software Engineer',
    context: 'Crcle.ai',
    period: 'Oct 2025 - Present',
    signal:
      'Designed RAG workflows, built browser integrations for instant context retrieval, and shipped React Native interfaces across iOS and Android.',
    tags: ['ai', 'mobile', 'frontend'],
  },
  {
    title: 'Technical Teaching Assistant',
    context: 'Google Developer Groups, Purdue',
    period: 'Aug 2025 - Present',
    signal:
      'Built take-home projects for 300+ students across React, Google Cloud, Vertex AI, TensorFlow, Flutter, Firebase, and full-stack patterns.',
    tags: ['ai', 'frontend', 'leadership'],
  },
  {
    title: 'Team Lead',
    context: 'Hack the Future, Purdue',
    period: 'Oct 2025 - Present',
    signal:
      'Led 10+ engineers building nonprofit applications with React, Node.js, FastAPI, MongoDB, code review, Git workflow, and client delivery.',
    tags: ['frontend', 'leadership'],
  },
  {
    title: 'B.S. Computer Science + Mathematics',
    context: 'Purdue University',
    period: 'Expected May 2028',
    signal:
      'Relevant work: Web App Programming, Programming in C, Object Oriented Programming, Discrete Math, and Linear Algebra.',
    tags: ['all'],
  },
];

const projects: Project[] = [
  {
    name: 'UPlate',
    type: 'AI meal planner',
    summary:
      'Gemini-powered meal planning for Purdue dining halls with custom Flutter onboarding, offline SQLite persistence, and Firestore sync.',
    stack: 'Flutter / Firebase / Gemini / SQLite',
    metric: '150+ active users',
    tags: ['ai', 'mobile'],
    href: 'https://jefft72.github.io/UPlate/',
  },
  {
    name: 'jtseng.org',
    type: 'Personal website',
    summary:
      'Responsive portfolio built with React and TypeScript around sharp typography, readable project structure, and lightweight motion.',
    stack: 'React / TypeScript / Node',
    metric: 'live production surface',
    tags: ['frontend'],
  },
  {
    name: 'Crcle.ai workflows',
    type: 'AI workflows',
    summary:
      'Browser and mobile surfaces that bridge user workflows with AI backends for contextual overlays and retrieval-augmented responses.',
    stack: 'RAG / React Native / LLMs',
    metric: 'co-op through Apr 2026',
    tags: ['ai', 'mobile', 'frontend'],
  },
];

const skillBands = [
  ['React', 'TypeScript', 'JavaScript', 'Tailwind', 'Framer'],
  ['Python', 'Java', 'Flutter', 'React Native', 'Node'],
  ['RAG', 'LLMs', 'Hugging Face', 'Firebase', 'MongoDB'],
  ['NumPy', 'SciPy', 'Matlab', 'Gazebo', 'ROS'],
];

const modeCopy: Record<Mode, string> = {
  all: 'Engineering, teaching, mobile, and AI work in one view.',
  ai: 'RAG workflows, LLM context, Vertex AI, Gemini, and agent-facing product work.',
  frontend: 'React, TypeScript, Framer, and responsive product surfaces.',
  mobile: 'React Native and Flutter interfaces built with production UI constraints.',
  leadership: 'Teaching, mentorship, team delivery, code review, and client translation.',
};

const commandToMode = (command: string): Mode => {
  const normalized = command.trim().toLowerCase();
  if (normalized.includes('ai') || normalized.includes('rag') || normalized.includes('llm')) return 'ai';
  if (normalized.includes('ui') || normalized.includes('front') || normalized.includes('react')) return 'frontend';
  if (normalized.includes('mobile') || normalized.includes('native') || normalized.includes('flutter')) return 'mobile';
  if (normalized.includes('lead') || normalized.includes('teach') || normalized.includes('mentor')) return 'leadership';
  return 'all';
};

function App() {
  const [mode, setMode] = useState<Mode>('all');
  const [command, setCommand] = useState('all');
  const [booted, setBooted] = useState(false);
  const [hoverField, setHoverField] = useState<FieldMode | null>(null);

  const activeEntries = useMemo(
    () => logEntries.filter((entry) => mode === 'all' || entry.tags.includes(mode) || entry.tags.includes('all')),
    [mode],
  );

  const activeField = hoverField ?? mode;

  const previewField = (tags: Mode[]) => {
    setHoverField(tags.find((tag) => tag !== 'all') ?? 'all');
  };

  const runCommand = (nextCommand: string) => {
    setCommand(nextCommand);
    setMode(commandToMode(nextCommand));
    setBooted(true);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runCommand(command);
  };

  return (
    <div className="command-site" data-field={activeField}>
      <AtmosphereCanvas mode={activeField} />
      <div className="texture" aria-hidden="true" />

      <header className="system-bar" aria-label="Primary">
        <a className="mark" href="#top" aria-label="Jeffrey Tseng home">
          JT
        </a>
        <nav>
          <a href="#log">Log</a>
          <a href="#work">Work</a>
          <a href="#stack">Stack</a>
          <a href={resumePdf} target="_blank" rel="noreferrer">Resume</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-grid" aria-label="Introduction">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="kicker">Full-stack engineer / AI systems / Purdue CS + Math</p>
            <h1>
              Interfaces for agents, humans, and the fragile space between them.
            </h1>
            <div className="hero-meta">
              <span>West Lafayette, IN</span>
              <span>Expected May 2028</span>
              <span>Available for SWE internships</span>
            </div>
          </motion.div>

          <motion.aside
            className="operator-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="operator-id">
              <img src={profileImage} alt="Jeffrey Tseng" />
              <div>
                <p>Engineer</p>
                <strong>Jeffrey Tseng</strong>
              </div>
            </div>
            <p className="operator-summary">
              I build React interfaces, RAG-backed systems, and mobile products with a bias toward clear interaction design.
            </p>
            <div className="operator-links">
              <a href="mailto:tseng94@purdue.edu"><Mail size={16} />Email</a>
              <a href="https://github.com/jefft72" target="_blank" rel="noreferrer"><Github size={16} />GitHub</a>
              <a href="https://linkedin.com/in/j-tseng/" target="_blank" rel="noreferrer"><Linkedin size={16} />LinkedIn</a>
            </div>
          </motion.aside>
        </section>

        <section className="console-section" aria-label="Interactive portfolio index">
          <div className="console-copy">
            <p className="section-code">01 / index</p>
            <h2>A concise index of the work I have shipped.</h2>
          </div>

          <div className="console">
            <div className="console-topline">
              <span>View</span>
              <span>{booted ? 'filtered' : 'all entries'}</span>
            </div>
            <form onSubmit={onSubmit}>
              <span>filter</span>
              <input
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                aria-label="Portfolio filter"
                spellCheck={false}
              />
              <button type="submit">filter</button>
            </form>
            <p className="console-output">{modeCopy[mode]}</p>
            <div className="command-strip" aria-label="Preset commands">
              {modes.map((item) => (
                <button
                  key={item.id}
                  className={mode === item.id ? 'active' : ''}
                  onBlur={() => setHoverField(null)}
                  onFocus={() => setHoverField(item.id)}
                  onMouseEnter={() => setHoverField(item.id)}
                  onMouseLeave={() => setHoverField(null)}
                  onClick={() => runCommand(item.command)}
                >
                  <span>{item.command}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="log" className="log-section">
          <div className="section-rail">
            <p className="section-code">02 / active log</p>
            <p>{activeEntries.length.toString().padStart(2, '0')} matching entries</p>
          </div>
          <div className="log-list">
            {activeEntries.map((entry, index) => (
              <motion.article
                key={`${entry.title}-${entry.context}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                className="log-row"
                onMouseEnter={() => previewField(entry.tags)}
                onMouseLeave={() => setHoverField(null)}
              >
                <span>{entry.period}</span>
                <h3>{entry.title}</h3>
                <p className="context">{entry.context}</p>
                <p>{entry.signal}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="work" className="work-section">
          <div className="section-rail">
            <p className="section-code">03 / shipped systems</p>
            <p>Selected project surfaces</p>
          </div>
          <div className="work-ledger">
            {projects.map((project) => (
              <a
                key={project.name}
                href={project.href ?? '#top'}
                target={project.href ? '_blank' : undefined}
                rel={project.href ? 'noreferrer' : undefined}
                className="work-row"
                onBlur={() => setHoverField(null)}
                onFocus={() => previewField(project.tags)}
                onMouseEnter={() => previewField(project.tags)}
                onMouseLeave={() => setHoverField(null)}
              >
                <span>{project.type}</span>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <em>{project.stack}</em>
                <strong>{project.metric}</strong>
                <ArrowUpRight size={18} />
              </a>
            ))}
          </div>
        </section>

        <section id="stack" className="stack-section">
          <p className="section-code">04 / tools</p>
          <h2>Tools I use when the work asks for them.</h2>
          <div className="stack-bands">
            {skillBands.map((band, index) => (
              <div key={index} className="stack-band">
                <span>{`0${index + 1}`}</span>
                <p>{band.join(' / ')}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer-cta">
        <p>Currently working across AI engineering, React interfaces, mobile systems, and Rust-adjacent backend work.</p>
        <a href="mailto:tseng94@purdue.edu">tseng94@purdue.edu</a>
      </footer>
    </div>
  );
}

export default App;
