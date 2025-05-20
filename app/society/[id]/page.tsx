"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Home, Users, Vote } from "lucide-react";
import { ResourcesOverview } from "@/components/resources-overview";

interface Society {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  resourceCount: number;
  governanceWeight: number;
}

export default function SocietyDashboard() {
  const params = useParams();
  const [society, setSociety] = useState<Society | null>(null);
  const [mounted, setMounted] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-stone-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-900 dark:text-white">
              Total Resources
            </CardTitle>
            <Building className="h-4 w-4 text-stone-600 dark:text-stone-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900 dark:text-white">
              {society.resourceCount}
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Across all zones
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-stone-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-900 dark:text-white">
              City Zones
            </CardTitle>
            <Home className="h-4 w-4 text-stone-600 dark:text-stone-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900 dark:text-white">
              5
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              With unique tax rates
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-stone-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-900 dark:text-white">
              Active Citizens
            </CardTitle>
            <Users className="h-4 w-4 text-stone-600 dark:text-stone-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900 dark:text-white">
              {society.memberCount}
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              With governance weight
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-stone-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-900 dark:text-white">
              Active Proposals
            </CardTitle>
            <Vote className="h-4 w-4 text-stone-600 dark:text-stone-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900 dark:text-white">
              3
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Awaiting community votes
            </p>
          </CardContent>
        </Card>
      </div>

      <ResourcesOverview />
    </div>
  );
}
