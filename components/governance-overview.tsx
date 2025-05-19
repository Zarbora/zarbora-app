"use client";

import { useState } from "react";
import { BarChart3, Vote } from "lucide-react";
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

// Sample data for governance
const proposals = [
  {
    id: 1,
    title: "Increase Residential Zone Tax Rate to 12%",
    description:
      "Proposal to increase the tax rate in the Residential Zone from 10% to 12% to fund community kitchen upgrades.",
    status: "active",
    proposer: "0x1a2...3b4c",
    proposerName: "Alex Rivera",
    proposerWeight: 245,
    votesFor: 1250,
    votesAgainst: 850,
    totalVotes: 2100,
    endTime: "2024-06-01",
    category: "Tax Rate",
    affectedZone: "Residential Zone",
    details:
      "The current tax rate of 10% in the Residential Zone is insufficient to fund planned upgrades to the community kitchen. This proposal seeks to increase the rate to 12%, which would generate an additional 250 DAI per day. These funds would be allocated specifically to kitchen equipment upgrades and expanded food services.",
  },
  {
    id: 2,
    title: "Add New E-Bike Fleet to Mobility Hub",
    description:
      "Proposal to allocate 5000 DAI from the treasury to purchase 10 new e-bikes for the community.",
    status: "active",
    proposer: "0x4d5...6e7f",
    proposerName: "Maya Chen",
    proposerWeight: 180,
    votesFor: 1800,
    votesAgainst: 400,
    totalVotes: 2200,
    endTime: "2024-05-28",
    category: "Resource Allocation",
    affectedZone: "Mobility Hub",
    details:
      "This proposal seeks to expand our e-bike fleet by adding 10 new high-quality e-bikes. The current fleet is frequently at 100% utilization, indicating strong demand. The new bikes would be subject to the same Harberger tax system as our existing fleet, generating approximately 30 DAI per day in tax revenue when fully utilized.",
  },
  {
    id: 3,
    title: "Modify Eligibility Rules for Innovation Zone",
    description:
      "Proposal to expand eligibility for Innovation Zone resources to include all community members with verified skills.",
    status: "active",
    proposer: "0x7g8...9h0i",
    proposerName: "Jamal Washington",
    proposerWeight: 320,
    votesFor: 950,
    votesAgainst: 1050,
    totalVotes: 2000,
    endTime: "2024-05-30",
    category: "Eligibility Rules",
    affectedZone: "Innovation Zone",
    details:
      "Currently, access to Innovation Zone resources is limited to researchers and builders with specific credentials. This proposal would expand eligibility to include any community member with verified skills relevant to innovation projects. This change would be implemented through a modification to the zone's custom hook contract, requiring skill attestations in a member's SBT.",
  },
  {
    id: 4,
    title: "Implement Dutch Auction for Community Hub Spaces",
    description:
      "Proposal to apply Dutch auction depreciation logic to unoccupied spaces in the Community Hub.",
    status: "completed",
    proposer: "0x0j1...2k3l",
    proposerName: "Sophia Lee",
    proposerWeight: 210,
    votesFor: 1650,
    votesAgainst: 550,
    totalVotes: 2200,
    endTime: "2024-05-15",
    category: "Price Mechanism",
    affectedZone: "Community Hub",
    details:
      "This proposal, which has passed, implements Dutch auction depreciation logic for Community Hub spaces. When spaces remain unoccupied, their price will automatically decrease by 5% per day until claimed. This mechanism ensures efficient allocation of community resources and prevents spaces from remaining unused due to overpricing.",
    result: "passed",
    implementation: "2024-05-20",
  },
  {
    id: 5,
    title: "Reduce Wellness Area Tax Rate to 5%",
    description:
      "Proposal to reduce the tax rate in the Wellness Area from 7% to 5% to encourage more usage.",
    status: "completed",
    proposer: "0x4m5...6n7o",
    proposerName: "Dr. Marcus Johnson",
    proposerWeight: 175,
    votesFor: 800,
    votesAgainst: 1200,
    totalVotes: 2000,
    endTime: "2024-05-10",
    category: "Tax Rate",
    affectedZone: "Wellness Area",
    details:
      "This proposal, which did not pass, sought to reduce the tax rate in the Wellness Area to encourage more community members to utilize these resources. The community voted against this change, with concerns about reduced funding for wellness programs outweighing the potential benefits of increased usage.",
    result: "rejected",
    implementation: null,
  },
  // New proposals for resource and zone changes
  {
    id: 6,
    title: "Add New Resource: Community Garden Plot",
    description:
      "Proposal to add a new resource type for community garden plots in the Residential Zone.",
    status: "active",
    proposer: "0x1a2...3b4c",
    proposerName: "Alex Rivera",
    proposerWeight: 245,
    votesFor: 950,
    votesAgainst: 350,
    totalVotes: 1300,
    endTime: "2024-06-05",
    category: "New Resource",
    affectedZone: "Residential Zone",
    details:
      "This proposal seeks to add 10 community garden plots as resources in the Residential Zone. Each plot would be 4x4 meters, with water access and basic gardening tools provided. The plots would be subject to Harberger taxation with an initial value of 30 DAI and a tax rate of 10% (3 DAI daily). This would provide residents with space to grow their own food and contribute to community sustainability.",
  },
  {
    id: 7,
    title: "Create New City Zone: Education Hub",
    description:
      "Proposal to establish a new Education Hub zone with specialized resources for learning.",
    status: "active",
    proposer: "0x4d5...6e7f",
    proposerName: "Maya Chen",
    proposerWeight: 180,
    votesFor: 1200,
    votesAgainst: 600,
    totalVotes: 1800,
    endTime: "2024-06-10",
    category: "New Zone",
    affectedZone: "N/A",
    details:
      "This proposal would create a new Education Hub zone dedicated to learning resources. The zone would have a tax rate of 9% and include resources such as study rooms, library spaces, and teaching equipment. Eligibility would be open to all community members, with special priority for those with teaching attestations. This zone would fill a gap in our current resource allocation system and support knowledge sharing within the community.",
  },
];

// Sample data for governance stats
const governanceStats = {
  totalProposals: 27,
  activeProposals: 5, // Updated to include new proposals
  completedProposals: 24,
  passRate: 75,
  averageVoterParticipation: 68,
  topVoters: [
    { address: "0x1a2...3b4c", name: "Alex Rivera", weight: 245 },
    { address: "0x7g8...9h0i", name: "Jamal Washington", weight: 320 },
    { address: "0x4d5...6e7f", name: "Maya Chen", weight: 180 },
  ],
};

export function GovernanceOverview() {
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleProposalClick = (proposal: any) => {
    setSelectedProposal(proposal);
    setIsDialogOpen(true);
  };

  const activeProposals = proposals.filter((p) => p.status === "active");
  const completedProposals = proposals.filter((p) => p.status === "completed");

  // Group active proposals by category
  const resourceProposals = activeProposals.filter(
    (p) => p.category === "New Resource" || p.category === "Resource Allocation"
  );
  const zoneProposals = activeProposals.filter(
    (p) =>
      p.category === "New Zone" ||
      p.category === "Tax Rate" ||
      p.category === "Eligibility Rules"
  );
  const otherProposals = activeProposals.filter(
    (p) => !resourceProposals.includes(p) && !zoneProposals.includes(p)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Governance Overview</CardTitle>
          <CardDescription>
            Governance weight is derived from Harberger tax payments. The more
            you pay, the more you care, the more you vote.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600">
                  Total Proposals
                </span>
                <span className="text-lg font-bold">
                  {governanceStats.totalProposals}
                </span>
              </div>
            </div>
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600">
                  Pass Rate
                </span>
                <span className="text-lg font-bold">
                  {governanceStats.passRate}%
                </span>
              </div>
            </div>
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600">
                  Voter Participation
                </span>
                <span className="text-lg font-bold">
                  {governanceStats.averageVoterParticipation}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active Proposals ({activeProposals.length})
          </TabsTrigger>
          <TabsTrigger value="resources">
            Resource Changes ({resourceProposals.length})
          </TabsTrigger>
          <TabsTrigger value="zones">
            Zone Changes ({zoneProposals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 pt-4">
          {activeProposals.map((proposal) => (
            <Card
              key={proposal.id}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-medium">
                    {proposal.title}
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <CardDescription>{proposal.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Proposer:</span>
                    <span className="font-medium">{proposal.proposerName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Voting Ends:</span>
                    <span className="font-medium">
                      {formatDate(proposal.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Category:</span>
                    <Badge variant="outline">{proposal.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Affected Zone:</span>
                    <Badge variant="outline">{proposal.affectedZone}</Badge>
                  </div>
                </div>

                <div className="mb-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600">
                      For: {proposal.votesFor}
                    </span>
                    <span className="text-red-600">
                      Against: {proposal.votesAgainst}
                    </span>
                  </div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-stone-200">
                    <div
                      className="bg-green-500"
                      style={{
                        width: `${
                          (proposal.votesFor / proposal.totalVotes) * 100
                        }%`,
                      }}
                    ></div>
                    <div
                      className="bg-red-500"
                      style={{
                        width: `${
                          (proposal.votesAgainst / proposal.totalVotes) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-stone-500">
                    {((proposal.votesFor / proposal.totalVotes) * 100).toFixed(
                      1
                    )}
                    % in favor
                  </div>
                </div>
              </CardContent>
              <div className="flex border-t border-stone-100 p-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleProposalClick(proposal)}
                >
                  View Details
                </Button>
                <Button
                  className="bg-stone-800 text-white hover:bg-stone-700"
                  size="sm"
                >
                  <Vote className="mr-2 h-4 w-4" />
                  Cast Vote
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4 pt-4">
          {resourceProposals.map((proposal) => (
            <Card
              key={proposal.id}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-medium">
                    {proposal.title}
                  </CardTitle>
                  <Badge className="bg-blue-100 text-blue-800">
                    Resource Change
                  </Badge>
                </div>
                <CardDescription>{proposal.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Proposer:</span>
                    <span className="font-medium">{proposal.proposerName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Voting Ends:</span>
                    <span className="font-medium">
                      {formatDate(proposal.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Category:</span>
                    <Badge variant="outline">{proposal.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Affected Zone:</span>
                    <Badge variant="outline">{proposal.affectedZone}</Badge>
                  </div>
                </div>

                <div className="mb-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600">
                      For: {proposal.votesFor}
                    </span>
                    <span className="text-red-600">
                      Against: {proposal.votesAgainst}
                    </span>
                  </div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-stone-200">
                    <div
                      className="bg-green-500"
                      style={{
                        width: `${
                          (proposal.votesFor / proposal.totalVotes) * 100
                        }%`,
                      }}
                    ></div>
                    <div
                      className="bg-red-500"
                      style={{
                        width: `${
                          (proposal.votesAgainst / proposal.totalVotes) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-stone-500">
                    {((proposal.votesFor / proposal.totalVotes) * 100).toFixed(
                      1
                    )}
                    % in favor
                  </div>
                </div>
              </CardContent>
              <div className="flex border-t border-stone-100 p-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleProposalClick(proposal)}
                >
                  View Details
                </Button>
                <Button
                  className="bg-stone-800 text-white hover:bg-stone-700"
                  size="sm"
                >
                  <Vote className="mr-2 h-4 w-4" />
                  Cast Vote
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="zones" className="space-y-4 pt-4">
          {zoneProposals.map((proposal) => (
            <Card
              key={proposal.id}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-medium">
                    {proposal.title}
                  </CardTitle>
                  <Badge className="bg-purple-100 text-purple-800">
                    Zone Change
                  </Badge>
                </div>
                <CardDescription>{proposal.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Proposer:</span>
                    <span className="font-medium">{proposal.proposerName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Voting Ends:</span>
                    <span className="font-medium">
                      {formatDate(proposal.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Category:</span>
                    <Badge variant="outline">{proposal.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Affected Zone:</span>
                    <Badge variant="outline">{proposal.affectedZone}</Badge>
                  </div>
                </div>

                <div className="mb-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600">
                      For: {proposal.votesFor}
                    </span>
                    <span className="text-red-600">
                      Against: {proposal.votesAgainst}
                    </span>
                  </div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-stone-200">
                    <div
                      className="bg-green-500"
                      style={{
                        width: `${
                          (proposal.votesFor / proposal.totalVotes) * 100
                        }%`,
                      }}
                    ></div>
                    <div
                      className="bg-red-500"
                      style={{
                        width: `${
                          (proposal.votesAgainst / proposal.totalVotes) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-stone-500">
                    {((proposal.votesFor / proposal.totalVotes) * 100).toFixed(
                      1
                    )}
                    % in favor
                  </div>
                </div>
              </CardContent>
              <div className="flex border-t border-stone-100 p-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleProposalClick(proposal)}
                >
                  View Details
                </Button>
                <Button
                  className="bg-stone-800 text-white hover:bg-stone-700"
                  size="sm"
                >
                  <Vote className="mr-2 h-4 w-4" />
                  Cast Vote
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Top Governance Contributors
          </CardTitle>
          <CardDescription>
            Based on tax payments and governance weight
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {governanceStats.topVoters.map((voter, index) => (
              <div key={voter.address} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-stone-200 text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{voter.name}</span>
                  </div>
                  <span className="text-sm">{voter.weight} weight</span>
                </div>
                <Progress
                  value={
                    (voter.weight / governanceStats.topVoters[0].weight) * 100
                  }
                  className="h-1.5"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedProposal && (
        <ProposalDetailsDialog
          proposal={selectedProposal}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </div>
  );
}
