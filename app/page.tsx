import { Suspense } from 'react';
import Footer from '../components/Footer';
import FeaturedGallery from '../components/FeaturedGallery';
import FeaturedGalleryLoading from '../components/FeaturedGalleryLoading';
import HeroSection from '../components/HeroSection';
import featuredImages from '../data/featured-images.json';

export default function Home() {
  return (
    <div style={{ backgroundColor: '#141414' }}>
      {/* Hero Section - 75% Viewport */}
      <HeroSection />

      {/* Featured Gallery with Suspense */}
      <Suspense fallback={<FeaturedGalleryLoading />}>
        <FeaturedGallery images={featuredImages} />
      </Suspense>

      <Footer />
    </div>
  );
}
