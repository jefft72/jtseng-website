import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { places } from '../data';

// Dotted, draggable globe (cobe) — visited cities as vermilion markers.
function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragStart = useRef<number | null>(null);
  const dragOffset = useRef(0);
  const dragBase = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    // start facing the US where the markers live
    let phi = 4.6;
    let raf = 0;
    let width = canvas.offsetWidth;

    const onResize = () => {
      width = canvas.offsetWidth;
    };
    window.addEventListener('resize', onResize);

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi,
      theta: 0.28,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 22000,
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
      if (dragStart.current === null && !reduced) phi += 0.0035;
      globe.update({
        phi: phi + dragOffset.current,
        width: width * 2,
        height: width * 2,
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="globe"
      aria-label="Globe of visited places"
      onPointerDown={(e) => {
        dragStart.current = e.clientX;
        dragBase.current = dragOffset.current;
        e.currentTarget.style.cursor = 'grabbing';
      }}
      onPointerMove={(e) => {
        if (dragStart.current !== null) {
          dragOffset.current =
            dragBase.current + (e.clientX - dragStart.current) / 140;
        }
      }}
      onPointerUp={(e) => {
        dragStart.current = null;
        e.currentTarget.style.cursor = 'grab';
      }}
      onPointerLeave={() => {
        dragStart.current = null;
      }}
    />
  );
}

export default Globe;
