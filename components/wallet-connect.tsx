"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { ExternalLink, RefreshCw, Send, ChevronDown, Wallet, LogOut, Droplets } from "lucide-react";

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

  const truncate = (key: string) => `${key.slice(0, 4)}...${key.slice(-4)}`;

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
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={() => setShowPicker(true)}
          disabled={isLoading}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 shadow-sm"
        >
          <Wallet className="w-4 h-4" />
          {isLoading ? "Connecting…" : "Connect Wallet"}
        </button>
        {error && (
          <p className="text-red-500 text-xs max-w-xs text-right">
            {error}{" "}
            {error.includes("not installed") && (
              <a href="https://freighter.app" target="_blank" rel="noopener noreferrer" className="underline text-purple-600">
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
      {/* Wallet badge button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 bg-white border border-gray-200 hover:border-purple-300 rounded-lg px-3 py-2 text-sm transition-all shadow-sm hover:shadow"
      >
        <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
        <span className="text-gray-800 font-mono text-xs">{truncate(publicKey!)}</span>
        <span className="text-amber-600 font-semibold text-xs">{balance} XLM</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {/* Dropdown panel */}
      {showDropdown && (
        <div className="absolute right-0 top-12 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 mb-0.5">Connected Wallet</p>
            <p className="text-gray-800 font-mono text-xs break-all">{publicKey}</p>
          </div>

          <div className="p-4 space-y-3">
            {/* Balance */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">XLM Balance (Testnet)</p>
                <p className="text-xl font-bold text-gray-900">{balance} <span className="text-amber-500">✦</span></p>
              </div>
              <button
                onClick={() => refreshBalance()}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-purple-600 transition-colors"
                title="Refresh balance"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Friendbot */}
            <button
              onClick={fundAccount}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs py-2 rounded-xl transition-all disabled:opacity-50"
            >
              <Droplets className="w-3.5 h-3.5" />
              {isLoading ? "Funding…" : "Fund with Friendbot (10,000 XLM)"}
            </button>

            {/* Send XLM */}
            <button
              onClick={() => setShowSend(!showSend)}
              className="w-full flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs py-2 rounded-xl transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              {showSend ? "Cancel Send" : "Send XLM"}
            </button>

            {showSend && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Destination address (G...)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <input
                  type="number"
                  placeholder="Amount in XLM"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <input
                  type="text"
                  placeholder="Memo (optional)"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={txLoading || !destination || !amount}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 rounded-xl font-semibold disabled:opacity-50 transition-all"
                >
                  {txLoading ? "Sending…" : "Send XLM ✦"}
                </button>

                {txHash && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <p className="text-emerald-700 text-xs font-semibold mb-1">✅ Transaction Sent!</p>
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 text-xs underline flex items-center gap-1 break-all"
                    >
                      View on Explorer <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                )}
                {txError && <p className="text-red-500 text-xs">{txError}</p>}
              </div>
            )}

            {/* Disconnect */}
            <button
              onClick={() => { disconnect(); setShowDropdown(false); }}
              className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs py-2 rounded-xl transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}