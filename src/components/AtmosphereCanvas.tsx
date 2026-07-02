import { useEffect, useRef } from 'react';

type AtmosphereCanvasProps = {
  mode: string;
};

type Rgb = {
  r: number;
  g: number;
  b: number;
};

const palettes: Record<string, [Rgb, Rgb, Rgb]> = {
  all: [
    { r: 241, g: 229, b: 212 },
    { r: 201, g: 143, b: 103 },
    { r: 95, g: 37, b: 41 },
  ],
  ai: [
    { r: 238, g: 235, b: 219 },
    { r: 139, g: 144, b: 125 },
    { r: 201, g: 143, b: 103 },
  ],
  frontend: [
    { r: 241, g: 229, b: 212 },
    { r: 196, g: 170, b: 137 },
    { r: 120, g: 84, b: 66 },
  ],
  mobile: [
    { r: 232, g: 222, b: 211 },
    { r: 178, g: 154, b: 129 },
    { r: 109, g: 80, b: 68 },
  ],
  leadership: [
    { r: 241, g: 229, b: 212 },
    { r: 201, g: 143, b: 103 },
    { r: 95, g: 37, b: 41 },
  ],
};

const rgba = ({ r, g, b }: Rgb, alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function AtmosphereCanvas({ mode }: AtmosphereCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return undefined;
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const palette = palettes[mode] ?? palettes.all;
    const pointer = { x: window.innerWidth * 0.72, y: window.innerHeight * 0.32 };
    const target = { ...pointer };
    const seeds = Array.from({ length: 64 }, (_, index) => ({
      x: (Math.sin(index * 19.19) * 0.5 + 0.5) * window.innerWidth,
      y: (Math.cos(index * 11.73) * 0.5 + 0.5) * window.innerHeight,
      drift: 0.65 + ((index * 17) % 19) / 19,
    }));

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    let frame = 0;
    let raf = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
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

    const drawRibbon = (time: number, index: number) => {
      const verticalAnchor = height * (0.18 + index * 0.16);
      const pull = (pointer.y - height / 2) * (0.035 + index * 0.012);
      const amplitude = 34 + index * 18;
      const frequency = 0.008 + index * 0.0018;
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, rgba(palette[2], 0));
      gradient.addColorStop(0.24, rgba(palette[1], 0.08 + index * 0.018));
      gradient.addColorStop(0.58, rgba(palette[0], 0.16 - index * 0.014));
      gradient.addColorStop(1, rgba(palette[1], 0));

      context.beginPath();
      for (let x = -80; x <= width + 80; x += 28) {
        const magnetic = Math.max(0, 1 - Math.abs(x - pointer.x) / Math.max(width * 0.42, 320));
        const y =
          verticalAnchor +
          Math.sin(x * frequency + time * (0.58 + index * 0.12)) * amplitude +
          Math.cos(x * (frequency * 0.62) - time * 0.32) * amplitude * 0.38 +
          pull * magnetic;

        if (x === -80) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.lineWidth = 1.3 + index * 1.1;
      context.strokeStyle = gradient;
      context.shadowBlur = 26 + index * 7;
      context.shadowColor = rgba(palette[index % palette.length], 0.22);
      context.stroke();
      context.shadowBlur = 0;
    };

    const drawDither = (time: number) => {
      const gap = width < 720 ? 42 : 34;

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const lens = Math.max(0, 1 - distance / 360);
          const wave = Math.sin(time * 1.8 + x * 0.018 + y * 0.012);
          const alpha = Math.max(0, wave * 0.025 + lens * 0.13 - 0.012);

          if (alpha > 0.008) {
            const size = 1 + lens * 1.8;
            context.fillStyle = rgba(palette[0], alpha);
            context.fillRect(x, y, size, size);
          }
        }
      }
    };

    const drawOrbitMarks = (time: number) => {
      context.save();
      context.translate(pointer.x, pointer.y);
      context.rotate(time * 0.16);
      context.strokeStyle = rgba(palette[0], 0.12);
      context.lineWidth = 1;

      for (let index = 0; index < 3; index += 1) {
        context.beginPath();
        context.ellipse(0, 0, 92 + index * 38, 24 + index * 12, index * 0.72, 0, Math.PI * 2);
        context.stroke();
      }

      context.restore();
    };

    const drawDust = (time: number) => {
      seeds.forEach((seed, index) => {
        const x = (seed.x + Math.sin(time * seed.drift + index) * 34 + width) % width;
        const y = (seed.y + Math.cos(time * seed.drift * 0.8 + index) * 22 + height) % height;
        const distance = Math.hypot(x - pointer.x, y - pointer.y);
        const alpha = 0.03 + Math.max(0, 1 - distance / 320) * 0.15;

        context.fillStyle = rgba(palette[index % palette.length], alpha);
        context.fillRect(x, y, 1.4, 1.4);
      });
    };

    const draw = () => {
      const time = frame / 60;
      frame += media.matches ? 0 : 1;
      pointer.x += (target.x - pointer.x) * 0.075;
      pointer.y += (target.y - pointer.y) * 0.075;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'screen';
      context.fillStyle = rgba(palette[2], 0.045);
      context.fillRect(0, 0, width, height);

      drawDither(time);
      drawDust(time);

      for (let index = 0; index < 5; index += 1) {
        drawRibbon(time, index);
      }

      drawOrbitMarks(time);
      context.globalCompositeOperation = 'source-over';

      if (!media.matches) {
        raf = window.requestAnimationFrame(draw);
      }
    };

    resize();
    draw();
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
