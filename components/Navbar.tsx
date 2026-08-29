'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Target, BarChart3, Activity, Sun, Moon, Network, Sparkles } from 'lucide-react';
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
    { href: '/brand', label: 'Brand Kit', icon: Sparkles },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/80 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-950/80 shadow-sm transition-colors duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Official Brand Logo */}
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98] select-none group">
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden shadow-md shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
            <img src="/logo-icon.svg" alt="BuilderBoard Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
              Builder<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400">Board</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase mt-0.5">
              Stellar Soroban
            </span>
          </div>
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
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-200 dark:shadow-none font-bold'
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
          {/* Level 5 Blue Belt Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full belt-blue text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>Blue Belt (Level 5)</span>
          </div>

          {/* Network Switcher & Latency Indicator */}
          <div className="relative">
            <button
              onClick={() => setShowNetworkMenu(!showNetworkMenu)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold select-none cursor-pointer transition-all duration-200 ${
                network === 'mainnet'
                  ? 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                  : network === 'localhost'
                  ? 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                  : 'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${network === 'mainnet' ? 'bg-amber-500' : network === 'localhost' ? 'bg-blue-500' : 'bg-emerald-500 animate-pulse'}`} />
              <span className="capitalize">{network}</span>
              <span className="text-[10px] opacity-70 font-mono">18ms</span>
            </button>
            
            {showNetworkMenu && (
              <div className="absolute right-0 mt-2 w-44 origin-top-right rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-2 shadow-xl z-50">
                <p className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Stellar Horizon</p>
                <button
                  onClick={() => {
                    setNetwork('testnet');
                    setShowNetworkMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Testnet
                  </span>
                  <span className="text-[10px] text-emerald-600 font-mono">Active</span>
                </button>
                <button
                  onClick={() => {
                    setNetwork('mainnet');
                    setShowNetworkMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Mainnet
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Public</span>
                </button>
                <button
                  onClick={() => {
                    setNetwork('localhost');
                    setShowNetworkMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Localhost
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">:8000</span>
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-purple-600 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
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
