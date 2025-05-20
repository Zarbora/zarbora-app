"use client";

import { useState, useEffect } from "react";
import { BarChart3, Coffee, Laptop, Utensils, Wifi } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";

interface ResourcePool {
  id: string;
  name: string;
  icon: keyof typeof iconMap;
  collected: number;
  target: number;
  percentage: number;
  contributors: number;
  description: string;
}

interface TaxAllocation {
  category: string;
  percentage: number;
}

const iconMap = {
  Utensils,
  Laptop,
  Wifi,
  Coffee,
};

interface ResourcePoolsDashboardProps {
  societyId: string;
}

export function ResourcePoolsDashboard({
  societyId,
}: ResourcePoolsDashboardProps) {
  const [activeTab, setActiveTab] = useState("pools");
  const [resourcePools, setResourcePools] = useState<ResourcePool[]>([]);
  const [taxAllocation, setTaxAllocation] = useState<TaxAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // In a real app, these would be separate API calls
        const [poolsData, taxData] = await Promise.all([
          api.resourcePools.getBySociety(societyId),
          api.taxAllocation.getBySociety(societyId),
        ]);
        setResourcePools(poolsData);
        setTaxAllocation(taxData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [societyId]);

  if (loading) {
    return <div>Loading resource pools...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="mb-6 text-2xl font-medium text-stone-800">
        Resource Pools
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pools">Resource Pools</TabsTrigger>
          <TabsTrigger value="allocation">Tax Allocation</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {resourcePools.map((pool) => {
              const Icon = iconMap[pool.icon];
              return (
                <Card key={pool.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Icon className="h-5 w-5" />
                        <span>{pool.name}</span>
                      </CardTitle>
                      <span className="text-sm font-medium">
                        {pool.percentage}%
                      </span>
                    </div>
                    <CardDescription>{pool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-2">
                      <Progress value={pool.percentage} className="h-2" />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span>
                        {pool.collected} / {pool.target} DAI
                      </span>
                      <span className="text-stone-500">
                        {pool.contributors} contributors
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="allocation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Harberger Tax Allocation</span>
              </CardTitle>
              <CardDescription>
                Transparency on how Harberger taxes from premium slots are
                allocated to community resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxAllocation.map((item) => (
                  <div key={item.category}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {item.category}
                      </span>
                      <span className="text-sm text-stone-500">
                        {item.percentage}%
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-stone-500">
                Total Harberger taxes collected:{" "}
                {taxAllocation.reduce((acc, item) => acc + item.percentage, 0)}{" "}
                DAI (last 7 days)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
