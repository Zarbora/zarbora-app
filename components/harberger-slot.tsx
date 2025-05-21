"use client";

import { useState, useEffect } from "react";
import { Clock, CreditCard } from "lucide-react";
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
import { api } from "@/lib/api";

interface HarbergerSlotProps {
  eventId: string;
}

interface SlotData {
  currentPrice: number;
  currentOwner: string;
  hourlyRate: number;
  remainingTime: string;
}

export function HarbergerSlot({ eventId }: HarbergerSlotProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [slotData, setSlotData] = useState<SlotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSlotData() {
      try {
        const data = await api.harbergerSlots.getByEvent(eventId);
        setSlotData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load slot data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadSlotData();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-between bg-amber-50 px-4 py-2 text-amber-800">
        <div className="flex items-center text-xs">
          <Clock className="mr-1 h-3 w-3" />
          <span>Loading slot data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between bg-red-50 px-4 py-2 text-red-800">
        <div className="flex items-center text-xs">
          <Clock className="mr-1 h-3 w-3" />
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  if (!slotData) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between bg-amber-50 px-4 py-2 text-amber-800">
        <div className="flex items-center text-xs">
          <Clock className="mr-1 h-3 w-3" />
          <span>Premium Slot</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => setIsDialogOpen(true)}
        >
          {slotData.currentPrice} ETH
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Premium Slot Details</DialogTitle>
            <DialogDescription>
              This slot uses Harberger taxes to ensure efficient allocation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Current Price</Label>
              <div className="mt-1 text-lg font-medium">
                {slotData.currentPrice} ETH
              </div>
              <p className="text-xs text-stone-500">
                Set by current owner: {slotData.currentOwner}
              </p>
            </div>

            <div>
              <Label>Hourly Tax Rate</Label>
              <div className="mt-1 text-lg font-medium">
                {slotData.hourlyRate} ETH/hour
              </div>
              <p className="text-xs text-stone-500">
                Based on 10% annual tax rate
              </p>
            </div>

            <div>
              <Label>Time Until Next Tax Payment</Label>
              <div className="mt-1 text-lg font-medium">
                {slotData.remainingTime}
              </div>
              <p className="text-xs text-stone-500">
                Tax payments are made continuously
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button className="bg-stone-800 text-white hover:bg-stone-700">
              Buy Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
