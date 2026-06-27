"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { incrementCounter, getCounterValue } from "@/lib/contract";

type Status = "idle" | "pending" | "success" | "error";

export default function CounterDemo() {
  const { publicKey, isConnected, connect } = useWallet();

  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIncrement = async () => {
    setError(null);
    setTxHash(null);

    if (!isConnected || !publicKey) {
      try {
        await connect();
      } catch (err: any) {
        setStatus("error");
        setError(err.message || "Wallet not found or connection rejected.");
        return;
      }
      return;
    }

    setStatus("pending");
    try {
      const { value, hash } = await incrementCounter(publicKey);
      setCount(value);
      setTxHash(hash);
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      // Distinguish a few common error types for clearer feedback
      const message: string = err?.message || "Unknown error";
      if (message.toLowerCase().includes("rejected")) {
        setError("Transaction was rejected in your wallet.");
      } else if (message.toLowerCase().includes("insufficient")) {
        setError("Insufficient balance to cover transaction fees.");
      } else if (message.toLowerCase().includes("not installed")) {
        setError("Wallet not found. Please install Freighter.");
      } else {
        setError(message);
      }
    }
  };

  const handleRefresh = async () => {
    if (!publicKey) return;
    try {
      const value = await getCounterValue(publicKey);
      setCount(value);
    } catch (err: any) {
      setError(err.message || "Failed to read counter.");
    }
  };

  return (
    <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-6 max-w-md">
      <h3 className="text-lg font-semibold text-[#f1f5f9] mb-1">
        On-Chain Counter (Soroban Contract)
      </h3>
      <p className="text-sm text-[#94a3b8] mb-4">
        A minimal smart contract deployed on Stellar Testnet. Each click calls{" "}
        <code className="text-[#06b6d4]">increment()</code> on-chain.
      </p>

      <div className="flex items-center justify-between mb-4 bg-[#0f0f1a] rounded-lg px-4 py-3">
        <span className="text-[#94a3b8] text-sm">Current Count</span>
        <span className="text-2xl font-bold text-[#7c3aed]">
          {count !== null ? count : "—"}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleIncrement}
          disabled={status === "pending"}
          className="flex-1 rounded-lg bg-[#7c3aed] py-2 text-sm font-medium text-white transition-all hover:bg-[#9d4edd] disabled:opacity-50"
        >
          {!isConnected
            ? "Connect Wallet"
            : status === "pending"
            ? "Sending..."
            : "Increment Counter"}
        </button>
        {isConnected && (
          <button
            onClick={handleRefresh}
            className="rounded-lg border border-[#2a2a4a] px-3 py-2 text-sm text-[#94a3b8] hover:border-[#7c3aed] transition-all"
          >
            ↻
          </button>
        )}
      </div>

      {/* Status feedback */}
      {status === "pending" && (
        <div className="mt-3 flex items-center gap-2 text-yellow-400 text-sm">
          <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
          Transaction pending...
        </div>
      )}

      {status === "success" && txHash && (
        <div className="mt-3 bg-green-900/30 border border-green-500/30 rounded-lg p-3">
          <p className="text-green-400 text-sm font-semibold mb-1">
            ✅ Contract call successful!
          </p>
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-xs underline break-all"
          >
            View transaction on Explorer ↗
          </a>
        </div>
      )}

      {status === "error" && error && (
        <div className="mt-3 bg-red-900/30 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-400 text-sm">❌ {error}</p>
        </div>
      )}
    </div>
  );
}
