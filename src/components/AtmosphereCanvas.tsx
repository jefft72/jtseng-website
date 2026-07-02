import { useEffect, useRef } from 'react';

type AtmosphereCanvasProps = {
  mode: string;
};

type Rgb = {
  r: number;
  g: number;
  b: number;
};

type DitherPalette = {
  low: Rgb;
  mid: Rgb;
  high: Rgb;
  anchor: {
    x: number;
    y: number;
  };
};

const palettes: Record<string, DitherPalette> = {
  all: {
    low: { r: 118, g: 91, b: 75 },
    mid: { r: 201, g: 143, b: 103 },
    high: { r: 241, g: 229, b: 212 },
    anchor: { x: 0.68, y: 0.32 },
  },
  ai: {
    low: { r: 94, g: 98, b: 84 },
    mid: { r: 139, g: 144, b: 125 },
    high: { r: 238, g: 235, b: 219 },
    anchor: { x: 0.74, y: 0.28 },
  },
  frontend: {
    low: { r: 110, g: 77, b: 63 },
    mid: { r: 196, g: 170, b: 137 },
    high: { r: 241, g: 229, b: 212 },
    anchor: { x: 0.42, y: 0.45 },
  },
  mobile: {
    low: { r: 91, g: 72, b: 64 },
    mid: { r: 178, g: 154, b: 129 },
    high: { r: 232, g: 222, b: 211 },
    anchor: { x: 0.58, y: 0.62 },
  },
  leadership: {
    low: { r: 95, g: 37, b: 41 },
    mid: { r: 201, g: 143, b: 103 },
    high: { r: 241, g: 229, b: 212 },
    anchor: { x: 0.28, y: 0.38 },
  },
};

const bayer8 = [
  0, 48, 12, 60, 3, 51, 15, 63,
  32, 16, 44, 28, 35, 19, 47, 31,
  8, 56, 4, 52, 11, 59, 7, 55,
  40, 24, 36, 20, 43, 27, 39, 23,
  2, 50, 14, 62, 1, 49, 13, 61,
  34, 18, 46, 30, 33, 17, 45, 29,
  10, 58, 6, 54, 9, 57, 5, 53,
  42, 26, 38, 22, 41, 25, 37, 21,
].map((value) => value / 64);

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
};

const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;

const mixColor = (from: Rgb, to: Rgb, amount: number): Rgb => ({
  r: Math.round(mix(from.r, to.r, amount)),
  g: Math.round(mix(from.g, to.g, amount)),
  b: Math.round(mix(from.b, to.b, amount)),
});

const waveNoise = (x: number, y: number, time: number) => {
  const primary = Math.sin(x * 7.1 + Math.sin(y * 4.2 + time * 0.33) + time * 0.22);
  const secondary = Math.cos(y * 6.4 - Math.sin(x * 3.8 - time * 0.19) + time * 0.14);
  const tertiary = Math.sin((x + y) * 4.6 + Math.cos((x - y) * 3.2 + time * 0.11));

  return (primary * 0.42 + secondary * 0.34 + tertiary * 0.24 + 1) / 2;
};

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
    const pointer = { x: window.innerWidth * 0.68, y: window.innerHeight * 0.34 };
    const target = { ...pointer };

    let width = window.innerWidth;
    let height = window.innerHeight;
    let bufferWidth = 1;
    let bufferHeight = 1;
    let imageData = context.createImageData(1, 1);
    let compact = false;
    let raf = 0;
    let frame = 0;
    let lastPaint = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      compact = width < 760;
      const pixelSize = compact ? 4 : 3;
      bufferWidth = Math.ceil(width / pixelSize);
      bufferHeight = Math.ceil(height / pixelSize);
      canvas.width = bufferWidth;
      canvas.height = bufferHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.imageSmoothingEnabled = false;
      imageData = context.createImageData(bufferWidth, bufferHeight);
    };

    const movePointer = (event: PointerEvent) => {
      target.x = clamp(event.clientX, 0, width);
      target.y = clamp(event.clientY, 0, height);
      document.documentElement.style.setProperty('--pointer-x', `${target.x}px`);
      document.documentElement.style.setProperty('--pointer-y', `${target.y}px`);
    };

    const paint = (timestamp = 0) => {
      if (!media.matches && timestamp - lastPaint < 32) {
        raf = window.requestAnimationFrame(paint);
        return;
      }

      lastPaint = timestamp;
      const time = frame / 48;
      frame += media.matches ? 0 : 1;
      pointer.x += (target.x - pointer.x) * 0.08;
      pointer.y += (target.y - pointer.y) * 0.08;

      const data = imageData.data;
      const aspect = width / Math.max(height, 1);
      const mouseX = (pointer.x / Math.max(width, 1) - 0.5) * aspect;
      const mouseY = pointer.y / Math.max(height, 1) - 0.5;
      const anchorX = (palette.anchor.x - 0.5) * aspect;
      const anchorY = palette.anchor.y - 0.5;
      const intensity = compact ? 0.62 : 1;
      const baseAlpha = compact ? 22 : 34;
      const alphaRange = compact ? 76 : 104;

      for (let y = 0; y < bufferHeight; y += 1) {
        for (let x = 0; x < bufferWidth; x += 1) {
          const index = (y * bufferWidth + x) * 4;
          const ux = (x / bufferWidth - 0.5) * aspect;
          const uy = y / bufferHeight - 0.5;
          const mouseDistance = Math.hypot(ux - mouseX, uy - mouseY);
          const anchorDistance = Math.hypot(ux - anchorX, uy - anchorY);
          const sourceDistance = Math.hypot(ux + 0.3 * aspect, uy - 0.18);
          const cursorVoid = Math.exp(-(mouseDistance * mouseDistance) / 0.013);
          const cursorRing = Math.exp(-((mouseDistance - 0.18) * (mouseDistance - 0.18)) / 0.004);
          const anchorGlow = Math.exp(-(anchorDistance * anchorDistance) / 0.11);
          const sourceGlow = Math.exp(-(sourceDistance * sourceDistance) / 0.16);
          const texture = waveNoise(ux, uy, time);
          const threshold = bayer8[(x % 8) + (y % 8) * 8] - 0.5;
          const density =
            0.1 +
            anchorGlow * 0.48 * intensity +
            sourceGlow * 0.24 * intensity +
            cursorRing * 0.34 * intensity -
            cursorVoid * 0.2 * intensity +
            texture * 0.28 +
            threshold * 0.34;
          const quantized = Math.floor(clamp(smoothstep(0.24, 0.98, density), 0, 1) * 4) / 4;

          if (quantized <= 0.08) {
            data[index] = 0;
            data[index + 1] = 0;
            data[index + 2] = 0;
            data[index + 3] = 0;
            continue;
          }

          const tone = quantized < 0.5
            ? mixColor(palette.low, palette.mid, quantized * 2)
            : mixColor(palette.mid, palette.high, (quantized - 0.5) * 2);

          data[index] = tone.r;
          data[index + 1] = tone.g;
          data[index + 2] = tone.b;
          data[index + 3] = Math.round(baseAlpha + quantized * alphaRange);
        }
      }

      context.putImageData(imageData, 0, 0);

      if (!media.matches) {
        raf = window.requestAnimationFrame(paint);
      }
    };

    resize();
    paint();
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
