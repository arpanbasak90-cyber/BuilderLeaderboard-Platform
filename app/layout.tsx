import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BuilderBoard - Stellar Builder Leaderboard',
  description: 'Compete. Build. Earn XLM on the Stellar Network.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#0f0f1a] text-[#f1f5f9]`}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-[#2a2a4a] bg-[#0f0f1a] py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-[#94a3b8]">
              Powered by Stellar Soroban | {new Date().getFullYear()}
            </p>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
