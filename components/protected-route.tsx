"use client";

import type React from "react";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useWeb3Modal } from "@web3modal/wagmi/react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isConnected, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { open } = useWeb3Modal();

  // Only check authentication after component has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isConnected) {
      // Optional: Redirect to login page
      // router.push("/")
    }
  }, [isConnected, isLoading, router, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-300 border-t-stone-800"></div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            Please connect your wallet to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => open({ view: "Connect" })}
            className="w-full bg-stone-800 text-white hover:bg-stone-700"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
