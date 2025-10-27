import React, { useEffect, useRef } from 'react';

// Animated "spider web" background using Canvas.
// - Floating dots connected by lines
// - Subtle spotlight reveal around the cursor (no hard highlight)
// - Only show dots/lines near the cursor
// - Nearest dot is softly attracted to the cursor (magnet effect)

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number; // float frequency X (Hz)
  fy: number; // float frequency Y (Hz)
  px: number; // phase X
  py: number; // phase Y
  amp: number; // float amplitude (px/s^2 contribution)
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const SpiderWebBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const cursorRef = useRef<{ x: number; y: number; active: boolean }>({ x: -9999, y: -9999, active: false });
  const lockedIndexRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { alpha: true })!;

      const dpr = Math.max(1, window.devicePixelRatio || 1);
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Re-create nodes with density based on area (clamped)
      const density = 0.00012; // nodes per px^2 (tweakable)
      const target = clamp(Math.floor(w * h * density), 40, 120);
      nodesRef.current = new Array(target).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        // baseline drift similar to first iteration but a bit slower
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        // soft orbital float parameters
        fx: 0.06 + Math.random() * 0.06, // 0.06–0.12 Hz
        fy: 0.06 + Math.random() * 0.06,
        px: Math.random() * Math.PI * 2,
        py: Math.random() * Math.PI * 2,
        amp: 4 + Math.random() * 6, // small acceleration influence
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    // Capture pointer for spotlight + magnet logic
    const onMove = (e: PointerEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
      cursorRef.current.active = true;
    };
    const onLeave = () => {
      cursorRef.current.active = false;
      cursorRef.current.x = -9999;
      cursorRef.current.y = -9999;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onMove);
    window.addEventListener('pointerleave', onLeave);

    const getBlue = () => {
      const css = getComputedStyle(document.documentElement);
      const val = css.getPropertyValue('--blue').trim();
      return val || '#8ecaff';
    };

  const linkDist = 150; // max distance for a line (slightly more dynamic)
  const revealR = 180;  // inner reveal radius (fully visible)
  const revealSoft = 140; // soft falloff outside inner radius
  const magnetRadius = 140; // cursor attraction radius
  const magnetFollow = 0.28; // a touch snappier follow
  const driftFriction = 0.995; // retain a bit more velocity for liveliness

    const frame = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const nodes = nodesRef.current;
      const cur = cursorRef.current;
      const blue = getBlue();

      // Move nodes (with slight friction to slow drift)
      const t = performance.now() / 1000; // seconds
      for (const n of nodes) {
        // Smooth float forces (slower than v1 but lively)
        n.vx += Math.sin(t * (2 * Math.PI * n.fx) + n.px) * (n.amp * 0.0008);
        n.vy += Math.cos(t * (2 * Math.PI * n.fy) + n.py) * (n.amp * 0.0008);
        n.vx *= driftFriction;
        n.vy *= driftFriction;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.x = clamp(n.x, 0, w);
        n.y = clamp(n.y, 0, h);
      }

      // Magnet: lock nearest node and have it follow the cursor smoothly
      if (cur.active) {
        // find nearest index
        let nearest = -1;
        let nearestD = Infinity;
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const dx = n.x - cur.x;
          const dy = n.y - cur.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < nearestD) {
            nearestD = d2;
            nearest = i;
          }
        }
        const locked = lockedIndexRef.current;
        // Switch lock if none locked or a different node becomes clearly closer
        if (locked === null) {
          lockedIndexRef.current = nearest;
        } else {
          const ln = nodes[locked];
          const dxL = ln.x - cur.x;
          const dyL = ln.y - cur.y;
          const dL2 = dxL * dxL + dyL * dyL;
          if (nearest !== locked && nearestD + 100 < dL2) {
            lockedIndexRef.current = nearest;
          }
        }

        // Apply follow to locked node when within radius
        const idx = lockedIndexRef.current;
        if (idx != null) {
          const n = nodes[idx];
          const d = Math.hypot(n.x - cur.x, n.y - cur.y);
          if (d < magnetRadius) {
            n.x += (cur.x - n.x) * magnetFollow;
            n.y += (cur.y - n.y) * magnetFollow;
            // damp velocity to reduce jitter when following
            n.vx *= 0.9; n.vy *= 0.9;
          }
        }
      } else {
        lockedIndexRef.current = null;
      }

      // Draw
      ctx.clearRect(0, 0, w, h);

      // Helper: spotlight alpha factor based on distance
      const alphaAt = (x: number, y: number) => {
        if (!cur.active) return 0;
        const dx = x - cur.x;
        const dy = y - cur.y;
        const d = Math.hypot(dx, dy);
        const outer = revealR + revealSoft;
        if (d <= revealR) return 1; // full reveal inside inner radius
        if (d >= outer) return 0;
        // Smooth falloff (ease) between revealR and outer
        const t = 1 - (d - revealR) / (outer - revealR);
        const eased = t * t * (3 - 2 * t);
        return clamp(eased, 0, 1);
      };

      // Lines
      ctx.lineWidth = 1.2;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d > linkDist) continue;
          // Only reveal if near cursor
          const alpha = Math.min(alphaAt(a.x, a.y), alphaAt(b.x, b.y));
          if (alpha <= 0) continue;
          ctx.globalAlpha = Math.min(0.85, alpha * (1 - d / linkDist));
          ctx.strokeStyle = blue;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // Dots (only within spotlight)
      for (const n of nodes) {
        const a = alphaAt(n.x, n.y);
        if (a <= 0) continue;
        ctx.globalAlpha = Math.min(0.9, a);
        ctx.fillStyle = blue;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    />
  );
};

export default SpiderWebBackground;
