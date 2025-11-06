'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ContactForm from '../../components/ContactForm';
import Footer from '../../components/Footer';

export default function Contact() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fadeInTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(fadeInTimeout);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 600ms ease-out',
        backgroundColor: '#141414'
      }}
    >
      <Navbar />

      <div className="px-8 max-w-4xl mx-auto contact-container" style={{ paddingTop: '90px', paddingBottom: '80px' }}>
        <h1 className="text-white text-5xl font-medium text-center" style={{ marginBottom: '25px' }}>
          Let's Create Together
        </h1>

        <p className="text-white text-lg leading-relaxed text-center" style={{ opacity: 0.9, marginBottom: '60px' }}>
          Have a project in mind? I'd love to hear about your vision and help bring it to life.
        </p>

        <ContactForm />
      </div>

      <Footer showInquiriesButton={false} />

      <style jsx>{`
        @media (max-width: 768px) {
          .contact-container {
            padding-top: 120px !important;
          }
        }
        @media (max-width: 480px) {
          .contact-container {
            padding-left: 2rem !important;
            padding-right: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
