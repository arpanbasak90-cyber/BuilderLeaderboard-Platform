"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import EntryGate from "@/components/EntryGate";
import WalletPickerModal from "@/components/WalletPickerModal";
import { useWallet } from "@/hooks/useWallet";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { Github, Sparkles, ShieldCheck } from "lucide-react";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isConnected } = useWallet();

  return (
    <>
      <EntryGate />
      <WalletPickerModal />
      {isConnected ? (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 animate-fade-in">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
          <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-10 transition-colors duration-300">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <img src="/logo-icon.svg" alt="BuilderBoard Logo" className="w-8 h-8 rounded-lg" />
                <div>
                  <span className="font-extrabold text-base text-gray-900 dark:text-white">
                    Builder<span className="text-purple-600 dark:text-purple-400">Board</span>
                  </span>
                  <p className="text-xs text-gray-500">The Gamified Leaderboard for Stellar Builders</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-gray-600 dark:text-gray-400">
                <Link href="/brand" className="flex items-center gap-1.5 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Brand Kit & Assets
                </Link>
                <a
                  href="https://github.com/arpanbasak90-cyber/BuilderLeaderboard-Platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub Repository
                </a>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Soroban Smart Contracts Verified
                </span>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500">
                © {new Date().getFullYear()} BuilderBoard · Built on Stellar
              </p>
            </div>
          </footer>
        </div>
      ) : (
        <div className="min-h-screen bg-white dark:bg-gray-950"></div>
      )}
      <Toaster />
    </>
  );
}
