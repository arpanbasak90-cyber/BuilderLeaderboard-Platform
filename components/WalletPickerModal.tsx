"use client";

import React, { useContext } from "react";
import { WalletContext } from "@/context/WalletContext";
import { X, Wallet, Loader2 } from "lucide-react";

export default function WalletPickerModal() {
  const context = useContext(WalletContext);
  if (!context) return null;

  const { showPicker, setShowPicker, connect, isLoading, error } = context;

  if (!showPicker) return null;

  const WALLETS = [
    { id: "freighter", name: "Freighter", subtitle: "Standard Stellar wallet extension", emoji: "🟣", recommended: true },
    { id: "xbull", name: "xBull", subtitle: "Advanced wallet for power users", emoji: "🔵", recommended: false },
    { id: "lobstr", name: "LOBSTR", subtitle: "Popular mobile & web wallet", emoji: "🟠", recommended: false },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-sm bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Connect Wallet</h3>
          </div>
          <button
            onClick={() => setShowPicker(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          <p className="text-xs text-gray-500">
            Select your Stellar wallet to connect to BuilderBoard and start earning XP &amp; XLM.
          </p>

          {/* Wallet options */}
          <div className="space-y-2">
            {WALLETS.map((w) => (
              <button
                key={w.id}
                onClick={() => connect(w.id)}
                disabled={isLoading}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-xl text-left transition-all group disabled:opacity-50"
              >
                <span className="text-2xl">{w.emoji}</span>
                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-900 group-hover:text-purple-700">
                    {w.name}
                    {w.recommended && (
                      <span className="ml-2 text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full font-medium">Recommended</span>
                    )}
                  </span>
                  <span className="block text-xs text-gray-400">{w.subtitle}</span>
                </div>
                <span className="text-gray-300 group-hover:text-purple-400 transition-colors">→</span>
              </button>
            ))}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center items-center py-2 gap-2 text-sm text-purple-600 font-medium">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Requesting wallet authorization…</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 text-center">
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
