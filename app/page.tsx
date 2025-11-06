'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import FeaturedGallery from '../components/FeaturedGallery';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fadeInTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(fadeInTimeout);
  }, []);

  return (
    <div style={{ backgroundColor: '#141414' }}>

      {/* Hero Section - 75% Viewport */}
      <div
        className="hero-section"
        style={{
          position: 'relative',
          width: '100%',
          height: '75vh',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 800ms ease-out'
        }}
      >
        {/* Hero Image */}
        <Image
          src="/images/galleries/amsterdam/amsterdam-20.jpg"
          alt="Adrian Schaefer Photography"
          fill
          priority
          className="hero-image"
          style={{
            objectFit: 'cover',
            objectPosition: 'center calc(50% - 15px)'
          }}
          quality={95}
        />
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .hero-image {
            object-position: 30% center !important;
          }
        }
      `}</style>

      {/* Featured Gallery */}
      <FeaturedGallery />

      <Footer />
    </div>
  );
}
