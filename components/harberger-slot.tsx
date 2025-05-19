"use client"

import { useState } from "react"
import { Clock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function HarbergerSlot() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Sample data for the premium slot
  const slotData = {
    currentPrice: 75,
    currentOwner: "0x1a2...3b4c",
    hourlyRate: 7.5,
    remainingTime: "2 days, 4 hours",
  }

  return (
    <>
      <div className="flex items-center justify-between bg-amber-50 px-4 py-2 text-amber-800">
        <div className="flex items-center text-xs">
          <Clock className="mr-1 h-3 w-3" />
          <span>Premium Slot</span>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs font-normal text-amber-800">
              Buy Slot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buy Premium Slot</DialogTitle>
              <DialogDescription>
                You can purchase this premium slot at the current owner's valuation price.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Current Price</Label>
                  <div className="mt-1 rounded-md border border-stone-200 bg-stone-50 p-2">
                    <span className="font-medium">{slotData.currentPrice} DAI</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Current Owner</Label>
                  <div className="mt-1 rounded-md border border-stone-200 bg-stone-50 p-2">
                    <span className="font-mono text-sm">{slotData.currentOwner}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Hourly Rate</Label>
                  <div className="mt-1 rounded-md border border-stone-200 bg-stone-50 p-2">
                    <span>{slotData.hourlyRate} DAI/hour</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Remaining Time</Label>
                  <div className="mt-1 rounded-md border border-stone-200 bg-stone-50 p-2">
                    <span>{slotData.remainingTime}</span>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="new-valuation" className="text-sm">
                  Your New Valuation (Optional)
                </Label>
                <Input
                  id="new-valuation"
                  type="number"
                  placeholder="Enter your valuation in DAI"
                  defaultValue={slotData.currentPrice}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-stone-500">
                  This will be your stated price and will determine your tax rate.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-amber-600 text-white hover:bg-amber-700">
                <CreditCard className="mr-2 h-4 w-4" />
                Buy Slot for {slotData.currentPrice} DAI
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
