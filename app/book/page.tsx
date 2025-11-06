'use client';

import { useState, useEffect } from 'react';
import Cal from '@calcom/embed-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Book() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fadeInTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(fadeInTimeout);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 600ms ease-out',
        backgroundColor: '#141414'
      }}
    >
      <Navbar />

      <div className="px-8 max-w-4xl mx-auto book-container" style={{ paddingTop: '90px', paddingBottom: '80px' }}>
        <h1 className="text-white text-5xl font-medium text-center" style={{ marginBottom: '15px' }}>
          Book a Session
        </h1>

        <div
          style={{
            backgroundColor: '#1a1f2e',
            borderRadius: '8px',
            padding: '20px',
            minHeight: '650px',
            height: 'auto'
          }}
        >
          <Cal
            calLink="adrian-schaefer-fcw8v1"
            style={{
              width: '100%',
              height: '100%',
              minHeight: '650px',
              overflow: 'hidden'
            }}
            config={{
              theme: 'dark',
              branding: {
                brandColor: '#c9a961'
              }
            }}
          />
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @media (max-width: 768px) {
          .book-container {
            padding-top: 120px !important;
          }
        }
      `}</style>
    </div>
  );
}
