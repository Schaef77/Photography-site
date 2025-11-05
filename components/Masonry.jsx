'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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

const preloadImages = async urls => {
  await Promise.all(
    urls.map(
      src =>
        new Promise(resolve => {
          const img = window.Image ? new window.Image() : document.createElement('img');
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

export default function Masonry({
  items,
  stagger = 0.03,
  scaleOnHover = true,
  hoverScale = 0.95,
  onImageClick
}) {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [5, 4, 3, 2],
    1
  );

  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const grid = useMemo(() => {
    if (!width) return { items: [], height: 0 };

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    const gridItems = items.map(child => {
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

  // Only animate ONCE on initial load
  useLayoutEffect(() => {
    if (!imagesReady || hasAnimatedRef.current) return;

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
  }, [grid.items, imagesReady, stagger]);

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
      {grid.items.map(item => {
        return (
          <div
            key={item.id}
            data-key={item.id}
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
              <Image
                src={item.img}
                alt={item.alt || 'Gallery image'}
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                style={{
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}