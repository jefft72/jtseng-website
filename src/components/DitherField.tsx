import { useEffect, useMemo, useRef } from 'react';

type Props = {
  projectIndex: number;
  toolCount: number;
  highlightedTool: number | null;
};
type Vector = { x: number; y: number; z: number };
type Sample = { u: number; v: number; grain: number };
type Shape = Float32Array;
type Controller = { update: (settings: Props) => void };
type Drag = {
  id: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  touch: boolean;
  moving: boolean;
};

const TAU = Math.PI * 2;
const POINT_COUNT = 7_800;
const SURFACE_COUNT = 3;
const MORPH_SECONDS = 1.15;
const PAPER = '#dce5f0';
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));
const fract = (value: number) => value - Math.floor(value);
const length = (point: Vector) => Math.hypot(point.x, point.y, point.z);
const normalize = (point: Vector): Vector => {
  const magnitude = length(point) || 1;
  return { x: point.x / magnitude, y: point.y / magnitude, z: point.z / magnitude };
};
const cross = (a: Vector, b: Vector): Vector => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });

function knotCenter(t: number): Vector {
  const radius = 0.64 + 0.22 * Math.cos(3 * t);
  return { x: radius * Math.cos(2 * t), y: radius * Math.sin(2 * t), z: 0.28 * Math.sin(3 * t) };
}

/** Three different continuous surfaces share one parameter space for smooth morphs. */
function surface(index: number, u: number, v: number): Vector {
  const angle = u * TAU;
  if (index === 0) {
    const center = knotCenter(angle);
    const nearby = knotCenter(angle + 0.001);
    const tangent = normalize({ x: nearby.x - center.x, y: nearby.y - center.y, z: nearby.z - center.z });
    const side = normalize(cross(tangent, { x: 0, y: 0, z: 1 }));
    const up = cross(side, tangent);
    const ring = v * TAU;
    const radius = 0.19 + 0.025 * Math.cos(3 * angle);
    return {
      x: center.x + radius * (side.x * Math.cos(ring) + up.x * Math.sin(ring)),
      y: center.y + radius * (side.y * Math.cos(ring) + up.y * Math.sin(ring)),
      z: center.z + radius * (side.z * Math.cos(ring) + up.z * Math.sin(ring)),
    };
  }
  if (index === 1) {
    const turn = (u - 0.5) * TAU * 1.12;
    const span = (v * 2 - 1) * (0.87 + 0.07 * Math.cos(turn));
    return { x: span * Math.cos(turn), y: (u - 0.5) * 1.75, z: span * Math.sin(turn) * 0.78 };
  }
  const radius = Math.sqrt(v) * 1.04;
  const a = radius * Math.cos(angle);
  const b = radius * Math.sin(angle);
  return {
    x: (a - a * a * a / 3 + a * b * b) * 0.76,
    y: (b - b * b * b / 3 + b * a * a) * 0.76,
    z: (a * a - b * b) * 0.61,
  };
}

function samples(count: number): Sample[] {
  return Array.from({ length: count }, (_, index) => ({
    u: fract((index + 0.5) * 0.618033988749895),
    v: fract((index + 0.5) * 0.754877666246693),
    grain: fract((index + 0.5) * 0.569840290998053),
  }));
}

function buildShape(index: number, points: Sample[]): Shape {
  const data = new Float32Array(points.length * 6);
  points.forEach(({ u, v, grain }, i) => {
    const center = surface(index, u, v);
    const along = surface(index, u + 0.0005, v);
    const across = surface(index, u, v + 0.0005);
    const normal = normalize(cross(
      { x: along.x - center.x, y: along.y - center.y, z: along.z - center.z },
      { x: across.x - center.x, y: across.y - center.y, z: across.z - center.z },
    ));
    // A narrow volume around each surface gives the stipple physical depth.
    const thickness = (grain - 0.5) * 0.045;
    const offset = i * 6;
    data[offset] = center.x + normal.x * thickness;
    data[offset + 1] = center.y + normal.y * thickness;
    data[offset + 2] = center.z + normal.z * thickness;
    data[offset + 3] = normal.x;
    data[offset + 4] = normal.y;
    data[offset + 5] = normal.z;
  });
  return data;
}

function rotate(point: Vector, yaw: number, pitch: number): Vector {
  const x = point.x * Math.cos(yaw) + point.z * Math.sin(yaw);
  const z = point.z * Math.cos(yaw) - point.x * Math.sin(yaw);
  return { x, y: point.y * Math.cos(pitch) - z * Math.sin(pitch), z: point.y * Math.sin(pitch) + z * Math.cos(pitch) };
}

function fallbackPoints(projectIndex: number) {
  const points = samples(880);
  const shape = buildShape(clamp(projectIndex, 0, SURFACE_COUNT - 1), points);
  const projected = points.map((point, index) => {
    const offset = index * 6;
    const rotated = rotate({ x: shape[offset], y: shape[offset + 1], z: shape[offset + 2] }, -0.36, -0.2);
    return { x: rotated.x, y: -rotated.y, z: rotated.z, u: point.u };
  });
  const xs = projected.map((point) => point.x);
  const ys = projected.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const scale = Math.min(520 / (maxX - minX), 480 / (maxY - minY));
  return projected.sort((a, b) => a.z - b.z).map((point) => ({
    x: 320 + (point.x - (minX + maxX) / 2) * scale,
    y: 280 + (point.y - (minY + maxY) / 2) * scale,
    opacity: clamp(0.36 + point.z * 0.22, 0.17, 0.65),
    u: point.u,
  }));
}

/** A tactile point sculpture. Project and tool controls remain accessible in the DOM. */
export default function DitherField({ projectIndex, toolCount, highlightedTool }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<SVGSVGElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const initialRef = useRef({ projectIndex, toolCount, highlightedTool });
  const still = useMemo(() => fallbackPoints(projectIndex), [projectIndex]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    if (!host || !canvas || !fallback) return;
    const context = canvas.getContext('2d', { alpha: true });
    host.dataset.renderer = 'fallback';
    fallback.style.display = 'block';
    canvas.style.visibility = 'hidden';
    if (!context) return;

    const points = samples(POINT_COUNT);
    const shapes = Array.from({ length: SURFACE_COUNT }, (_, index) => buildShape(index, points));
    const settings = { ...initialRef.current };
    settings.projectIndex = clamp(Math.round(settings.projectIndex), 0, SURFACE_COUNT - 1);
    settings.toolCount = Math.max(1, Math.round(settings.toolCount));
    let current = shapes[settings.projectIndex].slice();
    let source = current.slice();
    let target = shapes[settings.projectIndex];
    let morph = 1;
    let bandWeights: number[] = Array.from({ length: settings.toolCount }, (_, index) => index === settings.highlightedTool ? 1 : 0);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motion.matches;
    let inView = true;
    let disposed = false;
    let contextLost = false;
    let width = 1;
    let height = 1;
    let pixelRatio = 1;
    let frame = 0;
    let lastFrame = 0;
    let sceneTime = 0;
    let viewScale = 0;
    let viewCenterX = 0;
    let viewCenterY = 0;
    let bounds = host.getBoundingClientRect();
    let drag: Drag | null = null;
    let pulseTime = 2;
    const pulse = { x: 0, y: 0 };
    const orientation = { yaw: -0.36, pitch: -0.2, targetYaw: -0.36, targetPitch: -0.2 };
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, presence: 0, targetPresence: 0 };
    const projected = Array.from({ length: POINT_COUNT }, () => ({ x: 0, y: 0, z: 0, light: 0 }));
    const order = Array.from({ length: POINT_COUNT }, (_, index) => index);
    const graphite = Array.from({ length: 16 }, (_, index) => `rgba(44, 60, 83, ${(0.14 + index * 0.047).toFixed(3)})`);
    const cobalt = Array.from({ length: 16 }, (_, index) => `rgba(54, 96, 183, ${(0.23 + index * 0.049).toFixed(3)})`);

    const canAnimate = () => !disposed && !contextLost && !reducedMotion && !document.hidden && inView;

    const settle = () => {
      current = target.slice();
      source = current.slice();
      morph = 1;
      bandWeights = Array.from({ length: settings.toolCount }, (_, index) => index === settings.highlightedTool ? 1 : 0);
      pointer.presence = 0;
      pulseTime = 2;
      viewScale = 0;
    };

    const draw = () => {
      if (disposed || contextLost || document.hidden || !inView) return;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      const yaw = orientation.yaw + (reducedMotion ? 0 : Math.sin(sceneTime * 0.13) * 0.085);
      const pitch = orientation.pitch + (reducedMotion ? 0 : Math.sin(sceneTime * 0.17) * 0.045);
      const cosYaw = Math.cos(yaw);
      const sinYaw = Math.sin(yaw);
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      for (let index = 0; index < POINT_COUNT; index++) {
        const offset = index * 6;
        const sample = points[index];
        const breathing = reducedMotion ? 0 : Math.sin(sceneTime * 0.62 + sample.u * TAU * 2) * 0.011;
        const x = current[offset] + current[offset + 3] * breathing;
        const y = current[offset + 1] + current[offset + 4] * breathing;
        const z = current[offset + 2] + current[offset + 5] * breathing;
        const turnedX = x * cosYaw + z * sinYaw;
        const turnedZ = z * cosYaw - x * sinYaw;
        const turnedY = y * cosPitch - turnedZ * sinPitch;
        const depth = y * sinPitch + turnedZ * cosPitch;
        const perspective = 3.8 / (3.8 - depth);
        const point = projected[index];
        point.x = turnedX * perspective;
        point.y = -turnedY * perspective;
        point.z = depth;
        const normalX = current[offset + 3] * cosYaw + current[offset + 5] * sinYaw;
        const normalZ = current[offset + 5] * cosYaw - current[offset + 3] * sinYaw;
        const normalY = current[offset + 4] * cosPitch - normalZ * sinPitch;
        point.light = clamp(0.48 - normalX * 0.18 + normalY * 0.15 + depth * 0.28, 0, 1);
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      }
      const scale = Math.min(width * 0.87 / Math.max(0.1, maxX - minX), height * 0.86 / Math.max(0.1, maxY - minY));
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      if (!viewScale || reducedMotion) {
        viewScale = scale;
        viewCenterX = centerX;
        viewCenterY = centerY;
      } else {
        viewScale = Math.min(viewScale + (scale - viewScale) * 0.13, scale * 1.035);
        viewCenterX += (centerX - viewCenterX) * 0.13;
        viewCenterY += (centerY - viewCenterY) * 0.13;
      }
      order.sort((a, b) => projected[a].z - projected[b].z);
      const size = clamp(Math.min(width, height) / 500, 0.8, 1.45);
      const influenceRadius = Math.min(width, height) * 0.2;
      const waveRadius = pulseTime * Math.min(width, height) * 0.56;
      const pulseStrength = Math.max(0, 1 - pulseTime / 1.5);
      const highlighted = settings.highlightedTool !== null;
      const stride = width < 440 ? 2 : 1;
      for (let rank = 0; rank < order.length; rank++) {
        const index = order[rank];
        if (index % stride !== 0) continue;
        const point = projected[index];
        const sample = points[index];
        let x = width * 0.5 + (point.x - viewCenterX) * viewScale;
        let y = height * 0.5 + (point.y - viewCenterY) * viewScale;
        const band = Math.min(settings.toolCount - 1, Math.floor(sample.u * settings.toolCount));
        const bandStrength = bandWeights[band] ?? 0;
        let glow = bandStrength;
        if (pointer.presence > 0.001) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const influence = Math.max(0, 1 - distance / influenceRadius);
          const push = influence * influence * pointer.presence * 16;
          x += dx / Math.max(distance, 1) * push;
          y += dy / Math.max(distance, 1) * push;
          glow = Math.max(glow, influence * pointer.presence * 0.55);
        }
        if (pulseStrength > 0) {
          const dx = x - pulse.x;
          const dy = y - pulse.y;
          const distance = Math.hypot(dx, dy);
          const wave = Math.exp(-Math.pow((distance - waveRadius) / 24, 2)) * pulseStrength;
          x += dx / Math.max(distance, 1) * wave * 9;
          y += dy / Math.max(distance, 1) * wave * 9;
          glow = Math.max(glow, wave * 0.85);
        }
        // A restrained traveling glint follows the surface parameter, never
        // changes the selected project, and becomes a real band on tool focus.
        const flow = reducedMotion ? 0 : Math.pow(Math.max(0, Math.cos(sample.u * TAU - sceneTime * 0.46)), 28);
        glow = Math.max(glow, flow * 0.32 * (0.4 + sample.grain * 0.6));
        const shade = clamp(point.light * (highlighted ? 0.7 + bandStrength * 0.3 : 1) + glow * 0.3, 0, 1);
        const paletteIndex = Math.min(15, Math.round(shade * 15));
        context.fillStyle = glow > 0.21 ? cobalt[paletteIndex] : graphite[paletteIndex];
        const radius = (0.82 + sample.grain * 0.65 + point.light * 0.38 + bandStrength * 0.3) * size;
        context.fillRect(x - radius / 2, y - radius / 2, radius, radius);
      }
      host.dataset.renderer = 'ready';
      host.dataset.project = String(settings.projectIndex);
      host.dataset.highlightedTool = settings.highlightedTool === null ? 'none' : String(settings.highlightedTool);
      fallback.style.display = 'none';
      canvas.style.visibility = 'visible';
    };

    const advance = (seconds: number) => {
      sceneTime += seconds;
      pulseTime += seconds;
      const follow = 1 - Math.exp(-seconds * 9);
      orientation.yaw += (orientation.targetYaw - orientation.yaw) * follow;
      orientation.pitch += (orientation.targetPitch - orientation.pitch) * follow;
      pointer.x += (pointer.targetX - pointer.x) * follow;
      pointer.y += (pointer.targetY - pointer.y) * follow;
      pointer.presence += (pointer.targetPresence - pointer.presence) * follow;
      for (let index = 0; index < settings.toolCount; index++) {
        const targetWeight = index === settings.highlightedTool ? 1 : 0;
        bandWeights[index] = (bandWeights[index] ?? 0) + (targetWeight - (bandWeights[index] ?? 0)) * follow;
      }
      if (morph < 1) {
        morph = Math.min(1, morph + seconds / MORPH_SECONDS);
        const eased = morph * morph * (3 - 2 * morph);
        for (let index = 0; index < current.length; index++) current[index] = source[index] + (target[index] - source[index]) * eased;
      }
    };

    const tick = (now: number) => {
      frame = 0;
      if (!canAnimate()) return;
      const delta = now - lastFrame;
      if (delta >= 1000 / 30) {
        lastFrame = now;
        advance(Math.min(delta / 1000, 0.065));
        draw();
      }
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      draw();
      host.dataset.motion = canAnimate() ? 'running' : 'still';
      canvas.style.cursor = reducedMotion ? 'default' : drag?.moving ? 'grabbing' : 'grab';
      if (canAnimate()) {
        lastFrame = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    const resize = () => {
      bounds = host.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(1_000_000 / (width * height)));
      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      viewScale = 0;
      sync();
    };

    const releaseDrag = () => {
      if (drag && canvas.hasPointerCapture(drag.id)) canvas.releasePointerCapture(drag.id);
      drag = null;
      canvas.style.cursor = reducedMotion ? 'default' : 'grab';
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!canAnimate() || event.button !== 0 || drag) return;
      bounds = host.getBoundingClientRect();
      drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastY: event.clientY, touch: event.pointerType === 'touch', moving: false };
    };
    const onPointer = (event: PointerEvent) => {
      if (!canAnimate()) return;
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      if (event.pointerType !== 'touch') {
        if (pointer.targetPresence === 0) {
          pointer.x = x;
          pointer.y = y;
        }
        pointer.targetX = x;
        pointer.targetY = y;
        pointer.targetPresence = x >= 0 && x <= width && y >= 0 && y <= height ? 1 : 0;
      }
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.moving) {
        if (drag.touch && Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
          releaseDrag();
          return;
        }
        if (Math.hypot(dx, dy) < (drag.touch ? 8 : 3)) return;
        drag.moving = true;
        canvas.setPointerCapture(event.pointerId);
        canvas.style.cursor = 'grabbing';
      }
      orientation.targetYaw += (event.clientX - drag.lastX) * 0.006;
      orientation.targetPitch = clamp(orientation.targetPitch + (event.clientY - drag.lastY) * 0.004, -0.95, 0.95);
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      pointer.targetPresence = 0;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!drag || drag.id !== event.pointerId) return;
      if (!drag.moving && canAnimate()) {
        pulse.x = event.clientX - bounds.left;
        pulse.y = event.clientY - bounds.top;
        pulseTime = 0;
      }
      releaseDrag();
    };
    const onPointerCancel = (event: PointerEvent) => { if (drag?.id === event.pointerId) releaseDrag(); };
    const onPointerLeave = (event: PointerEvent) => { if (event.relatedTarget === null) pointer.targetPresence = 0; };
    const onScroll = () => { bounds = host.getBoundingClientRect(); pointer.targetPresence = 0; };
    const onMotion = () => {
      reducedMotion = motion.matches;
      releaseDrag();
      if (reducedMotion) settle();
      sync();
    };
    const onVisibility = () => { if (document.hidden) releaseDrag(); sync(); };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      releaseDrag();
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      host.dataset.renderer = 'fallback';
      host.dataset.motion = 'still';
      fallback.style.display = 'block';
      canvas.style.visibility = 'hidden';
    };
    const onContextRestored = () => { contextLost = false; resize(); };
    controllerRef.current = {
      update(next) {
        const nextProject = clamp(Math.round(next.projectIndex), 0, SURFACE_COUNT - 1);
        if (nextProject !== settings.projectIndex) {
          source = current.slice();
          target = shapes[nextProject];
          morph = 0;
        }
        settings.projectIndex = nextProject;
        settings.toolCount = Math.max(1, Math.round(next.toolCount));
        settings.highlightedTool = next.highlightedTool;
        bandWeights.length = settings.toolCount;
        if (reducedMotion) settle();
        sync();
      },
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView) releaseDrag();
      sync();
    }, { rootMargin: '100px' });
    intersectionObserver.observe(host);
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
    window.addEventListener('pointerout', onPointerLeave, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onMotion);
    canvas.addEventListener('contextlost', onContextLost);
    canvas.addEventListener('contextrestored', onContextRestored);
    resize();

    return () => {
      disposed = true;
      releaseDrag();
      if (frame) cancelAnimationFrame(frame);
      controllerRef.current = null;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      window.removeEventListener('pointerout', onPointerLeave);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', onMotion);
      canvas.removeEventListener('contextlost', onContextLost);
      canvas.removeEventListener('contextrestored', onContextRestored);
    };
  }, []);

  useEffect(() => { controllerRef.current?.update({ projectIndex, toolCount, highlightedTool }); }, [projectIndex, toolCount, highlightedTool]);

  return (
    <div ref={hostRef} className="dither-field" data-renderer="fallback" aria-hidden="true" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <svg ref={fallbackRef} viewBox="0 0 640 560" className="dither-field-fallback" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {still.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="1.05" fill={highlightedTool !== null && Math.floor(point.u * Math.max(1, toolCount)) === highlightedTool ? '#3660b7' : '#2c3c53'} opacity={point.opacity} />)}
      </svg>
      <canvas ref={canvasRef} style={{ display: 'block', position: 'relative', width: '100%', height: '100%', touchAction: 'pan-y', background: PAPER }} />
    </div>
  );
}
