'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Counter from './Counter';

export default function GalleryScroll({ galleries, initialGalleryId }) {
  const router = useRouter();
  const containerRef = useRef(null);
  const scrollLeftRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const scrollTimeout = useRef(null);
  const animationFrame = useRef(null);
  const rafId = useRef(null);
  const lastScrollTime = useRef(0);
  const lastScrollLeft = useRef(0);
  const scrollVelocity = useRef(0);
  const galleryRefs = useRef([]);
  const windowDimensions = useRef({ width: 0, height: 0 });
  const visibleIndices = useRef(new Set());
  const hasScrolledToInitial = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  // Cache window dimensions and update on resize
  useEffect(() => {
    setMounted(true);

    const updateDimensions = () => {
      windowDimensions.current = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      setIsMobile(window.innerWidth < 768);
    };

    updateDimensions();

    // Graceful fade-in after a brief delay
    const fadeInTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateDimensions, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      clearTimeout(fadeInTimeout);
    };
  }, []);

  // Scroll to initial gallery if specified
  useEffect(() => {
    if (!initialGalleryId || !mounted || hasScrolledToInitial.current) return;

    const container = containerRef.current;
    if (!container) return;

    const galleryIndex = galleries.findIndex(g => g.id === initialGalleryId);
    if (galleryIndex === -1) return;

    // Wait for component to be fully mounted and visible
    const scrollTimeout = setTimeout(() => {
      const itemWidth = isMobile ? window.innerWidth * 0.28 : window.innerWidth * 0.25;
      const targetScroll = galleryIndex * itemWidth;
      container.scrollLeft = targetScroll;
      hasScrolledToInitial.current = true;
      setCurrentGalleryIndex(galleryIndex);
    }, 100);

    return () => clearTimeout(scrollTimeout);
  }, [initialGalleryId, mounted, galleries, isMobile]);

  // Optimized parallax update function
  const updateParallax = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    scrollLeftRef.current = scrollLeft;

    const itemWidth = isMobile ? windowDimensions.current.width * 0.28 : windowDimensions.current.width * 0.25;
    const viewportWidth = windowDimensions.current.width;

    // Only update visible galleries
    visibleIndices.current.forEach((index) => {
      const imageWrapper = galleryRefs.current[index]?.querySelector('[data-parallax-wrapper]');
      if (!imageWrapper) return;

      const itemLeft = index * itemWidth;
      const itemRight = itemLeft + itemWidth;

      // Calculate progress as item travels across viewport
      // When item enters from right: progress = -1
      // When item is centered: progress = 0
      // When item exits left: progress = 1
      const viewportLeft = scrollLeft;
      const viewportRight = scrollLeft + viewportWidth;

      // Total travel distance (from entering right edge to exiting left edge)
      const totalTravel = viewportWidth + itemWidth;

      // Current position in that travel (0 when entering right, totalTravel when exiting left)
      const currentTravel = viewportRight - itemRight;

      // Normalized progress from -1 to 1 spanning full viewport travel
      const progress = (currentTravel / totalTravel) * 2 - 1;

      // Image wrapper is 150% width positioned at -30%
      // With 50% extra width on each side, we can move ±28% safely
      // This ensures continuous parallax across the entire viewport travel
      const maxParallax = isMobile ? 3 : 28; // Small parallax on mobile to prevent disappearing
      const parallaxAmount = progress * maxParallax;

      // Use translate3d for better GPU acceleration
      imageWrapper.style.transform = `translate3d(${parallaxAmount}%, 0, 0)`;
    });
  };

  // Intersection Observer for visibility tracking
  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.dataset.index, 10);
          if (entry.isIntersecting) {
            visibleIndices.current.add(index);
          } else {
            visibleIndices.current.delete(index);
          }
        });
      },
      {
        root: containerRef.current,
        rootMargin: isMobile ? '0% 20% 0% 20%' : '50% 150% 50% 150%', // Very tight margin on mobile
        threshold: 0
      }
    );

    galleryRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [mounted, galleries.length, isMobile]);

  // Initialize parallax positions after component mounts and Intersection Observer has run
  useEffect(() => {
    if (!mounted) return;

    // Wait for Intersection Observer callbacks to complete
    const timer = setTimeout(() => {
      if (visibleIndices.current.size > 0) {
        updateParallax();
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [mounted]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY + e.deltaX;
    };

    const handleScroll = () => {
      const currentTime = performance.now();
      const currentScroll = container.scrollLeft;

      // Calculate velocity
      const timeDelta = currentTime - lastScrollTime.current;
      const scrollDelta = currentScroll - lastScrollLeft.current;
      scrollVelocity.current = Math.abs(scrollDelta / timeDelta);

      lastScrollTime.current = currentTime;
      lastScrollLeft.current = currentScroll;

      // Update current gallery index based on scroll position
      const isMobileNow = windowDimensions.current.width < 768;
      const itemWidth = isMobileNow ? windowDimensions.current.width * 0.28 : windowDimensions.current.width * 0.25;
      const viewportCenter = windowDimensions.current.width / 2;
      const paddingLeft = isMobileNow ? windowDimensions.current.width * 0.36 : windowDimensions.current.width * 0.375;

      // Find which gallery center is closest to viewport center
      let closestIndex = 0;
      let minDistance = Infinity;

      galleries.forEach((_, index) => {
        const itemCenter = paddingLeft + (index * itemWidth) + (itemWidth / 2) - currentScroll;
        const distance = Math.abs(itemCenter - viewportCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setCurrentGalleryIndex(closestIndex);

      // Cancel any pending RAF to avoid duplicate updates
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      // Update parallax on next frame
      rafId.current = requestAnimationFrame(updateParallax);

      setIsScrolling(true);

      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Adjust timeout based on velocity - faster scroll = longer wait
      const velocityFactor = Math.min(scrollVelocity.current * 100, 500);
      const dynamicTimeout = 300 + velocityFactor;

      // Set new timeout to snap after scrolling stops
      scrollTimeout.current = setTimeout(() => {
        snapToNearest();
        setIsScrolling(false);
      }, dynamicTimeout);
    };

    const snapToNearest = () => {
      const itemWidth = isMobile ? windowDimensions.current.width * 0.28 : windowDimensions.current.width * 0.25;
      const currentScroll = container.scrollLeft;
      const nearestIndex = Math.round(currentScroll / itemWidth);
      const targetScroll = nearestIndex * itemWidth;

      // Custom smooth animation with ease-in-out
      const startScroll = currentScroll;
      const distance = targetScroll - startScroll;
      const duration = 600;
      const startTime = performance.now();

      // Ease-in-out function - starts slow, speeds up, then slows down
      const easeInOutCubic = (t) => {
        return t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        container.scrollLeft = startScroll + (distance * easedProgress);

        if (progress < 1) {
          animationFrame.current = requestAnimationFrame(animate);
        }
      };

      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      animationFrame.current = requestAnimationFrame(animate);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  const currentGallery = Math.min(Math.max(currentGalleryIndex + 1, 1), galleries.length);

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen overflow-hidden"
      style={{
        paddingTop: isMobile ? '84px' : '145px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 600ms ease-out',
        backgroundColor: '#141414'
      }}
    >
      <div
        ref={containerRef}
        className="h-full overflow-x-scroll overflow-y-hidden"
        style={{
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  WebkitOverflowScrolling: 'touch'
}}
      >
        <div
          style={{
            display: 'flex',
            alignItems: isMobile ? 'center' : 'flex-start',
            height: '100%',
            paddingLeft: isMobile ? '36vw' : '37.5vw',
            width: isMobile ? `${galleries.length * 28 + 72}vw` : `${galleries.length * 25 + 75}vw`
          }}
        >
          {galleries.map((gallery, index) => {
            return (
              <div
                key={gallery.id}
                ref={(el) => (galleryRefs.current[index] = el)}
                data-index={index}
                onClick={() => router.push(`/gallery/${gallery.id}`)}
                style={{
                  flexShrink: 0,
                  width: isMobile ? '28vw' : '25vw',
                  paddingTop: isMobile ? '2vh' : '1.5vw',
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: isMobile ? '25vw' : '22vw',
                    height: isMobile ? '35vh' : '60vh',
                    overflow: 'hidden',
                    margin: '0 auto'
                  }}
                >
                  <div
                    data-parallax-wrapper
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '-30%',
                      width: '150%',
                      height: '100%',
                      willChange: 'transform',
                      transform: 'translate3d(0, 0, 0)'
                    }}
                  >
                    <Image
                      src={gallery.image}
                      alt={gallery.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                      priority={index < 3}
                    />
                  </div>
                  
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: '24px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      pointerEvents: 'none',
                      zIndex: 10,
                      textAlign: 'center'
                    }}
                  >
                   <h2 style={{
  fontSize: isMobile ? '18px' : '22px',
  fontWeight: 500,
  color: 'white',
  margin: 0,
  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
  fontFamily: 'var(--font-montserrat), sans-serif'
}}>
                      {gallery.title}
                    </h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animated Counter */}
      <div style={{
        position: 'fixed',
        bottom: isMobile ? '30px' : '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Counter
          value={currentGallery}
          places={[10, 1]}
          fontSize={25}
          padding={5}
          gap={4}
          textColor="white"
          fontWeight={400}
          containerStyle={{ display: 'inline-block' }}
          gradientHeight={0}
          digitStyle={{ overflow: 'hidden' }}
        />
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}