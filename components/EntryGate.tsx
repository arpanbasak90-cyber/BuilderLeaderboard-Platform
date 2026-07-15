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
    <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-slate-100 overflow-hidden">
      {/* ── Ambient animated background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-purple-300/30 blur-[130px] animate-pulse-glow" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-indigo-300/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: "-2s" }} />
        <div className="absolute bottom-[-50px] right-[-50px] w-[450px] h-[450px] rounded-full bg-cyan-300/15 blur-[100px] animate-pulse-glow" style={{ animationDelay: "-4s" }} />
      </div>

      {/* ── Main Card ── */}
      <div className="relative z-10 w-full max-w-lg px-4 animate-fade-in">
        <div className="relative rounded-3xl overflow-hidden border border-gray-300 bg-white shadow-2xl">
          {/* Animated top highlight line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 via-cyan-400 to-transparent animate-shimmer" />

          <div className="px-8 pt-12 pb-10 flex flex-col items-center text-center gap-8">

            {/* Logo Mark */}
            <div className="relative select-none animate-float">
              <div className="absolute inset-[-8px] rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-400 blur-lg opacity-25" />
              <div className="relative flex items-center justify-center w-20 h-20 bg-white border border-gray-200 rounded-2xl shadow-md">
                <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <rect x="22" y="52" width="14" height="23" rx="3" fill="url(#logoGrad)" opacity="0.6" />
                  <rect x="43" y="34" width="14" height="41" rx="3" fill="url(#logoGrad)" />
                  <rect x="64" y="44" width="14" height="31" rx="3" fill="url(#logoGrad)" opacity="0.8" />
                  <path d="M50 11 L53.5 19 L62 19 L55 24 L58 32 L50 27 L42 32 L45 24 L38 19 L46.5 19 Z" fill="#eab308" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Network Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-300 bg-emerald-50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
                Live on Stellar {currentNetwork}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                <span className="text-gray-900">Builder</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 ml-2">
                  Board
                </span>
              </h1>
              <p className="text-sm text-gray-700 max-w-sm mx-auto leading-relaxed font-medium">
                The premier gamified arena for Stellar developers. Battle in quests, conquer ranks, and earn{" "}
                <span className="text-purple-700 font-bold">XLM bounties</span>.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-3 w-full">
              {[
                { icon: Trophy,    label: "Compete",  color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
                { icon: Crosshair, label: "Quests",   color: "text-cyan-700",   bg: "bg-cyan-50 border-cyan-200"     },
                { icon: Coins,     label: "Earn XLM", color: "text-emerald-700",bg: "bg-emerald-50 border-emerald-200"},
              ].map(({ icon: Icon, label, color, bg }) => (
                <div key={label} className={`flex flex-col items-center gap-2 py-3 rounded-2xl border ${bg}`}>
                  <div className="p-1.5 rounded-xl bg-white shadow-sm border border-gray-200">
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <span className="text-[12px] font-extrabold uppercase tracking-wide text-gray-900">{label}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowPicker(true)}
              className="w-full group relative flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-base text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_32px_rgba(99,102,241,0.4)] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5, #0891b2)" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-white/15 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">Connect Wallet to Enter</span>
            </button>

            {/* Wallet support */}
            <div className="flex items-center gap-2 text-[12px] text-gray-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
              <span>Supports Freighter · xBull · LOBSTR</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[11px] font-mono tracking-[0.2em] text-gray-500 font-semibold uppercase">
          Powered by Stellar Soroban ·{" "}
          {currentNetwork === "mainnet"
            ? "Mainnet Enabled"
            : currentNetwork === "localhost"
            ? "Localhost Standalone"
            : "Testnet Network"}
        </p>
      </div>
    </div>
  );
}
