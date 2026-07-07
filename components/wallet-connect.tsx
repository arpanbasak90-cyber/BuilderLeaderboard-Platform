"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";

export default function WalletConnect() {
  const {
    publicKey,
    balance,
    isConnected,
    isLoading,
    error,
    setShowPicker,
    disconnect,
    refreshBalance,
    fundAccount,
    sendTransaction,
  } = useWallet();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  const truncate = (key: string) =>
    `${key.slice(0, 4)}...${key.slice(-4)}`;

  const handleSend = async () => {
    setTxLoading(true);
    setTxError(null);
    setTxHash(null);
    try {
      const hash = await sendTransaction(destination, amount, memo);
      setTxHash(hash);
    } catch (err: any) {
      setTxError(err.message);
    } finally {
      setTxLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => setShowPicker(true)}
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
        >
          {isLoading ? "Connecting..." : "🔗 Connect Wallet"}
        </button>
        {error && (
          <p className="text-red-400 text-xs max-w-xs text-right">
            {error}{" "}
            {error.includes("not installed") && (
              <a
                href="https://freighter.app"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-purple-400"
              >
                Install Freighter
              </a>
            )}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Wallet Badge */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 bg-purple-900/50 border border-purple-500/40 rounded-lg px-3 py-2 text-sm hover:bg-purple-900/70 transition-all"
      >
        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
        <span className="text-white font-mono">{truncate(publicKey!)}</span>
        <span className="text-yellow-400 font-semibold">{balance} ✦</span>
        <span className="text-gray-400 text-xs">▼</span>
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 top-12 w-72 bg-gray-900 border border-purple-500/30 rounded-xl shadow-2xl z-50 p-4 flex flex-col gap-3">
          {/* Public Key */}
          <div>
            <p className="text-gray-400 text-xs mb-1">Public Key</p>
            <p className="text-white font-mono text-xs break-all">{publicKey}</p>
          </div>

          {/* Balance */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">XLM Balance (Testnet)</p>
              <p className="text-yellow-400 font-bold text-lg">{balance} ✦</p>
            </div>
            <button
              onClick={() => refreshBalance()}
              className="text-purple-400 hover:text-purple-300 text-xs border border-purple-500/30 px-2 py-1 rounded"
            >
              ↻ Refresh
            </button>
          </div>

          {/* Friendbot Fund */}
          <button
            onClick={fundAccount}
            disabled={isLoading}
            className="w-full bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 text-blue-300 text-xs py-2 rounded-lg transition-all disabled:opacity-50"
          >
            {isLoading ? "Funding..." : "🚰 Fund with Friendbot (10,000 XLM)"}
          </button>

          {/* Send XLM Toggle */}
          <button
            onClick={() => setShowSend(!showSend)}
            className="w-full bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-300 text-xs py-2 rounded-lg transition-all"
          >
            {showSend ? "✕ Cancel Send" : "➤ Send XLM"}
          </button>

          {/* Send XLM Form */}
          {showSend && (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Destination address (G...)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <input
                type="number"
                placeholder="Amount in XLM"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="Memo (optional)"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleSend}
                disabled={txLoading || !destination || !amount}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {txLoading ? "Sending..." : "Send XLM ✦"}
              </button>

              {txHash && (
                <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-2">
                  <p className="text-green-400 text-xs font-semibold">✅ Transaction Sent!</p>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 text-xs underline break-all"
                  >
                    View on Explorer ↗
                  </a>
                </div>
              )}

              {txError && (
                <p className="text-red-400 text-xs">{txError}</p>
              )}
            </div>
          )}

          {/* Disconnect */}
          <button
            onClick={() => { disconnect(); setShowDropdown(false); }}
            className="w-full bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 text-red-400 text-xs py-2 rounded-lg transition-all"
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}