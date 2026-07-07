"use client";

import { useState, useEffect } from "react";
import { callIncrementContract, getContractCount } from "@/lib/contract";
import { useWallet } from "@/hooks/useWallet";
import { logWalletInteraction } from "@/lib/telemetry";

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
  WALLET_NOT_FOUND: "❌ Wallet not found — please install Freighter or xBull.",
  USER_REJECTED: "⚠️ Transaction rejected by user.",
  INSUFFICIENT_BALANCE: "💸 Insufficient XLM balance for transaction fee.",
};

export default function CounterDemo() {
  const { publicKey, isConnected, setShowPicker } = useWallet();
  const [count, setCount] = useState<number | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorType, setErrorType] = useState<WalletError | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    getContractCount().then(setCount).catch(() => setCount(0));
  }, []);

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
          networkPassphrase: "Test SDF Network ; September 2015",
        });
        console.log("Sign result:", result);
        if (result.error) throw new Error(`Sign error: ${result.error}`);
        return result.signedTxXdr;
      });
      setTxHash(hash);
      const newCount = await getContractCount();
      setCount(newCount);
      setStatus("success");

      // Log successful contract call telemetry
      logWalletInteraction(publicKey, "contract_call", hash, "Called Counter Smart Contract: increment()");
    } catch (err) {
      console.error("INCREMENT ERROR:", err);
      setErrorType(classifyError(err));
      setErrorMsg(String(err));
      setStatus("error");
    }
  }

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-6 space-y-4">
      <h2 className="text-xl font-bold text-white">🔗 Smart Contract Demo</h2>
      <p className="text-gray-400 text-sm">
        Contract:{" "}
        <code className="text-purple-400 text-xs break-all">
          CBVM5XWQ4P37XJXODWBMYDD4LXLZZGX4SN3VK3JKSLYBCUT3K7GVI2VH
        </code>
      </p>

      <div className="text-center py-4">
        <span className="text-5xl font-mono text-purple-400">
          {count !== null ? count : "—"}
        </span>
        <p className="text-gray-500 text-sm mt-1">on-chain count</p>
      </div>

      {!isConnected ? (
        <button
          onClick={() => setShowPicker(true)}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
        >
          Connect Wallet to Increment
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
            <span className="text-green-400 text-sm font-mono truncate">
              Connected: {publicKey?.slice(0, 10)}...{publicKey?.slice(-10)}
            </span>
          </div>
          <button
            onClick={incrementCounter}
            disabled={status === "pending"}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
          >
            {status === "pending" ? "⏳ Sending transaction…" : "➕ Increment Counter"}
          </button>
        </div>
      )}

      {status === "success" && txHash && (
        <div className="bg-green-900/40 border border-green-700 rounded-lg p-3 text-sm space-y-1">
          <p className="text-green-400 font-medium">✅ Transaction confirmed!</p>
          <p className="text-gray-400 text-xs break-all">Hash: {txHash}</p>
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-xs underline"
          >
            View on Stellar Expert →
          </a>
        </div>
      )}

      {status === "error" && errorType && (
        <div className="bg-red-900/40 border border-red-700 rounded-lg p-3 text-sm space-y-1">
          <p className="text-red-400">{ERROR_MESSAGES[errorType]}</p>
          <p className="text-gray-500 text-xs">Error type: <code>{errorType}</code></p>
          {errorMsg && <p className="text-gray-500 text-xs break-all">{errorMsg}</p>}
        </div>
      )}
    </div>
  );
}