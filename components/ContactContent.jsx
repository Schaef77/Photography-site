'use client';

import ContactForm from './ContactForm';

export default function ContactContent() {
  return (
    <>
      <div className="px-8 max-w-4xl mx-auto contact-container" style={{ paddingTop: '90px', paddingBottom: '80px' }}>
        <h1 className="text-white text-5xl font-medium text-center" style={{ marginBottom: '25px' }}>
          Let's Create Together
        </h1>

        <p className="text-white text-lg leading-relaxed text-center" style={{ opacity: 0.9, marginBottom: '60px' }}>
          Have a project in mind? I'd love to hear about your vision and help bring it to life.
        </p>

        <ContactForm />
      </div>

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
    </>
  );
}
