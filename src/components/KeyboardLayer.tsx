import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const SECTIONS = [
  '#experience',
  '#projects',
  '#stack',
  '#reading',
  '#travel',
  '#contact',
];

const BINDINGS: Array<[string, string]> = [
  ['j / k', 'scroll down / up'],
  ['d / u', 'half page down / up'],
  ['gg / G', 'jump to top / bottom'],
  ['[ / ]', 'previous / next section'],
  ['1 – 6', 'jump to section n'],
  ['/ or ⌘k', 'command palette'],
  ['?', 'toggle this keymap'],
  [':wq', 'relax — page is read-only'],
];

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

function KeyboardLayer() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
    let lastG = 0;
    let buffer = '';
    let toastTimer: ReturnType<typeof setTimeout>;

    const scrollBy = (px: number) => window.scrollBy({ top: px, behavior });

    const sectionTops = () =>
      SECTIONS.map((sel) => ({
        sel,
        top:
          (document.querySelector(sel) as HTMLElement | null)?.getBoundingClientRect()
            .top ?? Number.POSITIVE_INFINITY,
      }));

    const jumpSection = (dir: 1 | -1) => {
      const tops = sectionTops();
      const next =
        dir === 1
          ? tops.find((s) => s.top > 80)
          : [...tops].reverse().find((s) => s.top < -80);
      document
        .querySelector(next?.sel ?? (dir === 1 ? '#contact' : '#top'))
        ?.scrollIntoView({ behavior });
    };

    const showToast = (text: string) => {
      setToast(text);
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => setToast(null), 2200);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTyping(event.target)) return;

      if (event.key === 'Escape') {
        setHelpOpen(false);
        return;
      }

      if (event.key.length === 1) buffer = (buffer + event.key).slice(-4);
      if (buffer.endsWith(':wq') || buffer.endsWith(':q!')) {
        buffer = '';
        showToast('E45: readonly — nothing to write ✓');
        return;
      }

      switch (event.key) {
        case 'j':
          scrollBy(160);
          break;
        case 'k':
          // don't scroll mid-"ski": the snow easter egg owns that sequence
          if (buffer.endsWith('sk')) break;
          scrollBy(-160);
          break;
        case 'd':
          scrollBy(window.innerHeight / 2);
          break;
        case 'u':
          scrollBy(-window.innerHeight / 2);
          break;
        case 'g':
          if (Date.now() - lastG < 450) {
            window.scrollTo({ top: 0, behavior });
            lastG = 0;
          } else {
            lastG = Date.now();
          }
          break;
        case 'G':
          window.scrollTo({ top: document.body.scrollHeight, behavior });
          break;
        case ']':
          jumpSection(1);
          break;
        case '[':
          jumpSection(-1);
          break;
        case '/':
          event.preventDefault();
          window.dispatchEvent(new Event('jt:palette'));
          break;
        case '?':
          setHelpOpen((v) => !v);
          break;
        default: {
          const n = Number(event.key);
          if (n >= 1 && n <= SECTIONS.length) {
            document
              .querySelector(SECTIONS[n - 1])
              ?.scrollIntoView({ behavior });
          }
        }
      }
    };

    const onKeymapEvent = () => setHelpOpen((v) => !v);

    window.addEventListener('keydown', onKey);
    window.addEventListener('jt:keymap', onKeymapEvent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('jt:keymap', onKeymapEvent);
      clearTimeout(toastTimer);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {helpOpen && (
          <motion.div
            className="palette-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setHelpOpen(false)}
          >
            <motion.div
              className="keymap"
              role="dialog"
              aria-label="Keyboard shortcuts"
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <p className="keymap-title">jtseng(1) — keymap</p>
              {BINDINGS.map(([keys, action]) => (
                <div className="keymap-row" key={keys}>
                  <kbd>{keys}</kbd>
                  <span>{action}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.p
            className="vim-toast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}

export default KeyboardLayer;
