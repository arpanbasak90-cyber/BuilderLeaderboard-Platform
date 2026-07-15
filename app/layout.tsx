import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NetworkProvider } from '@/context/NetworkContext';
import { WalletProvider } from '@/context/WalletContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BuilderBoard — Stellar Builder Leaderboard',
  description: 'Compete. Build. Earn XLM on the Stellar Network. The gamified leaderboard for Stellar builders.',
  keywords: ['Stellar', 'XLM', 'blockchain', 'leaderboard', 'quests', 'Soroban'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProvider>
          <NetworkProvider>
            <WalletProvider>
              <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            </WalletProvider>
          </NetworkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
