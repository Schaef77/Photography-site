import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from 'next/font/google';
import "./globals.css";
import LayoutClient from './layout-client';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat'
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = 'https://adrianschaeferphotography.vercel.app';
const siteName = 'Adrian Schaefer Photography';
const siteDescription = 'Travel, portrait, and street photography by Adrian Schaefer. Based in Vancouver and Kamloops, BC, Canada. Explore galleries from Amsterdam, Milan, Perpignan, and more.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Travel & Portrait Photographer`,
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  keywords: ['photography', 'travel photography', 'portrait photography', 'street photography', 'Vancouver photographer', 'Kamloops photographer', 'BC photographer', 'Canadian photographer', 'Adrian Schaefer'],
  authors: [{ name: 'Adrian Schaefer' }],
  creator: 'Adrian Schaefer',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} | Travel & Portrait Photographer`,
    description: siteDescription,
    images: [
      {
        url: '/images/galleries/amsterdam/amsterdam-20.jpg',
        width: 1200,
        height: 800,
        alt: 'Adrian Schaefer Photography - Travel and Portrait Photography',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | Travel & Portrait Photographer`,
    description: siteDescription,
    images: ['/images/galleries/amsterdam/amsterdam-20.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: 'google4be746e822485dd4',
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <html lang="en" className={montserrat.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Adrian Schaefer',
              jobTitle: 'Photographer',
              url: siteUrl,
              image: `${siteUrl}/images/galleries/amsterdam/amsterdam-20.jpg`,
              description: siteDescription,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Vancouver',
                addressRegion: 'BC',
                addressCountry: 'CA'
              },
              sameAs: []
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LayoutClient>
          <Analytics/>
          <SpeedInsights/>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
