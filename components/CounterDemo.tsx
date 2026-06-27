"use client";

import { useState, useEffect } from "react";
import { callIncrementContract, getContractCount } from "@/lib/contract";

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

const WALLETS = [
  { id: "freighter", name: "Freighter", icon: "🟣" },
  { id: "xbull", name: "xBull", icon: "🔵" },
  { id: "lobstr", name: "LOBSTR", icon: "🟠" },
];

export default function CounterDemo() {
  const [address, setAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string>("");
  const [count, setCount] = useState<number | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorType, setErrorType] = useState<WalletError | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    getContractCount().then(setCount).catch(() => setCount(0));
  }, []);

  async function connectFreighter() {
    try {
      const freighter = await import("@stellar/freighter-api");
      const connected = await freighter.isConnected();
      if (!connected) throw new Error("not installed");
      const { address: addr } = await freighter.getAddress();
      setAddress(addr);
      setWalletName("Freighter");
      setShowPicker(false);
    } catch (err) {
      setErrorType(classifyError(err));
      setErrorMsg(String(err));
      setStatus("error");
      setShowPicker(false);
    }
  }

  function selectWallet(id: string) {
    if (id === "freighter") connectFreighter();
    else {
      setErrorType("WALLET_NOT_FOUND");
      setErrorMsg("Only Freighter is supported for signing. Please install Freighter.");
      setStatus("error");
      setShowPicker(false);
    }
  }

  async function incrementCounter() {
    if (!address) return;
    setStatus("pending");
    setTxHash(null);
    setErrorType(null);
    setErrorMsg("");
    try {
      const freighter = await import("@stellar/freighter-api");
      const hash = await callIncrementContract(address, async (xdr: string) => {
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
    } catch (err) {
      console.error("INCREMENT ERROR:", err);
      setErrorType(classifyError(err));
      setErrorMsg(String(err));
      setStatus("error");
    }
  }

  function disconnect() {
    setAddress(null);
    setWalletName("");
    setStatus("idle");
    setTxHash(null);
    setErrorType(null);
    setErrorMsg("");
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

      {showPicker && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-80 space-y-3">
            <h3 className="text-white font-bold text-lg">Connect a Wallet</h3>
            {WALLETS.map((w) => (
              <button
                key={w.id}
                onClick={() => selectWallet(w.id)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition"
              >
                <span className="text-xl">{w.icon}</span>
                <span className="font-medium">{w.name}</span>
              </button>
            ))}
            <button
              onClick={() => setShowPicker(false)}
              className="w-full py-2 text-gray-400 hover:text-white text-sm transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!address ? (
        <button
          onClick={() => setShowPicker(true)}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
            <span className="text-green-400 text-sm">
              ✅ {walletName} — {address.slice(0, 6)}…{address.slice(-4)}
            </span>
            <button
              onClick={disconnect}
              className="text-gray-400 hover:text-red-400 text-xs underline ml-2"
            >
              Disconnect
            </button>
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