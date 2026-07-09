import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { links } from '../data';

type Action = {
  label: string;
  hint: string;
  run: () => void;
};

const nav = (surface: 'work' | 'play', selector?: string, travel?: boolean) =>
  window.dispatchEvent(
    new CustomEvent('jt:nav', { detail: { surface, selector, travel } }),
  );

const actions: Action[] = [
  { label: 'Go to experience', hint: '01', run: () => nav('work', '#experience') },
  { label: 'Go to projects', hint: '02', run: () => nav('work', '#projects') },
  { label: 'Go to stack', hint: '03', run: () => nav('work', '#stack') },
  { label: 'Go to contact', hint: '04', run: () => nav('work', '#contact') },
  { label: 'After hours', hint: '→', run: () => nav('play') },
  { label: 'Go to reading', hint: 'AH', run: () => nav('play', '#reading') },
  { label: 'Go to travel log', hint: 'AH', run: () => nav('play', '#travel') },
  { label: 'Back to work', hint: '←', run: () => nav('work') },
  {
    label: 'See where Jeff traveled',
    hint: '◉',
    run: () => nav('play', '#travel', true),
  },
  {
    label: 'Let it snow',
    hint: '❄',
    run: () => window.dispatchEvent(new Event('jt:snow')),
  },
  {
    label: 'Show keymap',
    hint: '?',
    run: () => window.dispatchEvent(new Event('jt:keymap')),
  },
  {
    label: 'Open resume',
    hint: 'PDF',
    run: () => window.open(links.resume, '_blank'),
  },
  {
    label: 'Open GitHub',
    hint: '↗',
    run: () => window.open(links.github, '_blank'),
  },
  {
    label: 'Open LinkedIn',
    hint: '↗',
    run: () => window.open(links.linkedin, '_blank'),
  },
  {
    label: 'Email me',
    hint: '@',
    run: () => {
      window.location.href = `mailto:${links.email}`;
    },
  },
];

function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = actions.filter((action) =>
    action.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((v) => !v);
        setQuery('');
        setSelected(0);
      } else if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    const onOpenEvent = () => {
      setOpen(true);
      setQuery('');
      setSelected(0);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('jt:palette', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('jt:palette', onOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const runAction = (action: Action) => {
    setOpen(false);
    action.run();
  };

  const onInputKey = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelected((s) => Math.min(s + 1, matches.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (event.key === 'Enter' && matches[selected]) {
      runAction(matches[selected]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="palette-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="palette"
            role="dialog"
            aria-label="Command palette"
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <input
              ref={inputRef}
              value={query}
              placeholder="Type a command…"
              spellCheck={false}
              aria-label="Search commands"
              onChange={(event) => {
                setQuery(event.target.value);
                setSelected(0);
              }}
              onKeyDown={onInputKey}
            />
            <ul>
              {matches.map((action, i) => (
                <li key={action.label}>
                  <button
                    type="button"
                    className={i === selected ? 'is-selected' : ''}
                    onMouseEnter={() => setSelected(i)}
                    onClick={() => runAction(action)}
                  >
                    <span>{action.label}</span>
                    <span className="palette-hint">{action.hint}</span>
                  </button>
                </li>
              ))}
              {matches.length === 0 && (
                <li className="palette-empty">No matching command</li>
              )}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;
