"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
  const { displayName, address } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Dashboard</h1>
        <p className="text-stone-500">Welcome back, {displayName}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Your Address</CardTitle>
            <CardDescription>Your connected wallet address</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm">{address}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>Your owned resources</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">3</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Governance Weight</CardTitle>
            <CardDescription>Your voting power</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">120</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
