"use client";

import { useAuth } from "@/context/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function WelcomeBanner() {
  const { isConnected, displayName, isLoading, openConnectModal } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Only show the component after it has mounted to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Card className="mb-6 bg-stone-800 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Welcome to Zarbora</CardTitle>
          <CardDescription className="text-stone-300">
            Connect your wallet to participate in the decentralized Zarbora
            simulation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={openConnectModal}
            variant="outline"
            className="bg-white text-stone-800 hover:bg-stone-100"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 bg-stone-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Welcome back, {displayName}</CardTitle>
        <CardDescription>
          You have 3 resources under your management and 120 governance weight.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/resources">
            View Your Resources
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/governance">
            Active Proposals (5)
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
