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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { Member, MembershipRequest } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MembersPage() {
  const params = useParams();
  const societyId = params.id as string;
  const { toast } = useToast();
  const { address } = useAuth();

  const [members, setMembers] = useState<Member[]>([]);
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true); // TODO: Implement proper admin check
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    address: "",
  });

  useEffect(() => {
    loadData();
  }, [societyId]);

  async function loadData() {
    try {
      const [membersData, requestsData] = await Promise.all([
        api.members.getAll(societyId),
        api.members.getMembershipRequests(societyId),
      ]);
      setMembers(membersData);
      setRequests(requestsData);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load members data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);

      // Create member directly
      await api.members.create({
        society_id: societyId,
        address: newMember.address,
        name: newMember.name,
      });

      toast({
        title: "Success",
        description: "Member added successfully",
      });

      setNewMember({ name: "", address: "" });
      setShowAddMember(false);
      loadData();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestAction(
    requestId: string,
    status: "approved" | "rejected"
  ) {
    if (!address) {
      toast({
        title: "Error",
        description: "You must be connected to perform this action",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await api.members.reviewMembershipRequest(requestId, status, address);
      toast({
        title: "Success",
        description: `Membership request ${status}`,
      });
      loadData();
    } catch (err) {
      console.error("Error reviewing membership request:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error && err.message === "Reviewer identity not found"
            ? "You must be a member of this society to review membership requests"
            : `Failed to ${status} request`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">Manage society membership</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowAddMember(true)}>Add Member</Button>
        )}
      </div>

      {/* Current Members */}
      <Card>
        <CardHeader>
          <CardTitle>Current Members</CardTitle>
          <CardDescription>Active members of the society</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Member Since</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell className="font-mono">{member.address}</TableCell>
                  <TableCell>
                    {new Date(member.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Requests - Only visible to admins */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Membership Requests</CardTitle>
            <CardDescription>
              Review pending membership requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Zupass</TableHead>
                  <TableHead>Application</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests
                  .filter((r) => r.status === "pending")
                  .map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.applicant_name}</TableCell>
                      <TableCell className="font-mono">
                        {request.applicant_address}
                      </TableCell>
                      <TableCell>
                        {request.zupass_verified ? (
                          <Badge variant="default">Verified</Badge>
                        ) : (
                          <Badge variant="secondary">Unverified</Badge>
                        )}
                      </TableCell>
                      <TableCell>{request.application_text}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleRequestAction(request.id, "approved")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleRequestAction(request.id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add Member Dialog */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Directly add a new member to the society
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="address">Wallet Address</label>
              <Input
                id="address"
                value={newMember.address}
                onChange={(e) =>
                  setNewMember({ ...newMember, address: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              Add Member
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
