"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";

interface Society {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  resourceCount: number;
  governanceWeight: number;
}

interface SocietyLayoutProps {
  children: React.ReactNode;
}

export default function SocietyLayout({ children }: SocietyLayoutProps) {
  const params = useParams();
  const { isConnected, address } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [society, setSociety] = useState<Society | null>(null);

  useEffect(() => {
    setMounted(true);
    // In a real app, fetch society data here
    setSociety({
      id: params.id as string,
      name: "Zarbora Metropolis",
      description: "A decentralized city simulation with Harberger taxes",
      memberCount: 120,
      resourceCount: 79,
      governanceWeight: 500,
    });
  }, [params.id]);

  if (!mounted || !society) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-300 dark:border-stone-600 border-t-stone-800 dark:border-t-stone-400"></div>
      </div>
    );
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
}
