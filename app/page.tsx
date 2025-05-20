"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { SocietyOverview } from "@/components/society-overview";

export default function HomePage() {
  const router = useRouter();
  const { isConnected, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isConnected) {
      // Don't redirect to dashboard anymore
      // Let users stay on the societies page
    }
  }, [isConnected, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-300 dark:border-stone-600 border-t-stone-800 dark:border-t-stone-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
          Welcome to Zarbora
        </h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          Join or create a society to participate in decentralized governance.
        </p>
      </div>

      <SocietyOverview />
    </div>
  );
}
