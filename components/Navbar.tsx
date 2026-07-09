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
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shadow-sm">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">BuilderBoard</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            ● Testnet
          </div>
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}
