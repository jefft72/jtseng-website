import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  onEnter: () => void;
};

const IntroScreen: React.FC<Props> = ({ onEnter }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Start showing text after a brief delay
    const timer = setTimeout(() => setShowText(true), 500);
    
    // Listen for Enter key
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onEnter();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onEnter]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: '#000',
        overflow: 'hidden',
      }}
      initial={{ opacity: 1 }}
      exit={{ scale: 3, opacity: 0 }}
      transition={{ duration: 2, ease: 'easeInOut' }}
    >
      {/* Pixelated Milky Way Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/milky-way.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          imageRendering: 'pixelated',
          filter: 'contrast(1.1) brightness(0.9)',
        }}
      />
      
      {/* Overlay for better text visibility */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
        }}
      />

      {/* Press Enter Text */}
      <AnimatePresence>
        {showText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.7, 1, 0.7, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10 text-center"
            style={{
              textShadow: '0 0 20px rgba(142, 202, 255, 0.5), 0 0 40px rgba(142, 202, 255, 0.3)',
            }}
          >
            {/* Removed middle 'press enter' text */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pixelated stars overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(2px 2px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, white, transparent),
            radial-gradient(2px 2px at 90% 60%, white, transparent),
            radial-gradient(1px 1px at 33% 80%, white, transparent)
          `,
          backgroundSize: '200px 200px',
          opacity: 0.3,
          imageRendering: 'pixelated',
        }}
      />

      <div style={{ position: 'absolute', bottom: '1.25rem', right: '1.25rem', zIndex: 11, textAlign: 'right' }}>
        <motion.p
          className="pixel-text intro-press"
          style={{
            color: '#8ecaff',
            textTransform: 'lowercase',
            fontSize: '2rem', /* Bigger text */
            fontFamily: "monospace",
            imageRendering: 'pixelated', /* Ensure pixelation */
            textShadow: '0 0 1px #000, 0 0 2px #000', /* Stronger pixel effect */
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.7, 1, 0.7, 1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          press enter
        </motion.p>
      </div>
    </motion.div>
  );
};

export default IntroScreen;
