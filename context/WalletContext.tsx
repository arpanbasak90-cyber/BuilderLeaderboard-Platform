"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import { connectWallet, getXLMBalance, sendXLM, fundWithFriendbot } from "@/lib/stellar";
import { logWalletInteraction } from "@/lib/telemetry";

interface WalletContextType {
  publicKey: string | null;
  balance: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  showPicker: boolean;
  setShowPicker: (show: boolean) => void;
  connect: (walletType: string) => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  sendTransaction: (destination: string, amount: string, memo?: string) => Promise<string>;
  fundAccount: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const refreshBalance = useCallback(async () => {
    if (!publicKey) return;
    try {
      const bal = await getXLMBalance(publicKey);
      setBalance(bal);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch balance.");
    }
  }, [publicKey]);

  // Auto-connect from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("stellarPublicKey");
    if (savedKey) {
      setPublicKey(savedKey);
      setIsConnected(true);
      // Fetch initial balance
      getXLMBalance(savedKey)
        .then(setBalance)
        .catch((e) => console.error("Auto-connect balance check failed:", e));
    }
  }, []);

  const connect = useCallback(async (walletType: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (walletType === "freighter") {
        const key = await connectWallet();
        const bal = await getXLMBalance(key);
        setPublicKey(key);
        setBalance(bal);
        setIsConnected(true);
        localStorage.setItem("stellarPublicKey", key);
        setShowPicker(false);
        logWalletInteraction(key, "connect", undefined, `Connected via Freighter Wallet`);
      } else {
        // Mock connection for xBull and LOBSTR if they are not installed
        // Generates a consistent testnet address for demo purposes
        const mockKeys: Record<string, string> = {
          xbull: "GDXBULLY4J7K2P8W9L0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P",
          lobstr: "GDLOBSTRK2L7J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4",
        };
        const key = mockKeys[walletType];
        setPublicKey(key);
        setBalance("100.0");
        setIsConnected(true);
        localStorage.setItem("stellarPublicKey", key);
        setShowPicker(false);
        logWalletInteraction(key, "connect", undefined, `Connected via mock ${walletType} Wallet`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || `Failed to connect with ${walletType}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    const oldKey = publicKey;
    setPublicKey(null);
    setBalance(null);
    setIsConnected(false);
    localStorage.removeItem("stellarPublicKey");
    if (oldKey) {
      logWalletInteraction(oldKey, "disconnect", undefined, "Disconnected wallet");
    }
  }, [publicKey]);

  const sendTransaction = useCallback(
    async (destination: string, amount: string, memo?: string) => {
      if (!publicKey) throw new Error("Wallet not connected");
      setIsLoading(true);
      try {
        let hash = "";
        // If mock key, simulate successful hash
        if (publicKey.startsWith("GDXBULL") || publicKey.startsWith("GDLOBSTR")) {
          hash = Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("");
          await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
          setBalance((prev) => {
            const current = parseFloat(prev || "100.0");
            const amt = parseFloat(amount);
            return (current - amt - 0.0001).toFixed(4);
          });
        } else {
          hash = await sendXLM(publicKey, destination, amount, memo);
          await refreshBalance();
        }

        logWalletInteraction(
          publicKey,
          "send_xlm",
          hash,
          `Sent ${amount} XLM to ${destination.slice(0, 6)}...${destination.slice(-4)}`
        );
        return hash;
      } catch (err: any) {
        setError(err.message || "Transaction failed");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [publicKey, refreshBalance]
  );

  const fundAccount = useCallback(async () => {
    if (!publicKey) return;
    setIsLoading(true);
    try {
      if (publicKey.startsWith("GDXBULL") || publicKey.startsWith("GDLOBSTR")) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setBalance((prev) => (parseFloat(prev || "100") + 10000).toFixed(4));
      } else {
        await fundWithFriendbot(publicKey);
        await refreshBalance();
      }
      logWalletInteraction(publicKey, "fund_wallet", undefined, "Funded wallet with 10,000 XLM via Friendbot");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Funding failed");
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, refreshBalance]);

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        balance,
        isConnected,
        isLoading,
        error,
        showPicker,
        setShowPicker,
        connect,
        disconnect,
        refreshBalance,
        sendTransaction,
        fundAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
