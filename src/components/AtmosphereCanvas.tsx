import { useEffect, useRef } from 'react';

type AtmosphereCanvasProps = {
  mode: string;
};

type ColorStop = {
  color: string;
  alpha: number;
};

type Palette = {
  bloom: ColorStop[];
  cursor: string;
};

const palettes: Record<string, Palette> = {
  all: {
    bloom: [
      { color: '40, 232, 255', alpha: 0.26 },
      { color: '126, 149, 255', alpha: 0.14 },
      { color: '236, 250, 255', alpha: 0.1 },
    ],
    cursor: '203, 251, 255',
  },
  ai: {
    bloom: [
      { color: '65, 255, 221', alpha: 0.3 },
      { color: '94, 177, 255', alpha: 0.15 },
      { color: '228, 255, 246', alpha: 0.1 },
    ],
    cursor: '121, 255, 232',
  },
  frontend: {
    bloom: [
      { color: '103, 182, 255', alpha: 0.28 },
      { color: '144, 118, 255', alpha: 0.14 },
      { color: '236, 244, 255', alpha: 0.1 },
    ],
    cursor: '171, 210, 255',
  },
  mobile: {
    bloom: [
      { color: '97, 217, 255', alpha: 0.25 },
      { color: '118, 255, 206', alpha: 0.13 },
      { color: '235, 255, 252', alpha: 0.08 },
    ],
    cursor: '185, 244, 255',
  },
  leadership: {
    bloom: [
      { color: '255, 138, 180', alpha: 0.2 },
      { color: '89, 209, 255', alpha: 0.16 },
      { color: '244, 249, 255', alpha: 0.09 },
    ],
    cursor: '255, 196, 214',
  },
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function AtmosphereCanvas({ mode }: AtmosphereCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });

    if (!canvas || !context) {
      return undefined;
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const palette = palettes[mode] ?? palettes.all;
    const pointer = { x: window.innerWidth * 0.7, y: window.innerHeight * 0.34 };
    const target = { ...pointer };
    const cells = Array.from({ length: 9 }, (_, index) => ({
      phase: index * 1.71,
      radius: 0.34 + (index % 3) * 0.12,
      speed: 0.11 + index * 0.018,
      x: 0.16 + ((index * 0.19) % 0.74),
      y: 0.18 + ((index * 0.23) % 0.66),
    }));

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let raf = 0;
    let start = performance.now();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const movePointer = (event: PointerEvent) => {
      target.x = clamp(event.clientX, 0, width);
      target.y = clamp(event.clientY, 0, height);
      document.documentElement.style.setProperty('--pointer-x', `${target.x}px`);
      document.documentElement.style.setProperty('--pointer-y', `${target.y}px`);
    };

    const drawBloom = (
      x: number,
      y: number,
      radiusX: number,
      radiusY: number,
      stop: ColorStop,
      rotation: number,
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.scale(radiusX / radiusY, 1);

      const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radiusY);
      gradient.addColorStop(0, `rgba(${stop.color}, ${stop.alpha})`);
      gradient.addColorStop(0.42, `rgba(${stop.color}, ${stop.alpha * 0.34})`);
      gradient.addColorStop(1, `rgba(${stop.color}, 0)`);

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(0, 0, radiusY, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    const draw = (timestamp: number) => {
      const elapsed = media.matches ? 0 : (timestamp - start) / 1000;
      pointer.x += (target.x - pointer.x) * 0.055;
      pointer.y += (target.y - pointer.y) * 0.055;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'screen';
      context.filter = 'blur(34px)';

      cells.forEach((cell, index) => {
        const stop = palette.bloom[index % palette.bloom.length];
        const driftX = Math.sin(elapsed * cell.speed + cell.phase) * width * 0.12;
        const driftY = Math.cos(elapsed * (cell.speed * 0.86) + cell.phase * 0.74) * height * 0.1;
        const cursorPull = Math.max(0, 1 - Math.hypot(pointer.x - width * cell.x, pointer.y - height * cell.y) / 720);
        const x = width * cell.x + driftX + (pointer.x - width / 2) * 0.035 * cursorPull;
        const y = height * cell.y + driftY + (pointer.y - height / 2) * 0.035 * cursorPull;
        const radiusX = Math.max(width, height) * (cell.radius + cursorPull * 0.08);
        const radiusY = Math.max(width, height) * (cell.radius * 0.46);

        drawBloom(x, y, radiusX, radiusY, stop, Math.sin(elapsed * 0.12 + cell.phase) * 0.7);
      });

      context.filter = 'blur(18px)';
      drawBloom(pointer.x, pointer.y, 340, 210, { color: palette.cursor, alpha: 0.14 }, 0);

      context.globalCompositeOperation = 'source-over';
      context.filter = 'none';

      if (!media.matches) {
        raf = window.requestAnimationFrame(draw);
      }
    };

    resize();
    start = performance.now();
    raf = window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', movePointer, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', movePointer);
    };
  }, [mode]);

  return (
    <>
      <canvas ref={canvasRef} className="atmosphere-canvas" aria-hidden="true" />
      <div className="interaction-field" aria-hidden="true" />
    </>
  );
}

export default AtmosphereCanvas;
