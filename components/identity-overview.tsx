"use client";

import { useState } from "react";
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

// Sample data for identity
const userIdentity = {
  address: "0x1a2b3c4d5e6f7g8h9i0j",
  name: "Alex Rivera",
  joinDate: "2024-03-15",
  roles: [
    { name: "Resident", since: "2024-03-15", active: true },
    { name: "Innovation Zone Contributor", since: "2024-04-01", active: true },
    {
      name: "Community Kitchen Lead",
      since: "2024-04-10",
      until: "2024-04-17",
      active: false,
    },
  ],
  attestations: [
    {
      id: 1,
      name: "Coding Skills",
      issuer: "Innovation Zone Council",
      date: "2024-04-05",
      description:
        "Verified proficiency in React, TypeScript, and Solidity development",
      type: "skill",
    },
    {
      id: 2,
      name: "Community Contribution",
      issuer: "Community Hub",
      date: "2024-04-12",
      description:
        "Led a workshop on decentralized governance for 25 community members",
      type: "contribution",
    },
    {
      id: 3,
      name: "Conflict Resolution",
      issuer: "Governance Council",
      date: "2024-04-20",
      description:
        "Successfully mediated a resource allocation dispute between two community members",
      type: "governance",
    },
  ],
  harbergerStats: {
    currentTaxPayments: 45,
    totalTaxPaid: 1250,
    resourcesHeld: 3,
    governanceWeight: 120,
    votingHistory: 12,
  },
};

export function IdentityOverview() {
  const [selectedAttestation, setSelectedAttestation] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAttestationClick = (attestation: any) => {
    setSelectedAttestation(attestation);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-stone-200">
              <AvatarImage src="/placeholder.svg" alt={userIdentity.name} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{userIdentity.name}</CardTitle>
              <CardDescription className="flex flex-col space-y-1">
                <span className="font-mono text-xs">
                  {userIdentity.address}
                </span>
                <span>Member since {formatDate(userIdentity.joinDate)}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600">
                  Daily Tax
                </span>
                <span className="text-lg font-bold">
                  {userIdentity.harbergerStats.currentTaxPayments} DAI
                </span>
              </div>
            </div>
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600">
                  Resources Held
                </span>
                <span className="text-lg font-bold">
                  {userIdentity.harbergerStats.resourcesHeld}
                </span>
              </div>
            </div>
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600">
                  Governance Weight
                </span>
                <span className="text-lg font-bold">
                  {userIdentity.harbergerStats.governanceWeight}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="roles">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roles">Roles & History</TabsTrigger>
          <TabsTrigger value="attestations">Attestations</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Current & Past Roles
              </CardTitle>
              <CardDescription>
                Roles are recorded in your Soulbound Token (SBT) and cannot be
                transferred
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userIdentity.roles.map((role, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 rounded-md border border-stone-200 p-3"
                  >
                    <div className="rounded-full bg-stone-100 p-2">
                      {role.active ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Book className="h-4 w-4 text-stone-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{role.name}</h3>
                        {role.active ? (
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline">Past</Badge>
                        )}
                      </div>
                      <p className="text-sm text-stone-500">
                        {formatDate(role.since)} -{" "}
                        {role.until ? formatDate(role.until) : "Present"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attestations" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Skill & Contribution Attestations
              </CardTitle>
              <CardDescription>
                Verified attestations from community members and governance
                bodies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userIdentity.attestations.map((attestation) => (
                  <div
                    key={attestation.id}
                    className="flex items-start space-x-3 rounded-md border border-stone-200 p-3 hover:border-stone-300 hover:bg-stone-50"
                    onClick={() => handleAttestationClick(attestation)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="rounded-full bg-stone-100 p-2">
                      {attestation.type === "skill" && (
                        <Star className="h-4 w-4 text-amber-600" />
                      )}
                      {attestation.type === "contribution" && (
                        <FileCheck className="h-4 w-4 text-blue-600" />
                      )}
                      {attestation.type === "governance" && (
                        <Shield className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{attestation.name}</h3>
                        <Badge
                          className={
                            attestation.type === "skill"
                              ? "bg-amber-100 text-amber-800"
                              : attestation.type === "contribution"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }
                        >
                          {attestation.type.charAt(0).toUpperCase() +
                            attestation.type.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-stone-500">
                        Issued by {attestation.issuer} on{" "}
                        {formatDate(attestation.date)}
                      </p>
                      <p className="mt-1 text-sm">{attestation.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="governance" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Vote className="mr-2 h-5 w-5" />
                Governance Participation
              </CardTitle>
              <CardDescription>
                Your governance weight is derived from your Harberger tax
                payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Current Governance Weight
                  </span>
                  <span className="text-lg font-bold">
                    {userIdentity.harbergerStats.governanceWeight}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>
                      Based on daily tax payments of{" "}
                      {userIdentity.harbergerStats.currentTaxPayments} DAI
                    </span>
                  </div>
                  <Progress value={75} className="h-1.5" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Tax Paid</span>
                    <span>{userIdentity.harbergerStats.totalTaxPaid} DAI</span>
                  </div>
                </div>
                <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Proposals Voted On
                    </span>
                    <span>{userIdentity.harbergerStats.votingHistory}</span>
                  </div>
                </div>
                <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Delegation Status
                    </span>
                    <Badge variant="outline">Not Delegated</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button className="w-full bg-stone-800 text-white hover:bg-stone-700">
                  View Voting History
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedAttestation && (
        <AttestationDetailsDialog
          attestation={selectedAttestation}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </div>
  );
}
