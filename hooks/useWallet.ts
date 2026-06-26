"use client";

import { useState, useEffect, useCallback } from "react";
import { connectWallet, getXLMBalance, sendXLM, fundWithFriendbot } from "@/lib/stellar";

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
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message,
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem("stellarPublicKey");
    setState({
      publicKey: null,
      balance: null,
      isConnected: false,
      isLoading: false,
      error: null,
    });
  }, []);

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