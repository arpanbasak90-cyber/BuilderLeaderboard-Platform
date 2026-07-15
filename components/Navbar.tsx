'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Target, BarChart3, Activity, Sun, Moon, Network } from 'lucide-react';
import WalletConnect from '@/components/wallet-connect';
import { useTheme } from '@/context/ThemeContext';
import { useNetwork } from '@/context/NetworkContext';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { network, setNetwork } = useNetwork();
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);

  const navLinks = [
    { href: '/', label: 'Leaderboard', icon: Trophy },
    { href: '/quests', label: 'Quests', icon: Target },
    { href: '/stats', label: 'Stats', icon: BarChart3 },
    { href: '/analytics', label: 'Analytics', icon: Activity },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-950/80 shadow-sm transition-colors duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Premium Custom Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-95 select-none">
          <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-b from-purple-600 to-indigo-700 shadow-md">
            <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="25" y="55" width="10" height="20" rx="2" fill="white" opacity="0.4" />
              <rect x="45" y="40" width="10" height="35" rx="2" fill="white" opacity="0.6" />
              <rect x="65" y="25" width="10" height="50" rx="2" fill="white" opacity="0.8" />
              <path d="M52 15L25 52H48L38 85L75 42H50L52 15Z" fill="white" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
            Builder<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">Board</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-200 dark:shadow-none'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Network Switcher Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNetworkMenu(!showNetworkMenu)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold select-none cursor-pointer transition-all duration-200 ${
                network === 'mainnet'
                  ? 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                  : 'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${network === 'mainnet' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span className="capitalize">{network}</span>
            </button>
            
            {showNetworkMenu && (
              <div className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-1.5 shadow-lg z-50">
                <button
                  onClick={() => {
                    setNetwork('testnet');
                    setShowNetworkMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Stellar Testnet
                </button>
                <button
                  onClick={() => {
                    setNetwork('mainnet');
                    setShowNetworkMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Stellar Mainnet
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-purple-600 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <WalletConnect />
        </div>
      </div>

      {/* Mobile nav links bar */}
      <div className="md:hidden flex items-center justify-around border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 py-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 text-[10px] font-medium transition-all ${
                isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
