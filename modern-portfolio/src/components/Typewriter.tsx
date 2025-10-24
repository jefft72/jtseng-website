import React, { useEffect, useState } from 'react';

type Props = {
  text: string;
  speed?: number; // ms per char
  className?: string;
  cursor?: boolean;
};

const Typewriter: React.FC<Props> = ({ text, speed = 50, className, cursor = true }) => {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    setDisplay('');
    let i = 0;
    const id = setInterval(() => {
      // Safe slicing avoids appending undefined
      setDisplay(text.slice(0, i + 1));
      i += 1;
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <span className={className}>
      {display}
      {cursor && <span style={{ marginLeft: 2, opacity: 0.8 }}>▍</span>}
    </span>
  );
};

export default Typewriter;
