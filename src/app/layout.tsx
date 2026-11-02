import type { Metadata } from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { SearchModal } from '@/components/SearchModal';
import { EntityDetailModal } from '@/components/EntityDetailModal';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';
import { CursorEffect } from '@/components/CursorEffect';
import { ArchivalHUD } from '@/components/ArchivalHUD';
import { ShortcutsModal } from '@/components/ShortcutsModal';
import { FilmGrainOverlay } from '@/components/FilmGrainOverlay';
import { GlobalSoundProvider } from '@/components/GlobalSoundProvider';
import { BlockWipeTransition } from '@/components/animations/BlockWipeTransition';
import Footer from '@/components/Footer';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MUSEO // Museum of Deep Time',
  description: 'Step into the Museum of Deep Time. Your ticket is a journey through 4.6 billion years.',
  keywords: ['Museum', 'Deep Time', 'Paleontology', 'History', 'Earth Evolution', 'WebGL', 'Three.js'],
  openGraph: {
    title: 'MUSEO // Museum of Deep Time',
    description: 'Step into the Museum of Deep Time. Your ticket is a journey through 4.6 billion years.',
    url: 'https://museo-deeptime.vercel.app',
    siteName: 'MUSEO',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body className="bg-[#F2EDE4] text-[#0E0E0E] font-space antialiased selection:bg-[#FFD400] selection:text-[#0E0E0E]">
        <SmoothScrollProvider>
          <AuthGuard>
            <GlobalSoundProvider />
            <FilmGrainOverlay />
            <CursorEffect />
            <ArchivalHUD />
            <Navbar />
            <SearchModal />
            <ShortcutsModal />
            <EntityDetailModal />
            <BlockWipeTransition>
              {children}
            </BlockWipeTransition>
            <Footer />
          </AuthGuard>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
