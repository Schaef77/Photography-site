'use client';

export default function FeaturedGalleryLoading() {
  return (
    <div style={{ backgroundColor: '#141414', padding: '80px 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        {/* Title skeleton */}
        <div style={{
          height: '3rem',
          width: '300px',
          margin: '0 auto 3rem',
          backgroundColor: '#262626',
          borderRadius: '4px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }} />

        {/* Grid skeleton */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '3rem'
        }}
        className="featured-grid-skeleton">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                aspectRatio: '4/3',
                backgroundColor: '#262626',
                borderRadius: '4px',
                gridColumn: (i % 7 === 2 || i % 7 === 5) ? 'span 2' : 'span 1',
                gridRow: (i % 7 === 2 || i % 7 === 5) ? 'span 2' : 'span 1',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                animationDelay: `${i * 0.05}s`
              }}
            />
          ))}
        </div>

        {/* Button skeleton */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            width: '200px',
            height: '48px',
            backgroundColor: '#262626',
            borderRadius: '4px',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }} />
        </div>
      </div>

      {/* Pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        @media (max-width: 1200px) {
          .featured-grid-skeleton {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
          }
        }
        @media (max-width: 768px) {
          .featured-grid-skeleton {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
            gap: 12px !important;
          }
          .featured-grid-skeleton > div {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
