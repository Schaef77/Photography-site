'use client';

import Image from 'next/image';

export default function AboutContent({ sections }) {
  return (
    <>
      <style jsx>{`
        .about-container {
          padding-top: 90px;
          padding-bottom: 80px;
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 32px;
          padding-right: 32px;
        }

        @media (max-width: 768px) {
          .about-container {
            padding-top: 120px;
          }
        }

        .about-title {
          color: white;
          font-size: 3rem;
          font-weight: 500;
          margin-bottom: 4rem;
          text-align: center;
          font-family: 'Montserrat', sans-serif;
        }

        .section-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
          margin-bottom: 4rem;
        }

        @media (min-width: 768px) {
          .section-grid {
            grid-template-columns: 1fr 1fr;
          }

          .image-right {
            order: 2;
          }

          .text-right {
            order: 1;
          }
        }

        .image-container {
          width: 100%;
          height: 350px;
          position: relative;
          overflow: hidden;
        }

        .text-container p {
          color: white;
          font-size: 1.125rem;
          line-height: 1.8;
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>

      <div className="about-container">
        <h1 className="about-title">About</h1>

        {sections.map((section, index) => (
          <div key={index} className="section-grid">
            {section.imageOnLeft ? (
              <>
                <div className="image-container">
                  <Image
                    src={section.image}
                    alt="Adrian Schaefer Photography"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                      objectFit: 'cover'
                    }}
                    quality={85}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
                <div className="text-container">
                  <p>{section.text}</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-container text-right">
                  <p>{section.text}</p>
                </div>
                <div className="image-container image-right">
                  <Image
                    src={section.image}
                    alt="Adrian Schaefer Photography"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                      objectFit: 'cover'
                    }}
                    quality={85}
                    loading="lazy"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
