"use client";

import { useState, useEffect } from "react";
import { BarChart3, Vote, Plus, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProposalDetailsDialog } from "./proposal-details-dialog";
import { formatDate } from "@/lib/utils";
import { getProposals, getGovernanceStats } from "@/lib/api";
import type { Proposal } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface GovernanceOverviewProps {
  societyId: string;
}

export function GovernanceOverview({ societyId }: GovernanceOverviewProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [proposalsData, statsData] = await Promise.all([
          getProposals(societyId),
          getGovernanceStats(societyId),
        ]);
        setProposals(proposalsData);
        setStats(statsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load governance data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [societyId]);

  const handleProposalClick = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsDialogOpen(true);
  };

  const activeProposals = proposals.filter((p) => p.status === "active");
  const completedProposals = proposals.filter((p) => p.status === "completed");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Governance</CardTitle>
          <CardDescription>
            Participate in decision-making and shape the future of your society
            through proposals and voting.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Proposals
                  </CardTitle>
                  <Vote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalProposals}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeProposals} active now
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pass Rate
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.passRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Of completed proposals
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Voter Participation
                  </CardTitle>
                  <Vote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.averageVoterParticipation.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average votes per proposal
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Top Voter
                  </CardTitle>
                  <Vote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.topVoters[0]?.voting_weight || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Governance weight
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="active" className="mt-6">
              <TabsList>
                <TabsTrigger value="active">Active Proposals</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-6">
                <div className="grid gap-4">
                  {activeProposals.length === 0 ? (
                    <div className="text-center py-8 text-stone-500">
                      No active proposals
                    </div>
                  ) : (
                    activeProposals.map((proposal) => (
                      <Card
                        key={proposal.id}
                        className="cursor-pointer transition-colors hover:bg-stone-50"
                        onClick={() => handleProposalClick(proposal)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {proposal.title}
                              </CardTitle>
                              <CardDescription>
                                By {proposal.proposer_name} · Ends{" "}
                                {formatDate(proposal.end_time)}
                              </CardDescription>
                            </div>
                            <Badge>{proposal.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4 text-sm text-stone-600">
                            {proposal.description}
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>For</span>
                              <span>{proposal.votes_for}</span>
                            </div>
                            <Progress
                              value={
                                (proposal.votes_for / proposal.total_votes) *
                                100
                              }
                              className="h-2"
                            />
                            <div className="flex items-center justify-between text-sm">
                              <span>Against</span>
                              <span>{proposal.votes_against}</span>
                            </div>
                            <Progress
                              value={
                                (proposal.votes_against /
                                  proposal.total_votes) *
                                100
                              }
                              className="h-2"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                <div className="grid gap-4">
                  {completedProposals.length === 0 ? (
                    <div className="text-center py-8 text-stone-500">
                      No completed proposals
                    </div>
                  ) : (
                    completedProposals.map((proposal) => (
                      <Card
                        key={proposal.id}
                        className="cursor-pointer transition-colors hover:bg-stone-50"
                        onClick={() => handleProposalClick(proposal)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {proposal.title}
                              </CardTitle>
                              <CardDescription>
                                By {proposal.proposer_name} · Ended{" "}
                                {formatDate(proposal.end_time)}
                              </CardDescription>
                            </div>
                            <Badge
                              variant={
                                proposal.result === "passed"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {proposal.result === "passed"
                                ? "Passed"
                                : "Rejected"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4 text-sm text-stone-600">
                            {proposal.description}
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Final Result</span>
                              <span>
                                {proposal.votes_for} For ·{" "}
                                {proposal.votes_against} Against
                              </span>
                            </div>
                            <Progress
                              value={
                                (proposal.votes_for / proposal.total_votes) *
                                100
                              }
                              className="h-2"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {selectedProposal && (
          <ProposalDetailsDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            proposal={selectedProposal}
          />
        )}
      </CardContent>
    </Card>
  );
}
