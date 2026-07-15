"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as StellarSdk from "stellar-sdk";

export type Network = "testnet" | "mainnet";

interface NetworkContextType {
  network: Network;
  setNetwork: (n: Network) => void;
  horizonUrl: string;
  networkPassphrase: string;
  explorerBaseUrl: string;
}

export const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

const NETWORK_CONFIG: Record<Network, { horizonUrl: string; networkPassphrase: string; explorerBaseUrl: string }> = {
  testnet: {
    horizonUrl: "https://horizon-testnet.stellar.org",
    networkPassphrase: StellarSdk.Networks.TESTNET,
    explorerBaseUrl: "https://stellar.expert/explorer/testnet",
  },
  mainnet: {
    horizonUrl: "https://horizon.stellar.org",
    networkPassphrase: StellarSdk.Networks.PUBLIC,
    explorerBaseUrl: "https://stellar.expert/explorer/public",
  },
};

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [network, setNetworkState] = useState<Network>("testnet");

  useEffect(() => {
    const stored = localStorage.getItem("bb_network") as Network | null;
    if (stored === "testnet" || stored === "mainnet") {
      setNetworkState(stored);
    }
  }, []);

  const setNetwork = useCallback((n: Network) => {
    localStorage.setItem("bb_network", n);
    setNetworkState(n);
  }, []);

  const config = NETWORK_CONFIG[network];

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork,
        horizonUrl: config.horizonUrl,
        networkPassphrase: config.networkPassphrase,
        explorerBaseUrl: config.explorerBaseUrl,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
  return ctx;
};
