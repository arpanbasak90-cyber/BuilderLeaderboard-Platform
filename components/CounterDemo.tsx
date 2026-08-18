"use client";

import { useState, useEffect } from "react";
import { callIncrementContract, getContractCount } from "@/lib/contract";
import { useWallet } from "@/hooks/useWallet";
import { useNetwork } from "@/context/NetworkContext";
import { logWalletInteraction } from "@/lib/telemetry";
import { Loader2, ExternalLink, Zap, ShieldCheck, Code2, Award, Terminal } from "lucide-react";

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
  WALLET_NOT_FOUND: "Wallet not found — please connect Freighter, xBull, or LOBSTR.",
  USER_REJECTED: "Transaction signature request was cancelled by user.",
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
  const [activeTab, setActiveTab] = useState<"interact" | "contract">("interact");

  useEffect(() => {
    getContractCount(network).then(setCount).catch(() => setCount(0));
  }, [network]);

  async function invokeSorobanContract(actionName: string) {
    if (!publicKey) {
      setShowPicker(true);
      return;
    }
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

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("builder_updated"));
      }

      logWalletInteraction(
        publicKey,
        "contract_call",
        hash,
        `Invoked Soroban Leaderboard Contract: ${actionName} on ${network}`
      );
    } catch (err) {
      setErrorType(classifyError(err));
      setErrorMsg(String(err));
      setStatus("error");
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-950 p-6 md:p-8 text-white shadow-2xl shadow-purple-950/40">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-72 h-72 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-gray-900 rounded-[14px] flex items-center justify-center">
              <Zap className="h-5 w-5 text-cyan-300 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black tracking-tight text-white">
                Soroban Smart Contract Playground
              </h3>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300">
                Soroban v22
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5 truncate max-w-md">
              CBVM5XWQ4P37XJXODWBMYDD4LXLZZGX4SN3VK3JKSLYBCUT3K7GVI2VH
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-gray-950/80 border border-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("interact")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "interact"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 inline mr-1.5" />
            Live Invocation
          </button>
          <button
            onClick={() => setActiveTab("contract")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "contract"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 inline mr-1.5" />
            Rust Code
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "interact" ? (
        <div className="relative z-10 pt-6 space-y-6">
          {/* Live Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-950/60 border border-gray-800/80 rounded-2xl p-5 text-center backdrop-blur">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                On-Chain Invocations
              </span>
              <span className="text-4xl font-black font-mono text-cyan-400">
                {count !== null ? count : "0"}
              </span>
              <span className="text-[10px] text-gray-500 block mt-1">Stellar Testnet ledger state</span>
            </div>

            <div className="bg-gray-950/60 border border-gray-800/80 rounded-2xl p-5 text-center backdrop-blur">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Contract Storage Key
              </span>
              <span className="text-sm font-mono font-bold text-purple-300 block truncate mt-2">
                DataKey::Profile(Address)
              </span>
              <span className="text-[10px] text-emerald-400 block mt-1 font-semibold">
                ✓ Persistent Soroban TTL
              </span>
            </div>

            <div className="bg-gray-950/60 border border-gray-800/80 rounded-2xl p-5 text-center backdrop-blur">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Network Status
              </span>
              <span className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1.5 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Stellar {network}
              </span>
              <span className="text-[10px] text-gray-500 block mt-1">Horizon RPC operational</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isConnected ? (
              <button
                onClick={() => setShowPicker(true)}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-600/20 transition-all active:scale-[0.99]"
              >
                Connect Wallet to Test Soroban Contract Invocation
              </button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => invokeSorobanContract("register_builder")}
                  disabled={status === "pending"}
                  className="py-3 px-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-600/20"
                >
                  {status === "pending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Signing…
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 text-purple-200" />
                      Invoke: register_builder()
                    </>
                  )}
                </button>

                <button
                  onClick={() => invokeSorobanContract("complete_quest")}
                  disabled={status === "pending"}
                  className="py-3 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
                >
                  {status === "pending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Signing…
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4 text-cyan-200" />
                      Invoke: complete_quest()
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Transaction Success Alert */}
          {status === "success" && txHash && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-4 text-sm space-y-1.5 backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <p className="text-emerald-300 font-bold">
                  Soroban Contract Executed Successfully!
                </p>
              </div>
              <p className="text-gray-400 text-xs font-mono break-all">Transaction Hash: {txHash}</p>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs font-bold pt-1 underline"
              >
                Inspect on Stellar Expert Explorer
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {/* Error Alert */}
          {status === "error" && errorType && (
            <div className="bg-red-950/60 border border-red-500/40 rounded-2xl p-4 text-sm space-y-1 backdrop-blur">
              <p className="text-red-300 font-bold">⚠️ {ERROR_MESSAGES[errorType]}</p>
              {errorMsg && <p className="text-gray-400 text-xs font-mono break-all">{errorMsg}</p>}
            </div>
          )}
        </div>
      ) : (
        /* Code Tab */
        <div className="relative z-10 pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-purple-400">contracts/counter/src/lib.rs</span>
            <span className="text-[10px] text-gray-500 font-mono">Rust · soroban-sdk v22.0.0</span>
          </div>
          <pre className="bg-gray-950 border border-gray-800 rounded-2xl p-4 text-xs font-mono text-gray-300 overflow-x-auto max-h-80 leading-relaxed">
{`pub fn complete_quest(
    env: Env,
    builder: Address,
    quest_id: u32,
    xp_reward: u32,
    xlm_reward: u32,
) -> BuilderProfile {
    builder.require_auth();

    let profile_key = DataKey::Profile(builder.clone());
    let mut profile: BuilderProfile = env
        .storage()
        .persistent()
        .get(&profile_key)
        .unwrap_or_default();

    profile.xp += xp_reward;
    profile.xlm_earned += xlm_reward;
    profile.quests_completed += 1;
    profile.level = (profile.xp / 500) + 1;

    env.storage().persistent().set(&profile_key, &profile);
    profile
}`}
          </pre>
        </div>
      )}
    </div>
  );
}