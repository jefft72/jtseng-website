import { useEffect } from 'react';
import type { CSSProperties } from 'react';

type AtmosphereCanvasProps = {
  mode: string;
};

const modeTone: Record<string, string> = {
  all: 'rgba(244, 239, 230, 0.07)',
  ai: 'rgba(244, 239, 230, 0.09)',
  frontend: 'rgba(244, 239, 230, 0.08)',
  mobile: 'rgba(244, 239, 230, 0.075)',
  leadership: 'rgba(244, 239, 230, 0.085)',
};

function AtmosphereCanvas({ mode }: AtmosphereCanvasProps) {
  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });

    return () => {
      window.removeEventListener('pointermove', updatePointer);
    };
  }, []);

  return (
    <>
      <div
        className="atmosphere-wash"
        style={{ '--mode-wash': modeTone[mode] ?? modeTone.all } as CSSProperties & Record<'--mode-wash', string>}
        aria-hidden="true"
      />
      <div className="interaction-field" aria-hidden="true" />
    </>
  );
}

export default AtmosphereCanvas;
