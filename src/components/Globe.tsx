import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import { places, type Place } from '../data';

const DEG = Math.PI / 180;
const THETA = 0.28;
const SPHERE_RATIO = 0.39; // visual sphere radius / canvas width
const HIT_RADIUS = 16;
const RELEASE_RADIUS = 24;
const CLUSTER_GRAB = 26; // cursor distance that wakes a cluster apart
const CLUSTER_EXIT = 70; // leave radius that collapses it again
const SPREAD_PX = 24; // spread pins sit this far from the cluster center

type Tip = { place: Place; x: number; y: number };
type Spread = {
  centerLat: number;
  centerLng: number;
  coords: Map<string, { lat: number; lng: number }>;
};

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

// Dotted, draggable ink globe (cobe). Hover a vermilion pin for the story;
// crowded pins spread apart under the cursor; click opens the travel panel.
function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0.15); // face the US: center lng = 3π/2 − phi
  const targetPhiRef = useRef<number | null>(null);
  const focusRef = useRef<Place | null>(null);
  const dragStart = useRef<number | null>(null);
  const dragBase = useRef(0);
  const downAt = useRef<{ x: number; y: number } | null>(null);
  const spreadRef = useRef<Spread | null>(null);
  const [tip, setTip] = useState<Tip | null>(null);
  const tipRef = useRef<Tip | null>(null);
  tipRef.current = tip;
  const [panelOpen, setPanelOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const displayOf = (place: Place) =>
    spreadRef.current?.coords.get(place.name) ?? place;

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
        markers: [],
      });

      const tick = () => {
        const target = targetPhiRef.current;
        if (target !== null) {
          // easing toward a searched place
          phiRef.current += (target - phiRef.current) * 0.09;
          if (Math.abs(target - phiRef.current) < 0.004) {
            phiRef.current = target;
            targetPhiRef.current = null;
            const focus = focusRef.current;
            if (focus) {
              focusRef.current = null;
              const rect = canvas.getBoundingClientRect();
              const p = project(focus.lat, focus.lng, target, rect.width);
              setTip({ place: focus, x: p.x, y: p.y });
            }
          }
        } else {
          const paused =
            dragStart.current !== null ||
            tipRef.current !== null ||
            spreadRef.current !== null ||
            reduced;
          if (!paused) phiRef.current += 0.0035;
        }
        globe?.update({
          phi: phiRef.current,
          width: canvas.offsetWidth * 2,
          height: canvas.offsetWidth * 2,
          markers: places.map((place) => {
            const d = displayOf(place);
            return { location: [d.lat, d.lng], size: 0.045 };
          }),
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

  useEffect(() => {
    const onTravel = () => {
      setPanelOpen(true);
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 350);
    };
    window.addEventListener('jt:travel', onTravel);
    return () => window.removeEventListener('jt:travel', onTravel);
  }, []);

  const updateSpread = (px: number, py: number, rectW: number) => {
    const spread = spreadRef.current;
    if (spread) {
      const c = project(
        spread.centerLat,
        spread.centerLng,
        phiRef.current,
        rectW,
      );
      if (!c.front || Math.hypot(c.x - px, c.y - py) > CLUSTER_EXIT) {
        spreadRef.current = null;
      }
      return;
    }
    const near = places
      .map((place) => ({
        place,
        p: project(place.lat, place.lng, phiRef.current, rectW),
      }))
      .filter(
        ({ p }) => p.front && Math.hypot(p.x - px, p.y - py) < CLUSTER_GRAB,
      );
    if (near.length < 2) return;

    const centerLat = near.reduce((s, n) => s + n.place.lat, 0) / near.length;
    const centerLng = near.reduce((s, n) => s + n.place.lng, 0) / near.length;
    const c = project(centerLat, centerLng, phiRef.current, rectW);
    const rpx = rectW * SPHERE_RATIO;
    const coords = new Map<string, { lat: number; lng: number }>();
    near.forEach(({ place, p }, i) => {
      let ux = p.x - c.x;
      let uy = p.y - c.y;
      const len = Math.hypot(ux, uy);
      if (len < 2) {
        const a = (i / near.length) * Math.PI * 2;
        ux = Math.cos(a);
        uy = Math.sin(a);
      } else {
        ux /= len;
        uy /= len;
      }
      const dLat = (-uy * SPREAD_PX) / rpx / DEG;
      const dLng =
        (ux * SPREAD_PX) / (rpx * Math.cos(centerLat * DEG)) / DEG;
      coords.set(place.name, {
        lat: centerLat + dLat,
        lng: centerLng + dLng,
      });
    });
    spreadRef.current = { centerLat, centerLng, coords };
  };

  const hitTest = (clientX: number, clientY: number): Tip | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;

    // sticky: keep the active tip until the pointer clearly leaves it
    const active = tipRef.current;
    if (active) {
      const d = displayOf(active.place);
      const p = project(d.lat, d.lng, phiRef.current, rect.width);
      if (p.front && Math.hypot(p.x - px, p.y - py) < RELEASE_RADIUS) {
        return { place: active.place, x: p.x, y: p.y };
      }
    }

    let best: Tip | null = null;
    let bestDist = HIT_RADIUS;
    for (const place of places) {
      const d = displayOf(place);
      const p = project(d.lat, d.lng, phiRef.current, rect.width);
      const dist = Math.hypot(p.x - px, p.y - py);
      if (p.front && dist < bestDist) {
        best = { place, x: p.x, y: p.y };
        bestDist = dist;
      }
    }
    return best;
  };

  const rotateTo = (place: Place) => {
    const base = 1.5 * Math.PI - place.lng * DEG;
    const k = Math.round((phiRef.current - base) / (2 * Math.PI));
    targetPhiRef.current = base + k * 2 * Math.PI;
    focusRef.current = place;
    spreadRef.current = null;
    setTip(null);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setTip(null);
  };

  const q = query.trim().toLowerCase();
  const matches = q
    ? places.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.note.toLowerCase().includes(q),
      )
    : places;

  return (
    <div className="globe-wrap">
      <canvas
        ref={canvasRef}
        className="globe"
        aria-label="Globe of visited places"
        onPointerDown={(e) => {
          dragStart.current = e.clientX;
          dragBase.current = phiRef.current;
          downAt.current = { x: e.clientX, y: e.clientY };
          setTip(null);
          e.currentTarget.style.cursor = 'grabbing';
        }}
        onPointerMove={(e) => {
          if (dragStart.current !== null) {
            phiRef.current =
              dragBase.current + (e.clientX - dragStart.current) / 140;
            spreadRef.current = null;
            return;
          }
          const rect = e.currentTarget.getBoundingClientRect();
          updateSpread(
            e.clientX - rect.left,
            e.clientY - rect.top,
            rect.width,
          );
          const hit = hitTest(e.clientX, e.clientY);
          setTip(hit);
          e.currentTarget.style.cursor = hit ? 'pointer' : 'grab';
        }}
        onPointerUp={(e) => {
          const down = downAt.current;
          if (
            down &&
            Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6
          ) {
            window.dispatchEvent(new Event('jt:travel'));
          }
          dragStart.current = null;
          downAt.current = null;
          e.currentTarget.style.cursor = 'grab';
        }}
        onPointerLeave={() => {
          dragStart.current = null;
          downAt.current = null;
          spreadRef.current = null;
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
      {panelOpen && (
        <div className="travel-panel" role="dialog" aria-label="Travel log">
          <div className="travel-panel-head">
            <span>travel.db — {places.length} rows</span>
            <button type="button" onClick={closePanel} aria-label="Close">
              ×
            </button>
          </div>
          <input
            ref={inputRef}
            value={query}
            placeholder="been to … ?"
            spellCheck={false}
            aria-label="Search travel log"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') closePanel();
            }}
          />
          {q && (
            <p className={`travel-verdict${matches.length ? ' is-yes' : ''}`}>
              {matches.length
                ? `yes ✓ — ${matches.length} match${matches.length > 1 ? 'es' : ''}`
                : 'not yet — open to recs'}
            </p>
          )}
          <ul>
            {matches.map((place) => (
              <li key={place.name}>
                <button type="button" onClick={() => rotateTo(place)}>
                  <strong>{place.name}</strong>
                  <span>{place.note}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Globe;
