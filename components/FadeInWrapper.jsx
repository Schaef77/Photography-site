'use client';

import { useState, useEffect } from 'react';

export default function FadeInWrapper({ children, delay = 50 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fadeInTimeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(fadeInTimeout);
  }, [delay]);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 600ms ease-out'
      }}
    >
      {children}
    </div>
  );
}
