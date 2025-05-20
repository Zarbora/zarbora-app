"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, Home, Users, Vote } from "lucide-react";
import { api } from "@/lib/api";
import type { Society } from "@/lib/api";

export default function SocietyDashboardPage() {
  const params = useParams();
  const societyId = params.id as string;
  const [society, setSociety] = useState<Society | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSociety() {
      try {
        const data = await api.societies.getById(societyId);
        setSociety(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load society data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadSociety();
  }, [societyId]);

  if (loading) {
    return <div>Loading society data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!society) {
    return <div>Society not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{society.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Overview of society metrics and activities
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Resources
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{society.total_resources}</div>
            <p className="text-xs text-muted-foreground">Across all zones</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">City Zones</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{society.zone_count}</div>
            <p className="text-xs text-muted-foreground">
              With unique tax rates
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{society.total_members}</div>
            <p className="text-xs text-muted-foreground">Active participants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Proposals
            </CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{society.total_proposals}</div>
            <p className="text-xs text-muted-foreground">
              Governance activities
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest transactions and events in the society
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resource Distribution</CardTitle>
            <CardDescription>
              Overview of resource allocation across zones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Distribution data coming soon
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
