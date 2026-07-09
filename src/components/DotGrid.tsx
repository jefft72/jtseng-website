import { useEffect, useRef } from 'react';

const SPACING = 26;
const BASE_ALPHA = 0.09;
const HOT_ALPHA = 0.34;
const RADIUS = 150;
const SNOW_MS = 7000;
const FLAKES = 240;

type Flake = {
  x: number;
  y: number;
  vy: number;
  sway: number;
  phase: number;
  accent: boolean;
};

// Adapted from reactbits.dev "Dot Grid" — the Swiss layout grid made literal,
// waking up near the cursor. The :ski command (or the palette) briefly
// turns the grid into snowfall via the jt:snow event.
function DotGrid({ inverted = false }: { inverted?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const ink = inverted ? '244, 242, 237' : '17, 17, 17';

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const pointer = { x: -9999, y: -9999 };
    let raf = 0;
    let needsDraw = true;
    let snowUntil = 0;
    let flakes: Flake[] = [];
    let lastTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      needsDraw = true;
    };

    const drawGrid = () => {
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
          ctx.fillStyle = `rgba(${ink}, ${alpha})`;
          ctx.fill();
        }
      }
    };

    const startSnow = () => {
      if (reduced) return;
      snowUntil = performance.now() + SNOW_MS;
      if (flakes.length === 0) {
        flakes = Array.from({ length: FLAKES }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * -window.innerHeight,
          vy: 55 + Math.random() * 95,
          sway: 8 + Math.random() * 22,
          phase: Math.random() * Math.PI * 2,
          accent: Math.random() < 0.08,
        }));
      }
    };

    const drawSnow = (dt: number, now: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      // faint grid stays underneath so it reads as the grid shaking loose
      for (let x = SPACING; x < w; x += SPACING) {
        for (let y = SPACING; y < h; y += SPACING) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ink}, ${BASE_ALPHA * 0.5})`;
          ctx.fill();
        }
      }
      const fading = snowUntil - now < 1200 ? (snowUntil - now) / 1200 : 1;
      flakes.forEach((flake) => {
        flake.y += flake.vy * dt;
        flake.x += Math.sin(now / 900 + flake.phase) * flake.sway * dt;
        if (flake.y > h + 4 && now < snowUntil - 1200) {
          flake.y = -6;
          flake.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.accent ? 1.8 : 1.4, 0, Math.PI * 2);
        ctx.fillStyle = flake.accent
          ? `rgba(255, 59, 0, ${0.75 * fading})`
          : `rgba(${ink}, ${0.55 * fading})`;
        ctx.fill();
      });
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      needsDraw = true;
    };

    const onSnowEvent = () => startSnow();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (now < snowUntil) {
        drawSnow(dt, now);
        needsDraw = true;
      } else {
        if (flakes.length > 0) flakes = [];
        if (needsDraw) {
          drawGrid();
          needsDraw = false;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('jt:snow', onSnowEvent);
    if (!reduced) {
      window.addEventListener('pointermove', onMove, { passive: true });
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('jt:snow', onSnowEvent);
      window.removeEventListener('pointermove', onMove);
    };
  }, [inverted]);

  return <canvas className="dot-grid" ref={canvasRef} aria-hidden="true" />;
}

export default DotGrid;
