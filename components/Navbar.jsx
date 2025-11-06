'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Navbar({ isHomepage = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const mobileMenuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        // Check if click is not on hamburger button
        const hamburgerButton = event.target.closest('.hamburger-button');
        if (!hamburgerButton) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Scroll detection for transparent navbar on homepage
  useEffect(() => {
    if (!isHomepage) return;

    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        rafId = null;
      });
    };

    // Set initial scroll position
    setScrollY(window.scrollY);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isHomepage]);

  // Calculate navbar opacity based on scroll (0-20vh)
  const scrollThreshold = typeof window !== 'undefined' ? window.innerHeight * 0.2 : 200;
  const navOpacity = isHomepage ? Math.min(scrollY / scrollThreshold, 1) : 1;

  const linkStyle = {
    color: 'white',
    fontSize: '14px',
    letterSpacing: '0.05em',
    textDecoration: 'none',
    fontFamily: 'Montserrat, sans-serif',
    transition: 'color 0.3s'
  };

  const mobileLinkStyle = {
    color: 'white',
    fontSize: '16px',
    letterSpacing: '0.05em',
    textDecoration: 'none',
    fontFamily: 'Montserrat, sans-serif',
    padding: '15px 0',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    display: 'block',
    transition: 'color 0.3s'
  };

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: isHomepage ? `rgba(26, 31, 46, ${navOpacity})` : '#1a1f2e',
        boxShadow: isHomepage ? `0 2px 10px rgba(0,0,0,${0.5 * navOpacity})` : '0 2px 10px rgba(0,0,0,0.5)',
        zIndex: 9999,
        padding: '20px 32px',
        transition: isHomepage ? 'none' : 'background-color 0.3s, box-shadow 0.3s'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '100%',
          margin: '0 auto'
        }}>

          {/* Left Side - Instagram Icon */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-start'
            }}
            className="instagram-icon"
          >
            <a
              href="https://www.instagram.com/adrian.schaefer.photography/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'white',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>

          {/* Center - Logo */}
          <Link href="/" className="navbar-logo" style={{
            color: '#c9a961',
            fontSize: '24px',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            textDecoration: 'none',
            fontFamily: 'Bespoke Stencil, sans-serif',
            textShadow: isHomepage && navOpacity < 0.5 ? '0 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)' : 'none'
          }}>
            ADRIAN SCHAEFER PHOTOGRAPHY
          </Link>

          {/* Right Side - Desktop Navigation Links */}
          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '40px',
            alignItems: 'center'
          }}>
            {/* Desktop Links - Hidden on mobile */}
            <div style={{
              display: 'flex',
              gap: '40px',
              alignItems: 'center'
            }}
            className="desktop-nav">
              <Link
                href="/"
                style={linkStyle}
                onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
              >
                Home
              </Link>
              <Link
                href="/galleries"
                style={linkStyle}
                onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
              >
                Galleries
              </Link>
              <Link
                href="/contact"
                style={linkStyle}
                onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
              >
                Contact
              </Link>
              <Link
                href="/book"
                style={linkStyle}
                onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
              >
                Book
              </Link>
              <Link
                href="/about"
                style={linkStyle}
                onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
              >
                About
              </Link>
            </div>

            {/* Hamburger Button - Visible on mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '5px',
                transition: 'color 0.3s'
              }}
              className="hamburger-button"
              onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
              aria-label="Toggle menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {mobileMenuOpen ? (
                  // X icon when menu is open
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  // Hamburger icon when menu is closed
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          style={{
            position: 'fixed',
            top: '74px',
            left: '20px',
            right: '20px',
            backgroundColor: '#1a1f2e',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            zIndex: 9998,
            padding: '20px 32px',
            maxHeight: 'calc(100vh - 74px)',
            overflowY: 'auto'
          }}
          className="mobile-menu"
        >
          <Link
            href="/"
            style={mobileLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
            onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
          >
            Home
          </Link>
          <Link
            href="/galleries"
            style={mobileLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
            onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
          >
            Galleries
          </Link>
          <Link
            href="/contact"
            style={mobileLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
            onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
          >
            Contact
          </Link>
          <Link
            href="/book"
            style={mobileLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
            onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
          >
            Book
          </Link>
          <Link
            href="/about"
            style={{...mobileLinkStyle, borderBottom: 'none'}}
            onClick={() => setMobileMenuOpen(false)}
            onMouseEnter={(e) => e.currentTarget.style.color = '#c9a961'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
          >
            About
          </Link>
        </div>
      )}

      {/* CSS for responsive behavior */}
      <style jsx>{`
        @media (max-width: 1200px) {
          .desktop-nav {
            display: none !important;
          }
          .hamburger-button {
            display: block !important;
          }
        }
        @media (max-width: 600px) {
          .instagram-icon {
            display: none !important;
          }
          .navbar-logo {
            font-size: 16px !important;
            letter-spacing: 0.05em !important;
          }
        }
        @media (max-width: 450px) {
          .navbar-logo {
            font-size: 12px !important;
            letter-spacing: 0.03em !important;
          }
        }
        @media (min-width: 1201px) {
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
