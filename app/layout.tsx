'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '../components/Navbar';
import "./globals.css";
import { Montserrat } from 'next/font/google';
import { usePathname } from 'next/navigation';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  return (
   <html lang="en" className={montserrat.variable}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar isHomepage={isHomepage} />
        {children}
      </body>
    </html>
  );
}
