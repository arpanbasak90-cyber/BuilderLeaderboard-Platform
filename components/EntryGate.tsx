"use client";

import React, { useContext } from "react";
import { WalletContext } from "@/context/WalletContext";
import { Zap, ShieldCheck, Trophy, Crosshair, Coins } from "lucide-react";

export default function EntryGate() {
  const context = useContext(WalletContext);
  if (!context) return null;

  const { isConnected, setShowPicker } = context;

  if (isConnected) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-white overflow-hidden">
      {/* ── Ambient background layers ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(124,58,237,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-700/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-cyan-600/10 blur-[100px]" />
        {/* Scanline shimmer */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
      </div>

      {/* ── Main card ── */}
      <div className="relative z-10 w-full max-w-lg px-4">
        <div
          className="relative rounded-3xl overflow-hidden border border-white/[0.07] shadow-[0_0_80px_rgba(124,58,237,0.15)]"
          style={{ background: "linear-gradient(135deg, rgba(19,18,40,0.95) 0%, rgba(10,10,25,0.98) 100%)" }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-80" />

          <div className="px-8 pt-10 pb-10 flex flex-col items-center text-center gap-7">
            {/* Logo mark */}
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-purple-500/20 blur-xl scale-110" />
              <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/40 to-indigo-700/40 border border-purple-500/30 shadow-[0_0_24px_rgba(124,58,237,0.4)]">
                <Zap className="w-8 h-8 text-purple-300 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
              </div>
            </div>

            {/* Live badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
              <span className="text-[11px] font-semibold tracking-widest text-emerald-400 uppercase">Live on Stellar Testnet</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
                <span className="block text-white">Builder</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-300">
                  Board
                </span>
              </h1>
              <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">
                The gamified leaderboard for Stellar builders — compete in quests, climb ranks, and earn <span className="text-purple-300 font-semibold">XLM rewards</span>.
              </p>
            </div>

            {/* Feature pills */}
            <div className="grid grid-cols-3 gap-2 w-full">
              {[
                { icon: Trophy, label: "Compete", color: "text-amber-300", bg: "bg-amber-500/8 border-amber-500/20" },
                { icon: Crosshair, label: "Quests", color: "text-cyan-300", bg: "bg-cyan-500/8 border-cyan-500/20" },
                { icon: Coins, label: "Earn XLM", color: "text-emerald-300", bg: "bg-emerald-500/8 border-emerald-500/20" },
              ].map(({ icon: Icon, label, color, bg }) => (
                <div
                  key={label}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border ${bg} backdrop-blur-sm`}
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>{label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => setShowPicker(true)}
              className="w-full group relative flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-bold text-base text-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6366f1, #06b6d4)",
                boxShadow: "0 0 24px rgba(124,58,237,0.5), 0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-white/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Zap className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Connect Wallet to Enter</span>
            </button>

            {/* Supported wallets note */}
            <div className="flex items-center gap-2 text-[11px] text-gray-600">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
              <span>Freighter · xBull · LOBSTR</span>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-[10px] font-mono tracking-[0.2em] text-gray-700 uppercase">
          Powered by Stellar Soroban · Testnet
        </p>
      </div>
    </div>
  );
}
