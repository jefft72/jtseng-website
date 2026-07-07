import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type AgentPose = {
  x: number;
  y: number;
  status: string;
  travelMs: number;
};

const DWELL_MIN = 1800;
const DWELL_MAX = 3600;

function pickTarget() {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>('.index-row, .section-head, .contact'),
  );
  const visible = candidates
    .map((el) => ({ el, rect: el.getBoundingClientRect() }))
    .filter(
      ({ rect }) => rect.top > 90 && rect.bottom < window.innerHeight - 40,
    );
  if (visible.length === 0) return null;
  const { el, rect } = visible[Math.floor(Math.random() * visible.length)];
  const label =
    el.querySelector('h3, h2')?.textContent?.trim().toLowerCase() ?? 'section';
  return {
    x: rect.left + rect.width * (0.2 + Math.random() * 0.45),
    y: rect.top + rect.height * (0.3 + Math.random() * 0.4),
    label,
  };
}

// A second cursor browsing the page on its own — the multi-agent pitch, made visible.
function AgentCursor() {
  const [enabled, setEnabled] = useState(false);
  const [pose, setPose] = useState<AgentPose>({
    x: window.innerWidth * 0.7,
    y: window.innerHeight * 0.55,
    status: 'idle',
    travelMs: 1400,
  });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const wide = window.innerWidth > 720;
    if (!fine || reduced || !wide) return;
    setEnabled(true);

    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      const target = pickTarget();
      if (!target) {
        setPose((p) => ({ ...p, status: 'idle' }));
        timer = setTimeout(step, 1600);
        return;
      }
      const travelMs = 1100 + Math.random() * 900;
      setPose({ x: target.x, y: target.y, status: 'moving', travelMs });
      timer = setTimeout(() => {
        if (cancelled) return;
        setPose((p) => ({ ...p, status: `reading ${target.label}` }));
        timer = setTimeout(
          step,
          DWELL_MIN + Math.random() * (DWELL_MAX - DWELL_MIN),
        );
      }, travelMs);
    };

    timer = setTimeout(step, 2200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  if (!enabled) return null;

  return (
    <motion.div
      className="agent-cursor"
      aria-hidden="true"
      animate={{ x: pose.x, y: pose.y }}
      transition={{ duration: pose.travelMs / 1000, ease: [0.3, 0.9, 0.3, 1] }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13">
        <path d="M1 1 L12 6 L6.5 7.5 L4 12.5 Z" fill="var(--accent)" />
      </svg>
      <span className="agent-chip">agent-01 · {pose.status}</span>
    </motion.div>
  );
}

export default AgentCursor;
