"use client";

import { useState, useEffect } from "react";
import { callIncrementContract, getContractCount } from "@/lib/contract";
import { useWallet } from "@/hooks/useWallet";
import { useNetwork } from "@/context/NetworkContext";
import { logWalletInteraction } from "@/lib/telemetry";
import { Loader2, ExternalLink, Zap } from "lucide-react";

type WalletError = "WALLET_NOT_FOUND" | "USER_REJECTED" | "INSUFFICIENT_BALANCE";

function classifyError(err: unknown): WalletError {
  const msg = String(err).toLowerCase();
  console.error("FULL ERROR:", err);
  if (msg.includes("not found") || msg.includes("not installed") || msg.includes("undefined"))
    return "WALLET_NOT_FOUND";
  if (msg.includes("reject") || msg.includes("cancel") || msg.includes("denied") || msg.includes("user"))
    return "USER_REJECTED";
  return "INSUFFICIENT_BALANCE";
}

const ERROR_MESSAGES: Record<WalletError, string> = {
  WALLET_NOT_FOUND: "Wallet not found — please install Freighter or xBull.",
  USER_REJECTED: "Transaction rejected by user.",
  INSUFFICIENT_BALANCE: "Insufficient XLM balance for transaction fee.",
};

export default function CounterDemo() {
  const { publicKey, isConnected, setShowPicker } = useWallet();
  const { network, networkPassphrase } = useNetwork();
  const [count, setCount] = useState<number | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorType, setErrorType] = useState<WalletError | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    getContractCount(network).then(setCount).catch(() => setCount(0));
  }, [network]);

  async function incrementCounter() {
    if (!publicKey) return;
    setStatus("pending");
    setTxHash(null);
    setErrorType(null);
    setErrorMsg("");
    try {
      const freighter = await import("@stellar/freighter-api");
      const hash = await callIncrementContract(publicKey, async (xdr: string) => {
        const result = await freighter.signTransaction(xdr, {
          networkPassphrase,
        });
        if (result.error) throw new Error(`Sign error: ${result.error}`);
        return result.signedTxXdr;
      }, network);
      setTxHash(hash);
      const newCount = await getContractCount(network);
      setCount(newCount);
      setStatus("success");
      logWalletInteraction(publicKey, "contract_call", hash, `Called Counter Smart Contract: increment() on ${network}`);
    } catch (err) {
      setErrorType(classifyError(err));
      setErrorMsg(String(err));
      setStatus("error");
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <Zap className="h-4 w-4 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Smart Contract Demo</h3>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            CBVM5XWQ4P37XJXODWBMYDD4LXLZZGX4SN3VK3JKSLYBCUT3K7GVI2VH
          </p>
        </div>
      </div>

      {/* Counter Display */}
      <div className="text-center py-5 rounded-xl border border-gray-100 bg-gray-50">
        <span className="text-5xl font-mono font-bold text-purple-600">
          {count !== null ? count : "—"}
        </span>
        <p className="text-xs text-gray-400 mt-1">on-chain count</p>
      </div>

      {/* Actions */}
      {!isConnected ? (
        <button
          onClick={() => setShowPicker(true)}
          className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium text-sm transition-all"
        >
          Connect Wallet to Increment
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 flex-shrink-0"></span>
            <span className="text-emerald-700 text-xs font-mono truncate">
              {publicKey?.slice(0, 10)}...{publicKey?.slice(-10)}
            </span>
          </div>
          <button
            onClick={incrementCounter}
            disabled={status === "pending"}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
          >
            {status === "pending" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending transaction…
              </>
            ) : (
              "➕ Increment Counter"
            )}
          </button>
        </div>
      )}

      {/* Success */}
      {status === "success" && txHash && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm space-y-1">
          <p className="text-emerald-700 font-semibold">✅ Transaction confirmed!</p>
          <p className="text-gray-500 text-xs break-all font-mono">Hash: {txHash}</p>
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 text-xs font-medium"
          >
            View on Stellar Expert
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Error */}
      {status === "error" && errorType && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm space-y-1">
          <p className="text-red-600 font-medium">⚠️ {ERROR_MESSAGES[errorType]}</p>
          <p className="text-gray-400 text-xs">Type: <code className="font-mono">{errorType}</code></p>
          {errorMsg && <p className="text-gray-400 text-xs break-all">{errorMsg}</p>}
        </div>
      )}
    </div>
  );
}