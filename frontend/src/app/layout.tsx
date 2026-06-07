import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GameStats — Unified Gaming Profile',
  description: 'Track your stats across Valorant, CS2 and more in one place.',
  themeColor: '#0d0d0f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-white antialiased">
        {children}
      </body>
    </html>
  );
}
