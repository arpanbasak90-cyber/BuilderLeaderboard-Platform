"use client";

import React, { useContext } from "react";
import { WalletContext } from "@/context/WalletContext";
import { NetworkContext } from "@/context/NetworkContext";
import { ShieldCheck, Trophy, Crosshair, Coins } from "lucide-react";

export default function EntryGate() {
  const walletContext = useContext(WalletContext);
  const networkContext = useContext(NetworkContext);

  if (!walletContext) return null;

  const { isConnected, setShowPicker } = walletContext;
  const currentNetwork = networkContext?.network ?? "testnet";

  if (isConnected) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-gray-950 overflow-hidden">
      {/* ── Ambient premium animated background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Subtle grid with gradient mask */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139, 92, 246, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        
        {/* Dynamic Glow Orbs */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-purple-600/10 blur-[130px] animate-pulse-glow" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: "-2s" }} />
        <div className="absolute bottom-[-50px] right-[-50px] w-[450px] h-[450px] rounded-full bg-cyan-500/8 blur-[100px] animate-pulse-glow" style={{ animationDelay: "-4s" }} />
      </div>

      {/* ── Main Premium Card ── */}
      <div className="relative z-10 w-full max-w-lg px-4 animate-fade-in">
        <div
          className="relative rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_0_80px_rgba(139,92,246,0.2)] backdrop-blur-md"
          style={{ background: "linear-gradient(135deg, rgba(17,12,38,0.95) 0%, rgba(8,8,20,0.98) 100%)" }}
        >
          {/* Animated top highlight line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 via-cyan-400 to-transparent animate-shimmer" />

          <div className="px-8 pt-12 pb-10 flex flex-col items-center text-center gap-8">
            {/* Custom Logo Mark */}
            <div className="relative select-none animate-float">
              {/* Outer soft shadow */}
              <div className="absolute inset-[-8px] rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 blur-lg opacity-50" />
              
              {/* Premium hexagonal container */}
              <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-500/40 rounded-2xl shadow-[inset_0_2px_10px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.8)]">
                {/* SVG Logo */}
                <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="50%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                  {/* Leaderboard representation back bars */}
                  <rect x="25" y="55" width="10" height="20" rx="2" fill="url(#logoGrad)" opacity="0.4" />
                  <rect x="45" y="40" width="10" height="35" rx="2" fill="url(#logoGrad)" opacity="0.6" />
                  <rect x="65" y="25" width="10" height="50" rx="2" fill="url(#logoGrad)" opacity="0.8" />
                  {/* Overlay lightning bolt */}
                  <path d="M52 15L25 52H48L38 85L75 42H50L52 15Z" fill="url(#logoGrad)" stroke="#0f172a" strokeWidth="3" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Network Badge */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10`}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                Live on Stellar {currentNetwork}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Builder
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 ml-2">
                  Board
                </span>
              </h1>
              <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
                The premier gamified arena for Stellar developers. Battle in quests, conquer ranks, and earn <span className="text-purple-300 font-semibold">XLM bounties</span>.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-3 w-full">
              {[
                { icon: Trophy, label: "Compete", color: "text-purple-300", bg: "bg-purple-500/5 border-purple-500/15" },
                { icon: Crosshair, label: "Quests", color: "text-cyan-300", bg: "bg-cyan-500/5 border-cyan-500/15" },
                { icon: Coins, label: "Earn XLM", color: "text-emerald-300", bg: "bg-emerald-500/5 border-emerald-500/15" },
              ].map(({ icon: Icon, label, color, bg }) => (
                <div
                  key={label}
                  className={`flex flex-col items-center gap-2 py-3 rounded-2xl border ${bg} backdrop-blur-md`}
                >
                  <div className="p-1.5 rounded-xl bg-white/[0.02]">
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider text-gray-300`}>{label}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowPicker(true)}
              className="w-full group relative flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-semibold text-base text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_32px_rgba(139,92,246,0.4)] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5, #0891b2)",
              }}
            >
              {/* Shimmer light effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-white/15 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center gap-2">
                Connect Wallet to Enter
              </span>
            </button>

            {/* Wallets */}
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
              <span>Supports Freighter · xBull · LOBSTR</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-[10px] font-mono tracking-[0.25em] text-gray-600 uppercase">
          Powered by Stellar Soroban · {currentNetwork === "mainnet" ? "Mainnet Enabled" : "Testnet Network"}
        </p>
      </div>
    </div>
  );
}
