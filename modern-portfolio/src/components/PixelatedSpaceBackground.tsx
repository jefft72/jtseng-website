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
    const starCount = 400; // More stars!

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.floor(Math.random() * 3) + 1, // 1-3px for pixelated look
        brightness: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    // Create mini galaxies with more detail
    const galaxies: Array<{ x: number; y: number; size: number; rotation: number; rotationSpeed: number; hue: number }> = [];
    const galaxyCount = 5;

    for (let i = 0; i < galaxyCount; i++) {
      galaxies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.floor(Math.random() * 25) + 25, // 25-50px
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.001,
        hue: Math.random() * 30 + 200, // Blue-purple range
      });
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Slight trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw mini galaxies with detailed structure
      galaxies.forEach(galaxy => {
        galaxy.rotation += galaxy.rotationSpeed;
        
        ctx.save();
        ctx.translate(galaxy.x, galaxy.y);
        ctx.rotate(galaxy.rotation);
        
        // Dense elliptical core
        const coreSize = galaxy.size * 0.4;
        for (let i = 0; i < 150; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * coreSize;
          const x = Math.cos(angle) * dist * 1.5; // Elliptical
          const y = Math.sin(angle) * dist * 0.8;
          const brightness = 1 - (dist / coreSize);
          const pixelSize = brightness > 0.7 ? 2 : 1;
          
          ctx.fillStyle = `hsla(${galaxy.hue}, 100%, ${60 + brightness * 40}%, ${brightness * 0.6})`;
          ctx.fillRect(Math.floor(x), Math.floor(y), pixelSize, pixelSize);
        }
        
        // Spiral arms with dust lanes
        const arms = 4;
        for (let arm = 0; arm < arms; arm++) {
          const armAngle = (Math.PI * 2 / arms) * arm;
          
          // Main arm
          for (let i = 0; i < 60; i++) {
            const t = i / 60;
            const spiralAngle = armAngle + t * Math.PI * 3.5;
            const distance = t * galaxy.size;
            const width = 8 * (1 - t);
            
            // Create thickness in the arm
            for (let w = -width; w < width; w += 2) {
              const x = Math.cos(spiralAngle) * distance + Math.sin(spiralAngle) * w;
              const y = Math.sin(spiralAngle) * distance - Math.cos(spiralAngle) * w;
              const alpha = 0.3 * (1 - t) * (1 - Math.abs(w) / width);
              
              if (Math.random() > 0.3) { // Patchy appearance
                ctx.fillStyle = `hsla(${galaxy.hue}, 80%, 70%, ${alpha})`;
                ctx.fillRect(Math.floor(x), Math.floor(y), 2, 2);
              }
            }
          }
          
          // Star clusters along arms
          for (let i = 0; i < 20; i++) {
            const t = (i / 20) * 0.8 + 0.1;
            const spiralAngle = armAngle + t * Math.PI * 3.5 + (Math.random() - 0.5) * 0.5;
            const distance = t * galaxy.size + (Math.random() - 0.5) * 10;
            const x = Math.cos(spiralAngle) * distance;
            const y = Math.sin(spiralAngle) * distance;
            const alpha = 0.8 * (1 - t);
            
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(Math.floor(x), Math.floor(y), 2, 2);
          }
        }
        
        // Bright central bulge
        const bulgeGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize * 0.5);
        bulgeGradient.addColorStop(0, `hsla(${galaxy.hue}, 100%, 95%, 0.8)`);
        bulgeGradient.addColorStop(0.5, `hsla(${galaxy.hue}, 100%, 80%, 0.4)`);
        bulgeGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = bulgeGradient;
        ctx.fillRect(-coreSize * 0.5, -coreSize * 0.5, coreSize, coreSize);
        
        ctx.restore();
      });

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
        opacity: 1,
      }}
    />
  );
};

export default PixelatedSpaceBackground;
