import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const GLYPHS = '█▓▒░/\\<>+=*';
const FRAME_MS = 28;

type ScrambleTextProps = {
  text: string;
};

// Adapted from reactbits.dev "Decrypted Text" — mono labels resolve
// left-to-right; monospace keeps the width stable while scrambling.
function ScrambleText({ text }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const total = Math.max(10, text.length * 2);
    let frame = 0;
    const id = setInterval(() => {
      frame += 1;
      const resolved = Math.floor((frame / total) * text.length);
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (i < resolved || char === ' ') return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(''),
      );
      if (frame >= total) {
        setDisplay(text);
        clearInterval(id);
      }
    }, FRAME_MS);

    return () => clearInterval(id);
  }, [inView, text]);

  return (
    <span ref={ref} aria-label={text}>
      {display}
    </span>
  );
}

export default ScrambleText;
