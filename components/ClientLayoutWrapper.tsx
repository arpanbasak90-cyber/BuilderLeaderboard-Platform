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
        <div className="flex flex-col min-h-screen animate-fade-in">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
          <footer className="border-t border-[#2a2a4a] bg-[#0f0f1a] py-6">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-[#94a3b8]">
                Powered by Stellar Soroban | {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </div>
      ) : (
        <div className="min-h-screen bg-[#09090e]"></div>
      )}
      <Toaster />
    </>
  );
}
