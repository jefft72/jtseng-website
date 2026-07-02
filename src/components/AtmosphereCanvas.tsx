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
  spark: Rgb;
};

const palettes: Record<string, DitherPalette> = {
  all: {
    low: { r: 38, g: 44, b: 48 },
    mid: { r: 111, g: 126, b: 132 },
    high: { r: 225, g: 228, b: 222 },
    spark: { r: 184, g: 219, b: 222 },
  },
  ai: {
    low: { r: 31, g: 48, b: 50 },
    mid: { r: 92, g: 143, b: 142 },
    high: { r: 220, g: 239, b: 231 },
    spark: { r: 118, g: 225, b: 209 },
  },
  frontend: {
    low: { r: 43, g: 42, b: 55 },
    mid: { r: 112, g: 122, b: 162 },
    high: { r: 225, g: 229, b: 241 },
    spark: { r: 159, g: 188, b: 255 },
  },
  mobile: {
    low: { r: 38, g: 42, b: 48 },
    mid: { r: 104, g: 118, b: 134 },
    high: { r: 220, g: 226, b: 232 },
    spark: { r: 161, g: 209, b: 237 },
  },
  leadership: {
    low: { r: 50, g: 39, b: 43 },
    mid: { r: 136, g: 105, b: 99 },
    high: { r: 235, g: 224, b: 214 },
    spark: { r: 225, g: 158, b: 139 },
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
  const primary = Math.sin(x * 11.4 + Math.sin(y * 6.6 + time * 0.21) + time * 0.17);
  const secondary = Math.cos(y * 10.8 - Math.sin(x * 5.3 - time * 0.13) + time * 0.11);
  const tertiary = Math.sin((x + y) * 8.2 + Math.cos((x - y) * 4.4 + time * 0.09));

  return (primary * 0.42 + secondary * 0.34 + tertiary * 0.24 + 1) / 2;
};

const hash = (x: number, y: number, seed: number) => {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return value - Math.floor(value);
};

const emitterField = (x: number, y: number, time: number, mode: string) => {
  const offset = mode.length * 0.47;
  const emitters = [
    {
      x: 0.18 + Math.sin(time * 0.11 + offset) * 0.08,
      y: 0.26 + Math.cos(time * 0.08 + offset) * 0.08,
      sx: 0.34,
      sy: 0.22,
      strength: 0.44,
    },
    {
      x: 0.7 + Math.cos(time * 0.09 + offset) * 0.1,
      y: 0.42 + Math.sin(time * 0.12 + offset) * 0.1,
      sx: 0.28,
      sy: 0.34,
      strength: 0.5,
    },
    {
      x: 0.48 + Math.sin(time * 0.07 + offset * 0.5) * 0.16,
      y: 0.78 + Math.cos(time * 0.1 + offset) * 0.08,
      sx: 0.42,
      sy: 0.2,
      strength: 0.34,
    },
  ];

  return emitters.reduce((total, emitter) => {
    const dx = (x - emitter.x) / emitter.sx;
    const dy = (y - emitter.y) / emitter.sy;
    return total + Math.exp(-(dx * dx + dy * dy)) * emitter.strength;
  }, 0);
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
      const pixelSize = compact ? 3 : 2;
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
      const intensity = compact ? 0.5 : 0.74;
      const baseAlpha = compact ? 14 : 18;
      const alphaRange = compact ? 70 : 88;

      for (let y = 0; y < bufferHeight; y += 1) {
        for (let x = 0; x < bufferWidth; x += 1) {
          const index = (y * bufferWidth + x) * 4;
          const nx = x / bufferWidth;
          const ny = y / bufferHeight;
          const ux = (nx - 0.5) * aspect;
          const uy = ny - 0.5;
          const mouseDistance = Math.hypot(ux - mouseX, uy - mouseY);
          const cursorPressure = Math.exp(-(mouseDistance * mouseDistance) / 0.045);
          const field = emitterField(nx, ny, time, mode);
          const texture = waveNoise(ux, uy, time);
          const grain = hash(x, y, frame);
          const vignette = smoothstep(0.74, 0.08, Math.hypot(ux / Math.max(aspect, 0.1), uy));
          const orderedThreshold = bayer8[(x % 8) + (y % 8) * 8] - 0.5;
          const threshold = (hash(x, y, 17) - 0.5) * 0.62 + orderedThreshold * 0.12;
          const density =
            0.03 +
            field * intensity +
            texture * 0.16 +
            cursorPressure * 0.18 -
            grain * 0.11 +
            threshold * 0.48;
          const quantized = Math.floor(clamp(smoothstep(0.2, 0.86, density) * vignette, 0, 1) * 5) / 5;

          if (quantized <= 0.05) {
            data[index] = 0;
            data[index + 1] = 0;
            data[index + 2] = 0;
            data[index + 3] = 0;
            continue;
          }

          const tone = quantized < 0.5
            ? mixColor(palette.low, palette.mid, quantized * 2)
            : mixColor(palette.mid, palette.high, (quantized - 0.5) * 2);
          const spark = grain > 0.985 && quantized > 0.35
            ? mixColor(tone, palette.spark, 0.68)
            : tone;

          data[index] = spark.r;
          data[index + 1] = spark.g;
          data[index + 2] = spark.b;
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
