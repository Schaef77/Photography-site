'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import './Masonry.css';

const useMedia = (queries, values, defaultValue) => {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue;
    return values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;
  };
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    // Set initial value on mount
    setValue(get());

    const handler = () => setValue(get());
    queries.forEach(q => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
  }, [queries]);

  return value;
};

const useMeasure = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
};

export default function Masonry({
  items,
  stagger = 0.03,
  scaleOnHover = true,
  hoverScale = 0.95,
  onImageClick
}) {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:375px)'],
    [5, 4, 3, 2],
    2
  );

  const [containerRef, { width }] = useMeasure();
  const hasAnimatedRef = useRef(false);
  const [visibleImages, setVisibleImages] = useState(new Set());
  const imageRefs = useRef({});

  const grid = useMemo(() => {
    if (!width) return { items: [], height: 0 };

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    const gridItems = items.map(child => {
      // Handle dividers - span full width
      if (child.isDivider) {
        const maxHeight = Math.max(...colHeights);
        // Reset all columns to same height for divider
        colHeights.fill(maxHeight);
        const y = maxHeight + 40; // Add spacing before divider
        colHeights.fill(y + 60); // Add divider height + spacing after

        return { ...child, x: 0, y, w: width, h: 1, isDivider: true };
      }

      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const height = child.height / 2;
      const y = colHeights[col];

      colHeights[col] += height;

      return { ...child, x, y, w: columnWidth, h: height };
    });

    // Calculate total height as the tallest column
    const totalHeight = Math.max(...colHeights);

    return { items: gridItems, height: totalHeight };
  }, [columns, items, width]);

  // Intersection Observer for lazy loading images
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imageId = entry.target.dataset.imageId;
            if (imageId) {
              setVisibleImages(prev => new Set([...prev, imageId]));
            }
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before the image is visible
        threshold: 0.01
      }
    );

    // Observe all image containers
    Object.values(imageRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [grid.items.length]);

  // Only animate ONCE on initial load
  useLayoutEffect(() => {
    if (hasAnimatedRef.current || grid.items.length === 0) return;

    grid.items.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;

      gsap.fromTo(selector,
        {
          opacity: 0,
          y: '+=30'
        },
        {
          opacity: 1,
          y: '-=30',
          duration: 0.6,
          ease: 'power3.out',
          delay: index * stagger
        }
      );
    });

    hasAnimatedRef.current = true;
  }, [grid.items, stagger]);

  const handleMouseEnter = (e, item) => {
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = (e, item) => {
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="masonry-list"
      style={{
        height: grid.height > 0 ? `${grid.height}px` : 'auto'
      }}
    >
      {grid.items.map((item, index) => {
        // Render divider
        if (item.isDivider) {
          return (
            <div
              key={item.id}
              data-key={item.id}
              className="masonry-divider"
              style={{
                transform: `translate3d(${item.x}px, ${item.y}px, 0)`,
                width: `${item.w}px`,
                height: '1px',
                backgroundColor: '#c9a961',
                opacity: 0.3,
                position: 'absolute'
              }}
            />
          );
        }

        // Render image
        const isVisible = visibleImages.has(item.id) || index < 3; // Always load first 3 images

        return (
          <div
            key={item.id}
            data-key={item.id}
            data-image-id={item.id}
            ref={(el) => {
              if (el) imageRefs.current[item.id] = el;
            }}
            className="masonry-item-wrapper"
            style={{
              transform: `translate3d(${item.x}px, ${item.y}px, 0)`,
              width: `${item.w}px`,
              height: `${item.h}px`,
              willChange: 'transform'
            }}
            onClick={() => onImageClick && onImageClick(item)}
            onMouseEnter={e => handleMouseEnter(e, item)}
            onMouseLeave={e => handleMouseLeave(e, item)}
          >
            <div className="masonry-item-img" style={{ position: 'relative' }}>
              {isVisible && (
                <Image
                  src={item.img}
                  alt={item.alt || 'Gallery image'}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                  style={{
                    objectFit: 'cover'
                  }}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  priority={index < 3}
                  placeholder={item.blurDataURL ? "blur" : "empty"}
                  blurDataURL={item.blurDataURL}
                />
              )}
              {!isVisible && item.blurDataURL && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${item.blurDataURL})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(20px)',
                    transform: 'scale(1.1)'
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}