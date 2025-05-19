"use client"

import { AlertCircle, FileText, ThumbsDown, ThumbsUp, Vote } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

interface ProposalDetailsDialogProps {
  proposal: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProposalDetailsDialog({ proposal, open, onOpenChange }: ProposalDetailsDialogProps) {
  const [voteAmount, setVoteAmount] = useState(50)
  const [voteDirection, setVoteDirection] = useState<"for" | "against" | null>(null)

  // Calculate percentages for the vote visualization
  const forPercentage = (proposal.votesFor / proposal.totalVotes) * 100
  const againstPercentage = (proposal.votesAgainst / proposal.totalVotes) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{proposal.title}</DialogTitle>
            {proposal.status === "completed" && (
              <Badge
                className={proposal.result === "passed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              >
                {proposal.result === "passed" ? "Passed" : "Rejected"}
              </Badge>
            )}
            {proposal.status === "active" && <Badge className="bg-green-100 text-green-800">Active</Badge>}
          </div>
          <DialogDescription>{proposal.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={proposal.status === "active" ? "details" : "results"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Proposal Details</TabsTrigger>
            <TabsTrigger value="results">
              {proposal.status === "active" ? "Current Results" : "Final Results"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-stone-800">Full Description</h3>
              <p className="text-sm text-stone-600">{proposal.details}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-stone-800">Proposer</h3>
                <p className="text-sm text-stone-600">{proposal.proposerName}</p>
                <p className="text-xs text-stone-500">{proposal.proposer}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-stone-800">Proposer Weight</h3>
                <p className="text-sm text-stone-600">{proposal.proposerWeight}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-stone-800">Category</h3>
                <p className="text-sm text-stone-600">{proposal.category}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-stone-800">Affected Zone</h3>
                <p className="text-sm text-stone-600">{proposal.affectedZone}</p>
              </div>
              {proposal.status === "active" && (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-stone-800">Voting Ends</h3>
                  <p className="text-sm text-stone-600">{new Date(proposal.endTime).toLocaleDateString()}</p>
                </div>
              )}
              {proposal.status === "completed" && (
                <>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-stone-800">Ended On</h3>
                    <p className="text-sm text-stone-600">{new Date(proposal.endTime).toLocaleDateString()}</p>
                  </div>
                  {proposal.implementation && (
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-stone-800">Implemented On</h3>
                      <p className="text-sm text-stone-600">{new Date(proposal.implementation).toLocaleDateString()}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {proposal.status === "active" && (
              <Alert>
                <Vote className="h-4 w-4" />
                <AlertTitle>Voting is Active</AlertTitle>
                <AlertDescription>
                  Your voting weight is determined by your Harberger tax contributions. The more you pay in taxes, the
                  more weight your vote carries.
                </AlertDescription>
              </Alert>
            )}

            {proposal.status === "completed" && proposal.result === "passed" && (
              <Alert className="bg-green-50 text-green-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Proposal Passed</AlertTitle>
                <AlertDescription>
                  This proposal has been approved by the community and has been implemented.
                </AlertDescription>
              </Alert>
            )}

            {proposal.status === "completed" && proposal.result === "rejected" && (
              <Alert className="bg-red-50 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Proposal Rejected</AlertTitle>
                <AlertDescription>
                  This proposal did not receive enough support from the community and was not implemented.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Voting Results</CardTitle>
                <CardDescription>{proposal.status === "active" ? "Current standings" : "Final tally"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ThumbsUp className="mr-2 h-4 w-4 text-green-600" />
                      <span className="font-medium">For</span>
                    </div>
                    <span>
                      {proposal.votesFor} votes ({forPercentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
                    <div className="bg-green-500" style={{ width: `${forPercentage}%` }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ThumbsDown className="mr-2 h-4 w-4 text-red-600" />
                      <span className="font-medium">Against</span>
                    </div>
                    <span>
                      {proposal.votesAgainst} votes ({againstPercentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
                    <div className="bg-red-500" style={{ width: `${againstPercentage}%` }}></div>
                  </div>
                </div>

                <div className="text-center text-sm text-stone-600">Total Votes: {proposal.totalVotes}</div>
              </CardContent>
            </Card>

            {proposal.status === "active" && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Cast Your Vote</CardTitle>
                  <CardDescription>Your current voting weight: 120</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Vote Amount</span>
                      <span className="text-sm font-medium">{voteAmount} weight</span>
                    </div>
                    <Slider
                      value={[voteAmount]}
                      max={120}
                      step={1}
                      onValueChange={(value) => setVoteAmount(value[0])}
                    />
                    <p className="text-xs text-stone-500">
                      Slide to adjust how much of your voting weight to allocate to this proposal.
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      className={`flex-1 ${
                        voteDirection === "for"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-stone-100 text-stone-800 hover:bg-stone-200"
                      }`}
                      onClick={() => setVoteDirection("for")}
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      For
                    </Button>
                    <Button
                      className={`flex-1 ${
                        voteDirection === "against"
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-stone-100 text-stone-800 hover:bg-stone-200"
                      }`}
                      onClick={() => setVoteDirection("against")}
                    >
                      <ThumbsDown className="mr-2 h-4 w-4" />
                      Against
                    </Button>
                  </div>
                </CardContent>
                <div className="border-t border-stone-100 p-3">
                  <Button className="w-full bg-stone-800 text-white hover:bg-stone-700" disabled={!voteDirection}>
                    <Vote className="mr-2 h-4 w-4" />
                    Submit Vote
                  </Button>
                </div>
              </Card>
            )}

            {proposal.status === "completed" && (
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertTitle>Voting Closed</AlertTitle>
                <AlertDescription>
                  Voting for this proposal has ended. The results shown above are final.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
