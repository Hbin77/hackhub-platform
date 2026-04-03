import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ClientProviders from '@/components/layout/ClientProviders';
import CommandPalette from '@/components/search/CommandPalette';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HackHub - 해커톤 플랫폼',
  description: '해커톤 참가, 팀 모집, 리더보드를 한곳에서',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`h-full ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-full flex flex-col">
        <ClientProviders>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CommandPalette />
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
