"use client";

import React, { useContext } from "react";
import { WalletContext } from "@/context/WalletContext";
import { X } from "lucide-react";

export default function WalletPickerModal() {
  const context = useContext(WalletContext);
  if (!context) return null;

  const { showPicker, setShowPicker, connect, isLoading, error } = context;

  if (!showPicker) return null;

  const WALLETS = [
    { id: "freighter", name: "Freighter Wallet", icon: "🟣", subtitle: "Standard Stellar wallet extension" },
    { id: "xbull", name: "xBull Wallet", icon: "🔵", subtitle: "Advanced wallet for power users" },
    { id: "lobstr", name: "LOBSTR Wallet", icon: "🟠", subtitle: "Popular mobile & web wallet" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-[#1a1a2e] border border-purple-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-[#2a2a4a]">
          <h3 className="text-xl font-bold text-white">Connect Stellar Wallet</h3>
          <button
            onClick={() => setShowPicker(false)}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-400">
          Select your preferred Stellar wallet extension to interact with BuilderBoard leaderboard, quests, payments, and smart contracts.
        </p>

        {/* Wallets */}
        <div className="space-y-3">
          {WALLETS.map((w) => (
            <button
              key={w.id}
              onClick={() => connect(w.id)}
              disabled={isLoading}
              className="w-full flex items-center gap-4 px-4 py-3.5 bg-[#0f0f1a] hover:bg-[#25253e] border border-[#2a2a4a] hover:border-purple-500/50 rounded-xl text-left transition-all group disabled:opacity-50"
            >
              <span className="text-3xl bg-gray-900 p-1.5 rounded-lg group-hover:scale-105 transition-transform duration-200">
                {w.icon}
              </span>
              <div>
                <span className="block font-semibold text-white group-hover:text-purple-400 transition-colors">
                  {w.name}
                </span>
                <span className="block text-[10px] text-gray-400">
                  {w.subtitle}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-2 gap-2 text-sm text-purple-400 font-medium">
            <span className="animate-spin text-lg">⏳</span>
            <span>Requesting wallet authorization...</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 rounded-xl text-xs text-red-400 break-all text-center">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}
