"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Users, Vote } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import type { Society, MembershipRequest } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { JoinSocietyDialog } from "./JoinSocietyDialog";

export function SocietyOverview() {
  const router = useRouter();
  const { address } = useAuth();
  const [societies, setSocieties] = useState<Society[]>([]);
  const [membershipStatus, setMembershipStatus] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSociety, setNewSociety] = useState({
    name: "",
    description: "",
    creatorName: "",
  });
  const [selectedSociety, setSelectedSociety] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [address]);

  async function loadData() {
    try {
      const societiesData = await api.societies.getAll();

      // Fetch all related data for each society
      const societiesWithCounts = await Promise.all(
        societiesData.map(async (society) => {
          const [members, resources, proposals] = await Promise.all([
            api.members.getAll(society.id),
            api.resources.getBySociety(society.id),
            api.governance.getProposals(society.id),
          ]);

          return {
            ...society,
            total_members: members.length,
            total_resources: resources.length,
            total_proposals: proposals.length,
          };
        })
      );

      setSocieties(societiesWithCounts);

      if (address) {
        // Load membership status for each society
        const statuses: Record<string, string> = {};
        await Promise.all(
          societiesWithCounts.map(async (society) => {
            // Check if already a member
            const members = await api.members.getAll(society.id);
            const isMember = members.some(
              (m) => m.address.toLowerCase() === address.toLowerCase()
            );
            if (isMember) {
              statuses[society.id] = "member";
              return;
            }

            // Check pending requests
            const requests = await api.members.getMembershipRequests(
              society.id
            );
            const userRequest = requests.find(
              (r) => r.applicant_address === address
            );
            if (userRequest) {
              statuses[society.id] = userRequest.status;
            } else {
              statuses[society.id] = "none";
            }
          })
        );
        setMembershipStatus(statuses);
      }
    } catch (error) {
      console.error("Failed to load societies:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load societies"
      );
    } finally {
      setLoading(false);
    }
  }

  const handleCreateSociety = async () => {
    if (!address) return;

    setIsCreating(true);
    setError(null);

    try {
      // First create the society
      const society = await api.societies.create({
        name: newSociety.name,
        description: newSociety.description || null,
        governance_address: address,
        treasury_address: null,
      });

      // Then add the creator as a member
      await api.members.create({
        society_id: society.id,
        address: address.toLowerCase(),
        name: newSociety.creatorName,
      });

      // Update states
      setSocieties([...societies, society]);
      setNewSociety({ name: "", description: "", creatorName: "" });
      setMembershipStatus((prev) => ({
        ...prev,
        [society.id]: "member",
      }));

      // Close the dialog
      setDialogOpen(false);

      // Navigate to the new society
      router.push(`/society/${society.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create society");
    } finally {
      setIsCreating(false);
    }
  };

  const handleViewSociety = (societyId: string) => {
    router.push(`/society/${societyId}`);
  };

  function getMembershipBadge(status: string) {
    switch (status) {
      case "member":
        return <Badge variant="default">Member</Badge>;
      case "pending":
        return <Badge variant="secondary">Request Pending</Badge>;
      case "approved":
        return <Badge variant="default">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  }

  if (loading) {
    return <div>Loading societies...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
            Societies
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Create and manage decentralized societies
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-stone-800 text-white hover:bg-stone-700">
              <Building2 className="mr-2 h-4 w-4" />
              Create Society
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Society</DialogTitle>
              <DialogDescription>
                Define the parameters for your new decentralized society.
              </DialogDescription>
            </DialogHeader>
            {error && (
              <div className="text-sm font-medium text-red-500 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Society Name</Label>
                <Input
                  id="name"
                  value={newSociety.name}
                  onChange={(e) =>
                    setNewSociety({ ...newSociety, name: e.target.value })
                  }
                  placeholder="Enter society name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSociety.description}
                  onChange={(e) =>
                    setNewSociety({
                      ...newSociety,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your society's purpose and goals"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="creatorName">Your Name</Label>
                <Input
                  id="creatorName"
                  value={newSociety.creatorName}
                  onChange={(e) =>
                    setNewSociety({
                      ...newSociety,
                      creatorName: e.target.value,
                    })
                  }
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateSociety}
                className="bg-stone-800 text-white hover:bg-stone-700"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-stone-400 border-t-white"></div>
                    Creating...
                  </>
                ) : (
                  "Create Society"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {societies.map((society) => (
          <Card key={society.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{society.name}</CardTitle>
              <CardDescription>
                {society.description || "No description"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-stone-600 dark:text-stone-400">
                    <Users className="mr-1 h-4 w-4" />
                    Members
                  </div>
                  <div className="text-lg font-semibold text-stone-900 dark:text-white">
                    {society.total_members}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-stone-600 dark:text-stone-400">
                    <Building2 className="mr-1 h-4 w-4" />
                    Resources
                  </div>
                  <div className="text-lg font-semibold text-stone-900 dark:text-white">
                    {society.total_resources}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-stone-600 dark:text-stone-400">
                    <Vote className="mr-1 h-4 w-4" />
                    Proposals
                  </div>
                  <div className="text-lg font-semibold text-stone-900 dark:text-white">
                    {society.total_proposals}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {membershipStatus[society.id] === "member" ? (
                  <Button
                    onClick={() => handleViewSociety(society.id)}
                    size="sm"
                    className="flex-1 bg-stone-800 text-white hover:bg-stone-700"
                  >
                    Enter Society
                  </Button>
                ) : membershipStatus[society.id] === "none" ? (
                  <Button onClick={() => setSelectedSociety(society.id)}>
                    Join Society
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <JoinSocietyDialog
        societyId={selectedSociety || ""}
        open={!!selectedSociety}
        onOpenChange={(open) => !open && setSelectedSociety(null)}
        onSuccess={loadData}
      />
    </div>
  );
}
