import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { WalletProvider } from '@/context/WalletContext';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';

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
        <WalletProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </WalletProvider>
      </body>
    </html>
  );
}
