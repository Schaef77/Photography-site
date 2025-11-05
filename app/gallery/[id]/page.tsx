import GalleryClient from './GalleryClient';
import galleriesData from '../../../data/galleries.json';

// Generate static params for all galleries at build time
export function generateStaticParams() {
  return galleriesData.map((gallery) => ({
    id: gallery.id,
  }));
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