"use client";

import React, { FC, ReactNode, createContext, useContext, useState, useCallback, useEffect } from "react";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { Window as KeplrWindow } from "@keplr-wallet/types";

declare global {
  interface Window extends KeplrWindow {}
}

// Coreum Mainnet Configuration
const COREUM_CHAIN_ID = "coreum-mainnet-1";
const COREUM_RPC_ENDPOINT = "https://full-node.mainnet-1.coreum.dev:26657";
const COREUM_REST_ENDPOINT = "https://full-node.mainnet-1.coreum.dev:1317";

// Coreum Testnet Configuration (alternative)
// const COREUM_CHAIN_ID = "coreum-testnet-1";
// const COREUM_RPC_ENDPOINT = "https://full-node.testnet-1.coreum.dev:26657";
// const COREUM_REST_ENDPOINT = "https://full-node.testnet-1.coreum.dev:1317";

const COREUM_CHAIN_INFO = {
  chainId: COREUM_CHAIN_ID,
  chainName: "Coreum",
  rpc: COREUM_RPC_ENDPOINT,
  rest: COREUM_REST_ENDPOINT,
  bip44: {
    coinType: 990,
  },
  bech32Config: {
    bech32PrefixAccAddr: "core",
    bech32PrefixAccPub: "corepub",
    bech32PrefixValAddr: "corevaloper",
    bech32PrefixValPub: "corevaloperpub",
    bech32PrefixConsAddr: "corevalcons",
    bech32PrefixConsPub: "corevalconspub",
  },
  currencies: [
    {
      coinDenom: "COREUM",
      coinMinimalDenom: "ucore",
      coinDecimals: 6,
      coinGeckoId: "coreum",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "COREUM",
      coinMinimalDenom: "ucore",
      coinDecimals: 6,
      coinGeckoId: "coreum",
      gasPriceStep: {
        low: 0.0625,
        average: 0.1,
        high: 0.625,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: "COREUM",
    coinMinimalDenom: "ucore",
    coinDecimals: 6,
    coinGeckoId: "coreum",
  },
  features: ["stargate", "ibc-transfer", "cosmwasm"],
};

interface CoreumWalletContextType {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  client: SigningStargateClient | null;
  balance: string | null;
}

const CoreumWalletContext = createContext<CoreumWalletContextType>({
  address: null,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  client: null,
  balance: null,
});

export const useCoreumWallet = () => useContext(CoreumWalletContext);

interface CoreumProviderProps {
  children: ReactNode;
}

export const CoreumProvider: FC<CoreumProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [client, setClient] = useState<SigningStargateClient | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const getKeplr = useCallback(async () => {
    if (typeof window === "undefined") return null;

    if (window.keplr) {
      return window.keplr;
    }

    if (document.readyState === "complete") {
      return window.keplr;
    }

    return new Promise((resolve) => {
      const documentStateChange = (event: Event) => {
        if (
          event.target &&
          (event.target as Document).readyState === "complete"
        ) {
          resolve(window.keplr);
          document.removeEventListener("readystatechange", documentStateChange);
        }
      };

      document.addEventListener("readystatechange", documentStateChange);
    });
  }, []);

  const connect = useCallback(async () => {
    try {
      const keplr = await getKeplr();

      if (!keplr) {
        alert("Please install Keplr wallet extension");
        window.open("https://www.keplr.app/download", "_blank");
        return;
      }

      // Suggest the Coreum chain to Keplr
      try {
        await keplr.experimentalSuggestChain(COREUM_CHAIN_INFO);
      } catch (error) {
        console.error("Failed to suggest chain:", error);
      }

      // Enable the chain
      await keplr.enable(COREUM_CHAIN_ID);

      // Get the offline signer
      const offlineSigner = keplr.getOfflineSigner(COREUM_CHAIN_ID);

      // Get user accounts
      const accounts = await offlineSigner.getAccounts();

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const userAddress = accounts[0].address;
      setAddress(userAddress);

      // Create a signing client
      const signingClient = await SigningStargateClient.connectWithSigner(
        COREUM_RPC_ENDPOINT,
        offlineSigner
      );
      setClient(signingClient);

      // Get balance
      const balanceResult = await signingClient.getBalance(userAddress, "ucore");
      setBalance((parseInt(balanceResult.amount) / 1_000_000).toFixed(6));

      console.log("Connected to Coreum:", userAddress);
    } catch (error) {
      console.error("Failed to connect to Keplr:", error);
      alert("Failed to connect to Keplr wallet. Please try again.");
    }
  }, [getKeplr]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setClient(null);
    setBalance(null);
  }, []);

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      const keplr = await getKeplr();
      if (keplr) {
        try {
          const key = await keplr.getKey(COREUM_CHAIN_ID);
          if (key) {
            await connect();
          }
        } catch (error) {
          // User hasn't connected before
          console.log("No previous connection found");
        }
      }
    };

    autoConnect();
  }, [getKeplr, connect]);

  const value: CoreumWalletContextType = {
    address,
    isConnected: !!address,
    connect,
    disconnect,
    client,
    balance,
  };

  return (
    <CoreumWalletContext.Provider value={value}>
      {children}
    </CoreumWalletContext.Provider>
  );
};
