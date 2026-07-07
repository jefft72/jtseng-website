import { useEffect, useRef } from 'react';

const SPACING = 26;
const BASE_ALPHA = 0.09;
const HOT_ALPHA = 0.34;
const RADIUS = 150;

// Adapted from reactbits.dev "Dot Grid" — the Swiss layout grid made literal,
// waking up near the cursor.
function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const pointer = { x: -9999, y: -9999 };
    let raf = 0;
    let needsDraw = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      needsDraw = true;
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (let x = SPACING; x < w; x += SPACING) {
        for (let y = SPACING; y < h; y += SPACING) {
          const distance = Math.hypot(x - pointer.x, y - pointer.y);
          let alpha = BASE_ALPHA;
          let radius = 1;
          if (!reduced && distance < RADIUS) {
            const heat = 1 - distance / RADIUS;
            alpha = BASE_ALPHA + (HOT_ALPHA - BASE_ALPHA) * heat;
            radius = 1 + heat * 0.9;
          }
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(17, 17, 17, ${alpha})`;
          ctx.fill();
        }
      }
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      needsDraw = true;
    };

    const tick = () => {
      if (needsDraw) {
        draw();
        needsDraw = false;
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    if (!reduced) {
      window.addEventListener('pointermove', onMove, { passive: true });
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas className="dot-grid" ref={canvasRef} aria-hidden="true" />;
}

export default DotGrid;
