import { useEffect, useRef } from 'react';
import portraitUrl from '../assets/portrait.jpg';

const CELL = 5; // display px per halftone dot

// The profile photo rendered as ink halftone dots — photography in the
// same dot language as the background grid and globe.
function HalftonePortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new Image();
    img.src = portraitUrl;
    img.onload = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.floor(w / CELL);
      const rows = Math.floor(h / CELL);
      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const octx = off.getContext('2d');
      if (!octx) return;

      // cover-crop the source into the sample grid
      const targetRatio = w / h;
      const srcRatio = img.width / img.height;
      let sw = img.width;
      let sh = img.height;
      let sx = 0;
      let sy = 0;
      if (srcRatio > targetRatio) {
        sw = img.height * targetRatio;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / targetRatio;
        sy = (img.height - sh) / 2;
      }
      octx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
      const data = octx.getImageData(0, 0, cols, rows).data;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#111111';
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const lum =
            (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) /
            255;
          const radius = (1 - lum) * CELL * 0.62;
          if (radius < 0.35) continue;
          ctx.beginPath();
          ctx.arc(x * CELL + CELL / 2, y * CELL + CELL / 2, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
  }, []);

  return (
    <figure className="portrait">
      <canvas ref={canvasRef} aria-label="Halftone portrait of Jeffrey Tseng" />
      <figcaption>fig. 00 — operator</figcaption>
    </figure>
  );
}

export default HalftonePortrait;
