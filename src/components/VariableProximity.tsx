import { useEffect, useRef } from 'react';

type VariableProximityProps = {
  text: string;
};

const RADIUS = 190;
const IDLE_WEIGHT = 700;
const MIN_WEIGHT = 320;

// Adapted from reactbits.dev "Variable Proximity" — cursor distance drives the
// wght axis so the name physically responds to pressure.
function VariableProximity({ text }: VariableProximityProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const letters = Array.from(
      container.querySelectorAll<HTMLSpanElement>('[data-letter]'),
    );
    const weights = letters.map(() => IDLE_WEIGHT);
    const pointer = { x: -9999, y: -9999 };
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const tick = () => {
      letters.forEach((letter, i) => {
        const rect = letter.getBoundingClientRect();
        const distance = Math.hypot(
          rect.left + rect.width / 2 - pointer.x,
          rect.top + rect.height / 2 - pointer.y,
        );
        const target =
          distance > RADIUS
            ? IDLE_WEIGHT
            : MIN_WEIGHT + ((IDLE_WEIGHT - MIN_WEIGHT) * distance) / RADIUS;
        weights[i] += (target - weights[i]) * 0.16;
        letter.style.fontVariationSettings = `'wght' ${Math.round(weights[i])}`;
      });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <span ref={containerRef} aria-hidden="true">
      {text.split('').map((char, i) => (
        <span data-letter key={i} className="prox-letter">
          {char}
        </span>
      ))}
    </span>
  );
}

export default VariableProximity;
