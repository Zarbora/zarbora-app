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
      <Card className="mb-6 bg-stone-800 dark:bg-stone-900 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Welcome to Zarbora</CardTitle>
          <CardDescription className="text-stone-300 dark:text-stone-400">
            Connect your wallet to participate in the decentralized Zarbora
            simulation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={openConnectModal}
            variant="outline"
            className="bg-white dark:bg-stone-100 text-stone-800 hover:bg-stone-100 dark:hover:bg-stone-200 transition-colors"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 bg-stone-100 dark:bg-stone-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-stone-900 dark:text-white">
          Welcome back, {displayName}
        </CardTitle>
        <CardDescription className="text-stone-600 dark:text-stone-400">
          You have 3 resources under your management and 120 governance weight.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
        >
          <Link href="/resources">
            View Your Resources
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
        >
          <Link href="/governance">
            Active Proposals (5)
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
