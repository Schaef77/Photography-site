'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import galleriesData from '../../data/galleries.json';

// Dynamically import GalleryScroll to reduce initial bundle size
const GalleryScroll = dynamic(() => import('../../components/GalleryScroll'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '100vh', backgroundColor: '#141414' }} />
});

function GalleriesContent() {
  const searchParams = useSearchParams();
  const galleryId = searchParams.get('gallery');

  const galleries = galleriesData.map(gallery => ({
    id: gallery.id,
    title: gallery.title,
    image: gallery.thumbnail,
    blurDataURL: gallery.blurDataURL
  }));

  return <GalleryScroll galleries={galleries} initialGalleryId={galleryId} />;
}

export default function Galleries() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#141414' }} />}>
      <GalleriesContent />
    </Suspense>
  );
}
