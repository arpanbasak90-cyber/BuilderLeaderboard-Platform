"use client";

import React, { useContext } from "react";
import { WalletContext } from "@/context/WalletContext";
import { Zap, ShieldAlert, Award, Star, Compass } from "lucide-react";

export default function EntryGate() {
  const context = useContext(WalletContext);
  if (!context) return null;

  const { isConnected, setShowPicker } = context;

  if (isConnected) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col justify-center items-center bg-[#09090e] overflow-hidden p-4">
      {/* Background Neon Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none"></div>

      {/* Glassmorphic Portal Box */}
      <div className="relative w-full max-w-xl bg-[#131326]/60 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 md:p-12 shadow-2xl text-center space-y-8 animate-fade-in z-10">
        
        {/* Glowing Logo */}
        <div className="relative inline-flex items-center justify-center p-5 bg-purple-900/30 rounded-2xl border border-purple-500/30 shadow-[0_0_30px_rgba(124,58,237,0.3)] animate-pulse">
          <Zap className="h-12 w-12 text-purple-400" />
        </div>

        {/* Text Area */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-300 to-cyan-200">
            Welcome to BuilderBoard
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-md mx-auto leading-relaxed">
            A gamified leader-board tracking builders, quests, balances, and smart contracts on the Stellar ecosystem.
          </p>
        </div>

        {/* Highlight Badges */}
        <div className="grid grid-cols-3 gap-3 py-2 border-t border-b border-[#2a2a4a]">
          <div className="flex flex-col items-center p-2 rounded-xl bg-purple-950/20 text-purple-300">
            <Award className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Compete</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-cyan-950/20 text-cyan-300">
            <Compass className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Quest</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-emerald-950/20 text-emerald-300">
            <Star className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Earn XLM</span>
          </div>
        </div>

        {/* Connect Action */}
        <div className="space-y-4 pt-2">
          <button
            onClick={() => setShowPicker(true)}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transform hover:-translate-y-0.5 transition-all duration-200 text-base"
          >
            🔗 Connect Wallet to Enter
          </button>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
            <ShieldAlert className="h-4 w-4 text-cyan-500" />
            <span>freighter, xBull, or LOBSTR supported</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-6 text-xs text-gray-600 font-mono tracking-wider pointer-events-none z-10">
        POWERED BY STELLAR SOROBAN | TESTNET PASS
      </div>
    </div>
  );
}
