import { useEffect, useRef } from 'react';

const PixelatedSpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create pixelated stars
    const stars: Array<{ x: number; y: number; size: number; brightness: number; twinkleSpeed: number }> = [];
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.floor(Math.random() * 3) + 1, // 1-3px for pixelated look
        brightness: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Slight trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        // Twinkling effect
        star.brightness += star.twinkleSpeed;
        if (star.brightness > 1 || star.brightness < 0.5) {
          star.twinkleSpeed *= -1;
        }

        // Draw pixelated star
        const alpha = Math.max(0.5, Math.min(1, star.brightness));
        const blueShades = ['#2d5a8e', '#5b8fd9', '#6fa8dc', '#8ecaff', '#a8d8ff'];
        const colorIndex = Math.floor(star.brightness * (blueShades.length - 1));
        
        ctx.fillStyle = blueShades[colorIndex];
        ctx.globalAlpha = alpha;
        
        // Draw as squares for pixelated effect
        ctx.fillRect(
          Math.floor(star.x),
          Math.floor(star.y),
          star.size,
          star.size
        );
        
        ctx.globalAlpha = 1;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        imageRendering: 'pixelated',
        opacity: 0.9,
      }}
    />
  );
};

export default PixelatedSpaceBackground;
