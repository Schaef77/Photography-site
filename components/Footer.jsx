'use client';

import Link from 'next/link';

export default function Footer({ showInquiriesButton = true }) {
  return (
    <footer
      style={{
        backgroundColor: '#141414',
        padding: '60px 20px 40px 20px',
        borderTop: '1px solid rgba(201, 169, 97, 0.2)'
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        {/* Buttons Container - Equal spacing from center */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: showInquiriesButton ? '1fr auto auto 1fr' : '1fr',
            alignItems: 'center',
            gap: showInquiriesButton ? '40px' : '0',
            marginBottom: '40px'
          }}
        >
          {showInquiriesButton && <div></div>}

          {/* For Inquiries Button - hidden on contact page */}
          {showInquiriesButton && (
            <Link href="/contact">
              <button
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: '2px solid white',
                  borderRadius: '4px',
                  padding: '12px 28px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
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
                For Inquiries
              </button>
            </Link>
          )}

          {/* Instagram Icon */}
          <a
            href="https://instagram.com/adrianschaefer.photography"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              transition: 'color 0.3s ease',
              margin: showInquiriesButton ? '0' : '0 auto'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          {showInquiriesButton && <div></div>}
        </div>

        {/* Copyright Text */}
        <div
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: '1.8'
          }}
        >
          <div>All Photography</div>
          <div>©Copyright Adrian Schaefer Photography 2025</div>
          <div>No Unauthorized Use</div>
        </div>
      </div>
    </footer>
  );
}
