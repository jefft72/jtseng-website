import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const COUNTER_URL = 'https://api.counterapi.dev/v1/jtseng-org/site-visits/up';

// Module-level guard so StrictMode's double effect doesn't count twice.
let requested = false;
let cached: number | null = null;

function FlipDigit({ ch }: { ch: string }) {
  return (
    <span className="flip-cell">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={ch}
          className="flip-card"
          initial={{ rotateX: -92, opacity: 0.4 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 92, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {ch}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Split-flap odometer of total site visits. Renders nothing if the
// counter API is unreachable.
function VisitCounter() {
  const [total, setTotal] = useState<number | null>(cached);
  const [display, setDisplay] = useState<number | null>(null);

  useEffect(() => {
    if (requested) return;
    requested = true;
    fetch(COUNTER_URL)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data: { count?: number }) => {
        if (typeof data.count === 'number') {
          cached = data.count;
          setTotal(data.count);
        }
      })
      .catch(() => {
        /* counter unavailable — widget stays hidden */
      });
  }, []);

  useEffect(() => {
    if (total == null) return;
    let current = Math.max(0, total - 14);
    setDisplay(current);
    const id = setInterval(() => {
      current += 1;
      setDisplay(current);
      if (current >= total) clearInterval(id);
    }, 110);
    return () => clearInterval(id);
  }, [total]);

  if (display == null) return null;

  const digits = String(display).padStart(5, '0').split('');

  return (
    <div className="visit-counter" title="Total visits">
      <span className="visit-label">visits</span>
      {digits.map((ch, i) => (
        <FlipDigit key={i} ch={ch} />
      ))}
    </div>
  );
}

export default VisitCounter;
