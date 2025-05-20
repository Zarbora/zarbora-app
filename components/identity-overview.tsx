"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Book,
  Check,
  FileCheck,
  Shield,
  Star,
  User,
  Vote,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { AttestationDetailsDialog } from "./attestation-details-dialog";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api";

interface Role {
  name: string;
  since: string;
  until?: string;
  active: boolean;
}

interface Attestation {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
  type: "skill" | "contribution" | "governance";
}

interface HarbergerStats {
  currentTaxPayments: number;
  totalTaxPaid: number;
  resourcesHeld: number;
  governanceWeight: number;
  votingHistory: number;
}

interface Identity {
  address: string;
  name: string;
  joinDate: string;
  roles: Role[];
  attestations: Attestation[];
  harbergerStats: HarbergerStats;
}

interface IdentityOverviewProps {
  societyId: string;
}

export function IdentityOverview({ societyId }: IdentityOverviewProps) {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttestation, setSelectedAttestation] =
    useState<Attestation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function loadIdentity() {
      try {
        const data = await api.identity.getBySociety(societyId);
        setIdentity(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load identity data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadIdentity();
  }, [societyId]);

  const handleAttestationClick = (attestation: Attestation) => {
    setSelectedAttestation(attestation);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Loading identity data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!identity) {
    return <div>Identity not found</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-stone-200">
              <AvatarImage src="/placeholder.svg" alt={identity.name} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-medium">
                {identity.name}
              </CardTitle>
              <CardDescription>
                Member since {formatDate(identity.joinDate)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-lg font-medium">
                Roles & Responsibilities
              </h3>
              <div className="space-y-3">
                {identity.roles.map((role) => (
                  <div
                    key={role.name}
                    className="flex items-center justify-between rounded-lg border border-stone-200 p-3"
                  >
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-stone-500" />
                      <span className="font-medium">{role.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-stone-500">
                        {formatDate(role.since)}
                      </span>
                      {role.active ? (
                        <Badge variant="outline" className="bg-green-50">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-stone-50">
                          Past
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium">Harberger Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Current Tax Payments
                    </span>
                    <span className="text-sm text-stone-500">
                      {identity.harbergerStats.currentTaxPayments} DAI/day
                    </span>
                  </div>
                  <Progress
                    value={
                      (identity.harbergerStats.currentTaxPayments /
                        identity.harbergerStats.totalTaxPaid) *
                      100
                    }
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Resources Held</span>
                    <span className="text-sm text-stone-500">
                      {identity.harbergerStats.resourcesHeld} resources
                    </span>
                  </div>
                  <Progress
                    value={
                      (identity.harbergerStats.resourcesHeld /
                        identity.harbergerStats.governanceWeight) *
                      100
                    }
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Governance Weight
                    </span>
                    <span className="text-sm text-stone-500">
                      {identity.harbergerStats.governanceWeight} points
                    </span>
                  </div>
                  <Progress
                    value={
                      (identity.harbergerStats.votingHistory /
                        identity.harbergerStats.governanceWeight) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attestations</CardTitle>
          <CardDescription>
            Verified skills, contributions, and governance participation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {identity.attestations.map((attestation) => (
              <Card
                key={attestation.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => handleAttestationClick(attestation)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      {attestation.name}
                    </CardTitle>
                    {attestation.type === "skill" && (
                      <Book className="h-4 w-4 text-blue-500" />
                    )}
                    {attestation.type === "contribution" && (
                      <Star className="h-4 w-4 text-amber-500" />
                    )}
                    {attestation.type === "governance" && (
                      <Vote className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <CardDescription className="flex items-center space-x-1">
                    <FileCheck className="h-3 w-3" />
                    <span>{attestation.issuer}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-stone-600">
                    {attestation.description}
                  </p>
                  <div className="mt-2 text-xs text-stone-500">
                    {formatDate(attestation.date)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <AttestationDetailsDialog
        attestation={selectedAttestation}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
