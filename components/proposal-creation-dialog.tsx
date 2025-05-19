"use client"

import { useState } from "react"
import { FileText, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface ProposalCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proposalType: "resource" | "zone"
  action: "add" | "edit"
  itemName: string
}

export function ProposalCreationDialog({
  open,
  onOpenChange,
  proposalType,
  action,
  itemName,
}: ProposalCreationDialogProps) {
  const [title, setTitle] = useState(
    `${action === "add" ? "Add New" : "Update"} ${proposalType === "resource" ? "Resource" : "City Zone"}: ${itemName}`,
  )
  const [description, setDescription] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    // In a real app, this would send the proposal to the backend
    console.log("Proposal submitted:", { title, description, proposalType, action, itemName })

    // Simulate submission
    setSubmitted(true)

    // In a real app, we would redirect to the proposal page or show a success message
    setTimeout(() => {
      setSubmitted(false)
      onOpenChange(false)
    }, 3000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Governance Proposal</DialogTitle>
          <DialogDescription>
            This {action === "add" ? "new" : "updated"} {proposalType} will require community approval through voting.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-6">
            <Alert className="bg-green-50 text-green-800">
              <Vote className="h-4 w-4" />
              <AlertTitle>Proposal Submitted Successfully</AlertTitle>
              <AlertDescription>
                Your proposal has been submitted to governance for voting. You can track its status in the Governance
                section.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="proposal-title">Proposal Title</Label>
              <Input id="proposal-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposal-description">Description</Label>
              <Textarea
                id="proposal-description"
                placeholder="Explain why this change is needed and how it benefits the community..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Proposal Type</Label>
              <div className="flex items-center space-x-2">
                <Badge className="bg-stone-100 text-stone-800">{action === "add" ? "Addition" : "Modification"}</Badge>
                <Badge className="bg-stone-100 text-stone-800">
                  {proposalType === "resource" ? "Resource" : "City Zone"}
                </Badge>
              </div>
            </div>

            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Governance Process</AlertTitle>
              <AlertDescription>
                This proposal will be open for voting for 7 days. If approved by the community, the changes will be
                implemented automatically.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <DialogFooter>
          {!submitted && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-stone-800 text-white hover:bg-stone-700">
                <Vote className="mr-2 h-4 w-4" />
                Submit Proposal
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
