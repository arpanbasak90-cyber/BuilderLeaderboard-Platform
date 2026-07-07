"use client";

import { useState, useEffect, useCallback } from "react";
import { connectWallet, getXLMBalance, sendXLM, fundWithFriendbot } from "@/lib/stellar";
import { logWalletInteraction } from "@/lib/telemetry";

interface WalletState {
  publicKey: string | null;
  balance: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    publicKey: null,
    balance: null,
    isConnected: false,
    isLoading: false,
    error: null,
  });

  // Auto-reconnect on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("stellarPublicKey");
    if (savedKey) {
      refreshBalance(savedKey);
      setState((prev) => ({
        ...prev,
        publicKey: savedKey,
        isConnected: true,
      }));
    }
  }, []);

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const publicKey = await connectWallet();
      const balance = await getXLMBalance(publicKey);
      localStorage.setItem("stellarPublicKey", publicKey);
      setState({
        publicKey,
        balance,
        isConnected: true,
        isLoading: false,
        error: null,
      });
      // Log connection telemetry
      logWalletInteraction(publicKey, "connect", undefined, "Connected wallet from Navigation header");
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message,
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    const oldKey = state.publicKey;
    localStorage.removeItem("stellarPublicKey");
    setState({
      publicKey: null,
      balance: null,
      isConnected: false,
      isLoading: false,
      error: null,
    });
    if (oldKey) {
      // Log disconnection telemetry
      logWalletInteraction(oldKey, "disconnect", undefined, "Disconnected wallet");
    }
  }, [state.publicKey]);

  const refreshBalance = useCallback(async (key?: string) => {
    const publicKey = key || state.publicKey;
    if (!publicKey) return;
    try {
      const balance = await getXLMBalance(publicKey);
      setState((prev) => ({ ...prev, balance }));
    } catch (err: any) {
      setState((prev) => ({ ...prev, error: err.message }));
    }
  }, [state.publicKey]);

  const sendTransaction = useCallback(
    async (destination: string, amount: string, memo?: string) => {
      if (!state.publicKey) throw new Error("Wallet not connected");
      const hash = await sendXLM(state.publicKey, destination, amount, memo);
      await refreshBalance();
      
      // Log send transaction telemetry
      logWalletInteraction(
        state.publicKey,
        "send_xlm",
        hash,
        `Sent ${amount} XLM to ${destination.slice(0, 6)}...${destination.slice(-4)}${memo ? ` with memo: ${memo}` : ""}`
      );
      
      return hash;
    },
    [state.publicKey, refreshBalance]
  );

  const fundAccount = useCallback(async () => {
    if (!state.publicKey) return;
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await fundWithFriendbot(state.publicKey);
      await refreshBalance();
      
      // Log wallet funding telemetry
      logWalletInteraction(state.publicKey, "fund_wallet", undefined, "Funded wallet with 10,000 XLM via Friendbot");
    } catch (err: any) {
      setState((prev) => ({ ...prev, error: err.message }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.publicKey, refreshBalance]);

  return {
    ...state,
    connect,
    disconnect,
    refreshBalance,
    sendTransaction,
    fundAccount,
  };
}