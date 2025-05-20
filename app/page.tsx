"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourcesOverview } from "@/components/resources-overview";
import { ZonesOverview } from "@/components/zones-overview";
import { GovernanceOverview } from "@/components/governance-overview";
import { IdentityOverview } from "@/components/identity-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Home, Users, Vote } from "lucide-react";
import { WelcomeBanner } from "@/components/welcome-banner";

export default function HomePage() {
  const router = useRouter();
  const { isConnected, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-300 border-t-stone-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          Welcome to Zarbora
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          A decentralized simulation using Harberger taxes. Connect your wallet
          to get started.
        </p>
      </div>

      <WelcomeBanner />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Resources
            </CardTitle>
            <Building className="h-4 w-4 text-stone-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">79</div>
            <p className="text-xs text-stone-600">Across all zones</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">City Zones</CardTitle>
            <Home className="h-4 w-4 text-stone-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-stone-600">With unique tax rates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Citizens
            </CardTitle>
            <Users className="h-4 w-4 text-stone-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-stone-600">With governance weight</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Proposals
            </CardTitle>
            <Vote className="h-4 w-4 text-stone-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-stone-600">Awaiting community votes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="resources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="zones">City Zones</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
          <TabsTrigger value="identity">Identity</TabsTrigger>
        </TabsList>
        <TabsContent value="resources" className="space-y-4">
          <ResourcesOverview />
        </TabsContent>
        <TabsContent value="zones" className="space-y-4">
          <ZonesOverview />
        </TabsContent>
        <TabsContent value="governance" className="space-y-4">
          <GovernanceOverview />
        </TabsContent>
        <TabsContent value="identity" className="space-y-4">
          <IdentityOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
}
