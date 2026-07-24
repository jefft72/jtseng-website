import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionHead from '../components/SectionHead';

const scenes = [
  {
    command: ':Telescope find_files',
    codex: 'Reading src/App.tsx',
    test: 'collecting tests...',
  },
  {
    command: ':vsplit src/data.ts',
    codex: 'Reviewing current diff',
    test: '✓ typescript',
  },
  {
    command: ':lua vim.lsp.buf.format()',
    codex: 'Updating implementation',
    test: '✓ eslint',
  },
  {
    command: ':w',
    codex: 'Running verification',
    test: '✓ 18 tests passed',
  },
] as const;

function TerminalSetup() {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(
      () => setScene((current) => (current + 1) % scenes.length),
      2200,
    );
    return () => window.clearInterval(timer);
  }, []);

  const current = scenes[scene];

  return (
    <section id="terminal" className="section" aria-label="Terminal setup">
      <SectionHead num="03" title="Terminal setup" />
      <div className="terminal-meta">
        <p>
          <span>Current terminal theme</span>
          <strong>Cornflower Glass</strong>
        </p>
        <p>
          <span>Current terminal config</span>
          <strong>WezTerm + tmux + Neovim</strong>
        </p>
      </div>
      <motion.div
        className="terminal-demo"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="terminal-window"
          role="img"
          aria-label="Looping mock recording of the Cornflower Glass WezTerm, tmux, and Neovim setup with one large editor pane and two smaller right panes"
        >
          <div className="terminal-titlebar" aria-hidden="true">
            <div className="terminal-dots">
              <span />
              <span />
              <span />
            </div>
            <span>main:1.1 nvim</span>
            <span className="terminal-recording">
              <i />
              live mock
            </span>
          </div>
          <div className="terminal-panes" aria-hidden="true">
            <div className="terminal-pane terminal-pane--nvim">
              <div className="nvim-tabs">
                <span className="is-active">App.tsx</span>
                <span>data.ts</span>
              </div>
              <div className="nvim-code">
                <div>
                  <b>1</b>
                  <code><em>import</em> {'{ motion }'} <em>from</em> <q>'framer-motion'</q>;</code>
                </div>
                <div>
                  <b>2</b>
                  <code><em>import</em> Hero <em>from</em> <q>'./sections/Hero'</q>;</code>
                </div>
                <div><b>3</b><code /></div>
                <div><b>4</b><code><em>function</em> <mark>App</mark>() {'{'}</code></div>
                <div className={scene === 2 ? 'is-current' : ''}>
                  <b>5</b>
                  <code>  <em>return</em> (</code>
                </div>
                <div className={scene === 1 ? 'is-current' : ''}>
                  <b>6</b>
                  <code>    &lt;<mark>main</mark>&gt;</code>
                </div>
                <div><b>7</b><code>      &lt;<mark>Hero</mark> /&gt;</code></div>
                <div><b>8</b><code>      &lt;<mark>Experience</mark> /&gt;</code></div>
                <div><b>9</b><code>      &lt;<mark>Projects</mark> /&gt;</code></div>
                <div><b>10</b><code>    &lt;/<mark>main</mark>&gt;</code></div>
                <div><b>11</b><code>  );</code></div>
                <div><b>12</b><code>{'}'}</code></div>
              </div>
              <div className={`telescope${scene === 0 ? ' is-visible' : ''}`}>
                <strong>Find Files</strong>
                <span>src/App.tsx</span>
                <span>src/data.ts</span>
                <span>src/sections/Hero.tsx</span>
              </div>
              <div className="nvim-command">
                <span>{current.command}</span>
                <i />
              </div>
              <div className="nvim-status">
                <strong>NORMAL</strong>
                <span>main</span>
                <span>src/App.tsx</span>
                <span className="nvim-status-end">tsx&nbsp; utf-8&nbsp; 6:5</span>
              </div>
            </div>
            <div className="terminal-pane terminal-pane--codex">
              <div className="terminal-pane-label">codex</div>
              <div className="codex-mark">›_</div>
              <p>Working in jtseng-website</p>
              <p className="terminal-output">{current.codex}<i /></p>
              <div className="terminal-activity" />
            </div>
            <div className="terminal-pane terminal-pane--tests">
              <div className="terminal-pane-label">tests</div>
              <p><span className="term-prompt">~/jtseng-website</span> npm run check</p>
              <p className="terminal-output">{current.test}<i /></p>
              <p className={`test-summary${scene === 3 ? ' is-visible' : ''}`}>
                Test Files&nbsp; 4 passed
              </p>
            </div>
          </div>
          <div className="tmux-status" aria-hidden="true">
            <strong>main</strong>
            <span>1:nvim*</span>
            <span className="tmux-status-end">jtseng-website&nbsp;&nbsp; 14:32</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default TerminalSetup;
