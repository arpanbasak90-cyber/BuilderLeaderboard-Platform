'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Trophy, Target, BarChart3, Activity } from 'lucide-react';
import WalletConnect from '@/components/wallet-connect';


export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Leaderboard', icon: Trophy },
    { href: '/quests', label: 'Quests', icon: Target },
    { href: '/stats', label: 'Stats', icon: BarChart3 },
    { href: '/analytics', label: 'Analytics', icon: Activity },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#2a2a4a] bg-[#0f0f1a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0f0f1a]/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Zap className="h-8 w-8 text-[#7c3aed]" />
          <span className="text-xl font-bold text-[#f1f5f9]">BuilderBoard</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#7c3aed] text-white'
                    : 'text-[#94a3b8] hover:bg-[#1a1a2e] hover:text-[#f1f5f9]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
<div className="flex items-center gap-3">
         <div className="rounded-full border border-[#2a2a4a] bg-[#1a1a2e] px-3 py-1 text-xs font-medium text-[#06b6d4]">
            Stellar Network: Testnet
         </div>
         <WalletConnect />
</div>
        </div>
    </nav>
  );
}
