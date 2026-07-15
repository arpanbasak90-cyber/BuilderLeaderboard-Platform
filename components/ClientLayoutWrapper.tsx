"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import EntryGate from "@/components/EntryGate";
import WalletPickerModal from "@/components/WalletPickerModal";
import { useWallet } from "@/hooks/useWallet";
import { Toaster } from "@/components/ui/toaster";

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
          <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 py-6 transition-colors duration-300">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Powered by Stellar Soroban · BuilderBoard {new Date().getFullYear()}
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
