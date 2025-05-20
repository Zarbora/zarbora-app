"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export function LoginButton() {
  const { isConnected } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { open } = useWeb3Modal();

  // Only show the button after component has mounted to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isConnected) return null;

  return (
    <Button
      onClick={() => open({ view: "Connect" })}
      className="bg-stone-800 text-white hover:bg-stone-700"
    >
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
