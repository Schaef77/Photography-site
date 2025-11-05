'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Navbar from '../../../components/Navbar';
import Masonry from '../../../components/Masonry';
import Footer from '../../../components/Footer';

interface Photo {
  src: string;
  width: number;
  height: number;
}

interface Gallery {
  id: string;
  title: string;
  thumbnail: string;
  photos: Photo[];
}

export default function GalleryClient({ gallery }: { gallery: Gallery }) {
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Convert photos to masonry format with scaled dimensions from build-time data
  const masonryItems = gallery.photos.map((photo, index) => {
    // Use dimensions from galleries.json (extracted at build time)
    const aspectRatio = photo.height / photo.width;
    // Scale proportionally - portrait photos taller, landscape shorter
    const scaledHeight = 500 * aspectRatio;

    return {
      id: `${gallery.id}-${index}`,
      img: photo.src,
      height: scaledHeight,
    };
  });

  const handleImageClick = (item: any) => {
    const index = gallery.photos.findIndex(p => p.src === item.img);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    // Scroll to position immediately
    const imageElement = document.querySelector(`[data-key="${gallery.id}-${lightboxIndex}"]`);
    if (imageElement) {
      imageElement.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'nearest'
      });
    }

    // Close lightbox immediately
    setLightboxOpen(false);
  };

  // Prepare slides for lightbox
  const slides = gallery.photos.map(photo => ({ src: photo.src }));

  return (
    <div className="min-h-screen overflow-y-auto" style={{ backgroundColor: '#141414' }}>
      <Navbar />

      {/* Back button and title container */}
      <div className="px-8" style={{ paddingTop: '75px' }}>
        <button
          onClick={() => router.push(`/galleries?gallery=${gallery.id}`)}
          className="text-white mb-8"
          style={{
            fontSize: '22px',
            fontWeight: 500,
            background: 'transparent',
            border: 'none',
            padding: '8px 0',
            cursor: 'pointer',
            transition: 'color 0.3s ease',
            color: 'white',
            marginLeft: '40px',
            marginTop: '35px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
        >
          ← Back
        </button>

        {/* Gallery title */}
        <h1 className="text-4xl font-medium text-center mb-12" style={{ fontFamily: 'var(--font-montserrat), sans-serif', color: '#d1d5db' }}>
          {gallery.title}
        </h1>
      </div>

      {/* Masonry grid */}
      <div className="px-8 pb-16" style={{ minHeight: 'calc(100vh - 300px)' }}>
        <Masonry
          items={masonryItems}
          stagger={0.03}
          scaleOnHover={true}
          hoverScale={0.98}
          onImageClick={handleImageClick}
        />
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

      <Footer />
    </div>
  );
}
