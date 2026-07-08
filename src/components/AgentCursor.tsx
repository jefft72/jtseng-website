import { useEffect, useRef, useState } from 'react';
import { places } from '../data';

const VERBS = ['inspect', 'parse', 'trace', 'index'];

const IDLE_FLAVOR = [
  'compacting context',
  'warming cache',
  'refilling context window',
  'polling for updates',
];

type Step = { text: string; ms: number };

function buildSteps(el: HTMLElement): Step[] {
  const title = el
    .querySelector('h3, h2')
    ?.textContent?.trim()
    .toLowerCase()
    .slice(0, 34);
  const org = el
    .querySelector('.row-org')
    ?.textContent?.trim()
    .toLowerCase()
    .slice(0, 34);
  const period = el.querySelector('.row-period')?.textContent?.trim();
  const verb = VERBS[Math.floor(Math.random() * VERBS.length)];

  if (el.classList.contains('globe')) {
    return [
      { text: 'open travel.db', ms: 900 },
      { text: 'SELECT * FROM places', ms: 1100 },
      { text: `${places.length} rows ✓`, ms: 900 },
    ];
  }
  if (el.classList.contains('contact')) {
    return [
      { text: 'found mailto route', ms: 900 },
      { text: `resolve: ${el.textContent?.trim().toLowerCase()}`, ms: 1100 },
      { text: 'contact ✓', ms: 700 },
    ];
  }
  if (el.classList.contains('section-head')) {
    return [
      { text: `scan /${title?.replace(/\s+/g, '-')}`, ms: 1000 },
      { text: 'ok ✓', ms: 600 },
    ];
  }
  const steps: Step[] = [{ text: `${verb} ▸ ${title}`, ms: 1100 }];
  if (org) steps.push({ text: `└ ${org}`, ms: 1000 });
  if (period && Math.random() > 0.4)
    steps.push({ text: `└ ${period.toLowerCase()}`, ms: 900 });
  steps.push({ text: 'indexed ✓', ms: 650 });
  return steps;
}

function pickTarget(current: HTMLElement | null): HTMLElement | null {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>(
      '.index-row, .section-head, .contact',
    ),
  ).filter((el) => {
    if (el === current) return false;
    const rect = el.getBoundingClientRect();
    return rect.top > 90 && rect.bottom < window.innerHeight - 30;
  });
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// agent-01: locks onto real elements, follows them through scroll, and
// narrates a multi-step trace of what it is inspecting.
function AgentCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState('boot');

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (!fine || reduced || window.innerWidth <= 720) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let target: HTMLElement | null = null;
    let arrived = false;
    const pos = {
      x: window.innerWidth * 0.72,
      y: window.innerHeight * 0.5,
    };
    const anchor = { ...pos };

    const later = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    const releaseTarget = () => {
      target?.classList.remove('agent-scan');
      target = null;
      arrived = false;
    };

    const nextTarget = (delay: number) => {
      later(() => {
        const el = pickTarget(target);
        releaseTarget();
        if (!el || Math.random() < 0.12) {
          setStatus(
            `idle · ${IDLE_FLAVOR[Math.floor(Math.random() * IDLE_FLAVOR.length)]}`,
          );
          anchor.x = window.innerWidth * (0.55 + Math.random() * 0.3);
          anchor.y = window.innerHeight * (0.25 + Math.random() * 0.5);
          nextTarget(1800);
          return;
        }
        target = el;
        arrived = false;
        setStatus('moving');
      }, delay);
    };

    const runSteps = (el: HTMLElement) => {
      el.classList.add('agent-scan');
      const steps = buildSteps(el);
      let acc = 0;
      steps.forEach((step) => {
        later(() => {
          if (target === el) setStatus(step.text);
        }, acc);
        acc += step.ms;
      });
      nextTarget(acc + 300);
    };

    const tick = () => {
      if (target) {
        const rect = target.getBoundingClientRect();
        if (rect.bottom < 70 || rect.top > window.innerHeight - 20) {
          // element scrolled away — drop the lock and re-plan
          releaseTarget();
          setStatus('re-acquiring…');
          nextTarget(600);
        } else {
          anchor.x = rect.left + Math.min(rect.width * 0.32, 380);
          anchor.y = rect.top + rect.height * 0.42;
          const distance = Math.hypot(anchor.x - pos.x, anchor.y - pos.y);
          if (!arrived && distance < 26) {
            arrived = true;
            runSteps(target);
          }
        }
      }
      pos.x += (anchor.x - pos.x) * 0.075;
      pos.y += (anchor.y - pos.y) * 0.075;
      root.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onTravel = () => {
      const globeEl = document.querySelector<HTMLElement>('canvas.globe');
      if (!globeEl) return;
      releaseTarget();
      target = globeEl;
      arrived = false;
      setStatus('routing to /travel');
    };

    setStatus('boot · scanning page');
    nextTarget(2000);
    raf = requestAnimationFrame(tick);
    window.addEventListener('jt:travel', onTravel);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      releaseTarget();
      window.removeEventListener('jt:travel', onTravel);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="agent-cursor" ref={rootRef} aria-hidden="true">
      <svg width="13" height="13" viewBox="0 0 13 13">
        <path d="M1 1 L12 6 L6.5 7.5 L4 12.5 Z" fill="var(--accent)" />
      </svg>
      <span className="agent-chip">agent-01 · {status}</span>
    </div>
  );
}

export default AgentCursor;
