import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import { places, type Place } from '../data';

const DEG = Math.PI / 180;
const THETA = 0.28;
const SPHERE_RATIO = 0.39; // visual sphere radius / canvas width
const HIT_RADIUS = 36; // generous hitbox around a pin
const RELEASE_RADIUS = 52; // once locked, keep the tip until this far away

type Tip = { place: Place; x: number; y: number };

// Project lat/lng to canvas coordinates for cobe's rotation state.
// cobe centers longitude (3π/2 − phi); verified against frozen-rotation
// reference pins (north pole + null island) measured to the pixel.
function project(lat: number, lng: number, phi: number, w: number) {
  const la = lat * DEG;
  const lo = lng * DEG + phi - 1.5 * Math.PI;
  const x = Math.cos(la) * Math.sin(lo);
  const y = Math.sin(la);
  const z = Math.cos(la) * Math.cos(lo);
  const yT = y * Math.cos(THETA) - z * Math.sin(THETA);
  const zT = y * Math.sin(THETA) + z * Math.cos(THETA);
  const r = w * SPHERE_RATIO;
  return { x: w / 2 + x * r, y: w / 2 - yT * r, front: zT > 0.08 };
}

// Dotted, draggable ink globe (cobe) — hover a vermilion pin for the story.
function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0.15); // face the US: center lng = 3π/2 − phi
  const dragStart = useRef<number | null>(null);
  const dragBase = useRef(0);
  const [tip, setTip] = useState<Tip | null>(null);
  const tipRef = useRef<Tip | null>(null);
  tipRef.current = tip;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let raf = 0;
    let globe: ReturnType<typeof createGlobe> | null = null;

    const init = () => {
      const width = canvas.offsetWidth;
      if (width === 0) {
        // layout not ready yet — retry next frame instead of mounting blank
        raf = requestAnimationFrame(init);
        return;
      }
      globe = createGlobe(canvas, {
        devicePixelRatio: 2,
        width: width * 2,
        height: width * 2,
        phi: phiRef.current,
        theta: THETA,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 42000,
        mapBrightness: 7,
        baseColor: [0.957, 0.949, 0.929],
        markerColor: [1, 0.23, 0],
        glowColor: [0.957, 0.949, 0.929],
        markerElevation: 0,
        markers: places.map((place) => ({
          location: [place.lat, place.lng],
          size: 0.045,
        })),
      });

      const tick = () => {
        const paused =
          dragStart.current !== null || tipRef.current !== null || reduced;
        if (!paused) phiRef.current += 0.0035;
        globe?.update({
          phi: phiRef.current,
          width: canvas.offsetWidth * 2,
          height: canvas.offsetWidth * 2,
        });
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    init();
    return () => {
      cancelAnimationFrame(raf);
      globe?.destroy();
    };
  }, []);

  const hitTest = (clientX: number, clientY: number): Tip | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;

    // sticky: keep the active tip until the pointer clearly leaves it
    const active = tipRef.current;
    if (active) {
      const p = project(active.place.lat, active.place.lng, phiRef.current, rect.width);
      if (p.front && Math.hypot(p.x - px, p.y - py) < RELEASE_RADIUS) {
        return { place: active.place, x: p.x, y: p.y };
      }
    }

    let best: Tip | null = null;
    let bestDist = HIT_RADIUS;
    for (const place of places) {
      const p = project(place.lat, place.lng, phiRef.current, rect.width);
      const dist = Math.hypot(p.x - px, p.y - py);
      if (p.front && dist < bestDist) {
        best = { place, x: p.x, y: p.y };
        bestDist = dist;
      }
    }
    return best;
  };

  return (
    <div className="globe-wrap">
      <canvas
        ref={canvasRef}
        className="globe"
        aria-label="Globe of visited countries"
        onPointerDown={(e) => {
          dragStart.current = e.clientX;
          dragBase.current = phiRef.current;
          setTip(null);
          e.currentTarget.style.cursor = 'grabbing';
        }}
        onPointerMove={(e) => {
          if (dragStart.current !== null) {
            phiRef.current =
              dragBase.current + (e.clientX - dragStart.current) / 140;
            return;
          }
          const hit = hitTest(e.clientX, e.clientY);
          setTip(hit);
          e.currentTarget.style.cursor = hit ? 'pointer' : 'grab';
        }}
        onPointerUp={(e) => {
          dragStart.current = null;
          e.currentTarget.style.cursor = 'grab';
        }}
        onPointerLeave={() => {
          dragStart.current = null;
          setTip(null);
        }}
      />
      {tip && (
        <div
          className="globe-tip"
          style={{ left: tip.x, top: tip.y }}
          role="status"
        >
          <strong>{tip.place.name}</strong>
          <span>{tip.place.note}</span>
        </div>
      )}
    </div>
  );
}

export default Globe;
