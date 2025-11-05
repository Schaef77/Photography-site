'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fadeInTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(fadeInTimeout);
  }, []);

  const sections = [
    {
      image: '/images/about-shot/suitshot.JPG',
      text: 'Adrian Schaefer, a native of Vancouver, British Columbia, developed a profound appreciation for the outdoors, influenced by the surrounding ocean and mountains. Currently, he is pursuing his studies at Thompson Rivers University in Kamloops.',
      imageOnLeft: true
    },
    {
      image: '/images/about-shot/camerashot.jpeg',
      text: 'Utilizing a Fujifilm XT-4 camera, with his current favourite a 35mm f/2 prime lens, he specializes in landscape, street, and portrait photography while also experimenting with sports photography.',
      imageOnLeft: false
    },
    {
      image: '/images/about-shot/sportshot.jpeg',
      text: 'Adrian strives to present the world from a unique perspective, influenced by his experiences in diverse environments.',
      imageOnLeft: true
    },
    {
      image: '/images/about-shot/birdshot.jpeg',
      text: 'From a young age, he found pleasure in capturing the world from his lens and is eager to share this vision with others.',
      imageOnLeft: false
    },
    {
      image: '/images/about-shot/cornshot.JPG',
      text: 'Visitors are encouraged to explore his galleries and reach out for potential collaborations or projects.',
      imageOnLeft: true
    }
  ];

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

      <style jsx>{`
        .about-container {
          padding-top: 90px;
          padding-bottom: 80px;
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 32px;
          padding-right: 32px;
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
          overflow: hidden;
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
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
                  <img
                    src={section.image}
                    alt="Adrian Schaefer Photography"
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
                  <img
                    src={section.image}
                    alt="Adrian Schaefer Photography"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
