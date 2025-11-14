'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GalleryScroll from '../../components/GalleryScroll';
import galleriesData from '../../data/galleries.json';

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
