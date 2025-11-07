import { Metadata } from 'next';
import GalleryClient from './GalleryClient';
import galleriesData from '../../../data/galleries.json';

const siteUrl = 'https://adrianschaeferphotography.vercel.app';

// Generate static params for all galleries at build time
export function generateStaticParams() {
  return galleriesData.map((gallery) => ({
    id: gallery.id,
  }));
}

// Generate metadata for each gallery
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const gallery = galleriesData.find(g => g.id === id);

  if (!gallery) {
    return {
      title: 'Gallery Not Found',
    };
  }

  const description = `View ${gallery.title} photography gallery by Adrian Schaefer. ${gallery.photos.length} photos from ${gallery.title}.`;
  const ogImage = gallery.thumbnail || (gallery.photos[0]?.src || '/images/galleries/amsterdam/amsterdam-20.jpg');

  return {
    title: gallery.title,
    description: description,
    openGraph: {
      title: `${gallery.title} | Adrian Schaefer Photography`,
      description: description,
      url: `${siteUrl}/gallery/${id}`,
      images: [
        {
          url: ogImage,
          width: gallery.thumbnailWidth || 1200,
          height: gallery.thumbnailHeight || 800,
          alt: `${gallery.title} - Photography by Adrian Schaefer`,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${gallery.title} | Adrian Schaefer Photography`,
      description: description,
      images: [ogImage],
    },
  };
}

export default async function GalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gallery = galleriesData.find(g => g.id === id);

  if (!gallery) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Gallery not found</p>
      </div>
    );
  }

  return <GalleryClient gallery={gallery} />;
}