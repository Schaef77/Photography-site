'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import favoritesData from '../data/favorites.json';

export default function FeaturedGallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Create grid items with deterministic sizing (using index-based pattern)
  const gridItems = useMemo(() => {
    // Use a deterministic pattern: every 3rd and 4th image is large
    return favoritesData.map((src, index) => ({
      src,
      isLarge: index % 7 === 2 || index % 7 === 5 // Deterministic pattern for ~30% large images
    }));
  }, []);

  // Prepare lightbox slides
  const slides = favoritesData.map((src) => ({
    src,
    alt: 'Adrian Schaefer Photography'
  }));

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    // Scroll to the image that was being viewed
    const imageElement = document.querySelector(`[data-key="featured-${lightboxIndex}"]`);
    if (imageElement) {
      imageElement.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'nearest'
      });
    }

    // Close lightbox
    setLightboxOpen(false);
  };

  return (
    <div style={{ backgroundColor: '#141414', padding: '80px 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        {/* Title */}
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '600',
          marginBottom: '3rem',
          textAlign: 'center',
          color: '#d1d5db',
          fontFamily: 'Montserrat, sans-serif',
          letterSpacing: '0.02em'
        }}
        className="featured-title">
          Featured Work
        </h2>

        {/* Mixed Grid Gallery */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '3rem'
        }}
        className="featured-grid">
          {gridItems.map((item, index) => (
            <div
              key={index}
              data-key={`featured-${index}`}
              onClick={() => handleImageClick(index)}
              style={{
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: '4px',
                gridColumn: item.isLarge ? 'span 2' : 'span 1',
                gridRow: item.isLarge ? 'span 2' : 'span 1',
                aspectRatio: '4/3',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              className="gallery-item"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Image
                src={item.src}
                alt="Adrian Schaefer Photography"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                quality={85}
              />
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/galleries"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              border: '2px solid white',
              borderRadius: '4px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              letterSpacing: '0',
              textDecoration: 'none',
              fontFamily: 'Montserrat, sans-serif',
              transition: 'all 0.3s ease',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#c9a961';
              e.currentTarget.style.color = '#c9a961';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'white';
              e.currentTarget.style.color = 'white';
            }}
          >
            View More Galleries
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={handleLightboxClose}
        slides={slides}
        index={lightboxIndex}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
        }}
        on={{
          view: ({ index }) => setLightboxIndex(index)
        }}
        animation={{ fade: 0 }}
      />

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 1200px) {
          .featured-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
          }
        }
        @media (max-width: 768px) {
          .featured-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
            gap: 12px !important;
          }
          .gallery-item {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
        }
        @media (max-width: 480px) {
          .featured-title {
            font-size: 1.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}
