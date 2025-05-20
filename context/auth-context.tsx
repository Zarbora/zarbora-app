"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { config, projectId, metadata } from "@/config";
import { createWeb3Modal, useWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { State, WagmiProvider, useAccount, useDisconnect } from "wagmi";

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

// Create modal
createWeb3Modal({
  metadata,
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

type AuthContextType = {
  isConnected: boolean;
  address: string | undefined;
  displayName: string | undefined;
  isLoading: boolean;
  openConnectModal: () => void;
  disconnect: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isConnected: false,
  address: undefined,
  displayName: undefined,
  isLoading: true,
  openConnectModal: () => {},
  disconnect: () => {},
});

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (address) {
      setDisplayName(
        `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
      );
    } else {
      setDisplayName(undefined);
    }
    setIsLoading(false);
  }, [address]);

  const openConnectModal = () => {
    open({ view: "Connect" });
  };

  const disconnect = async () => {
    try {
      wagmiDisconnect();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isConnected,
        address,
        displayName,
        isLoading,
        openConnectModal,
        disconnect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function AppKitProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
