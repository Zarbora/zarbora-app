"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import {
  AlertCircle,
  Clock,
  CreditCard,
  HelpCircle,
  Info,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Separator } from "@/components/ui/separator";
import type { Database } from "@/types/supabase";

type Resource = Database["public"]["Tables"]["resources"]["Row"];

interface ResourceDetailsDialogProps {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResourceUpdated: () => void;
}

export function ResourceDetailsDialog({
  resource,
  open,
  onOpenChange,
  onResourceUpdated,
}: ResourceDetailsDialogProps) {
  const { address } = useAuth();
  const [isReleaseRequested, setIsReleaseRequested] = useState(false);
  const [newValue, setNewValue] = useState(resource?.current_value || 0);
  const [isUpdatingValue, setIsUpdatingValue] = useState(false);

  const isOwner = resource?.current_owner_address === address;

  const calculateReleaseStatus = () => {
    if (!resource?.current_owner_address) return null;

    const now = new Date();
    const acquiredDate = new Date(resource.acquired_date || now);
    const minHoldingEndDate = new Date(acquiredDate);
    minHoldingEndDate.setDate(
      minHoldingEndDate.getDate() + (resource.min_holding_period || 0)
    );

    const daysUntilReleasable = Math.ceil(
      (minHoldingEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (isReleaseRequested || resource.release_requested) {
      const releaseDate = new Date(resource.release_request_date || now);
      releaseDate.setDate(
        releaseDate.getDate() + (resource.release_notice || 0)
      );
      const daysUntilRelease = Math.ceil(
        (releaseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        status: "releasing",
        days: daysUntilRelease,
        message: `Release in ${daysUntilRelease} days`,
        canRequestRelease: false,
      };
    }

    if (daysUntilReleasable > 0) {
      return {
        status: "locked",
        days: daysUntilReleasable,
        message: `Must hold for ${daysUntilReleasable} more days`,
        canRequestRelease: false,
      };
    }

    return {
      status: "releasable",
      days: 0,
      message: `Can be released with ${resource.release_notice} ${resource.release_notice_unit}`,
      canRequestRelease: true,
    };
  };

  const releaseStatus = resource?.current_owner_address
    ? calculateReleaseStatus()
    : null;

  const handleRequestRelease = async () => {
    if (!resource) return;

    try {
      await api.resources.requestRelease(resource.id);
      setIsReleaseRequested(true);
      onResourceUpdated();
    } catch (error) {
      console.error("Failed to request release:", error);
    }
  };

  const handleUpdateValue = async () => {
    if (!resource || !isOwner) return;

    try {
      setIsUpdatingValue(true);
      await api.resources.update(resource.id, {
        current_value: newValue,
      });
      onResourceUpdated();
    } catch (error) {
      console.error("Failed to update value:", error);
    } finally {
      setIsUpdatingValue(false);
    }
  };

  if (!resource) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{resource.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {resource.zone_id}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">
              Details
            </TabsTrigger>
            {isOwner && (
              <TabsTrigger value="manage" className="flex-1">
                Manage
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-stone-800">
                Description
              </h3>
              <p className="text-sm text-stone-600">{resource.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-stone-800">
                  Current Value
                </h3>
                <p className="text-sm text-stone-600">
                  {resource.current_value} ETH
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-stone-800">
                  Daily Tax
                </h3>
                <p className="text-sm text-stone-600">
                  {resource.daily_tax} ETH
                </p>
              </div>
            </div>

            {resource.depreciating && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-stone-800">
                  Depreciation
                </h3>
                <div className="rounded-lg border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-stone-600">Original Value</p>
                      <p className="text-sm font-medium">
                        {resource.original_value} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-stone-600">Daily Rate</p>
                      <p className="text-sm font-medium">
                        {resource.depreciation_rate} ETH
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {resource.current_owner_address && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-stone-800">
                  Current Owner
                </h3>
                <div className="rounded-lg border p-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-stone-600">Address</p>
                      <p className="text-sm font-medium">
                        {resource.current_owner_address}
                      </p>
                    </div>
                    {resource.current_owner_name && (
                      <div>
                        <p className="text-sm text-stone-600">Name</p>
                        <p className="text-sm font-medium">
                          {resource.current_owner_name}
                        </p>
                      </div>
                    )}
                    {resource.acquired_date && (
                      <div>
                        <p className="text-sm text-stone-600">Acquired</p>
                        <p className="text-sm font-medium">
                          {formatDate(resource.acquired_date)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {isOwner && (
            <TabsContent value="manage" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-stone-800">
                    Update Value
                  </h3>
                  <p className="text-sm text-stone-600">
                    Set a new value for your resource. This will affect your
                    daily tax payment.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="value">New Value (ETH)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="value"
                        type="number"
                        value={newValue}
                        onChange={(e) => setNewValue(Number(e.target.value))}
                        min={0}
                      />
                      <Button
                        onClick={handleUpdateValue}
                        disabled={isUpdatingValue}
                      >
                        Update
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">New Daily Tax</p>
                        <p className="text-2xl font-bold">
                          {(newValue * 0.1).toFixed(2)} ETH
                        </p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>10% annual tax rate, paid daily</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-stone-800">
                    Release Resource
                  </h3>
                  <p className="text-sm text-stone-600">
                    Request to release this resource. This will make it
                    available for others to claim.
                  </p>
                </div>

                {releaseStatus && (
                  <Alert
                    variant={
                      releaseStatus.status === "releasing"
                        ? "destructive"
                        : releaseStatus.status === "locked"
                        ? "destructive"
                        : "default"
                    }
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>
                      {releaseStatus.status === "releasing"
                        ? "Release in Progress"
                        : releaseStatus.status === "locked"
                        ? "Holding Period"
                        : "Ready to Release"}
                    </AlertTitle>
                    <AlertDescription>{releaseStatus.message}</AlertDescription>
                  </Alert>
                )}

                <Button
                  variant="destructive"
                  onClick={handleRequestRelease}
                  disabled={
                    !releaseStatus?.canRequestRelease || isReleaseRequested
                  }
                  className="w-full"
                >
                  Request Release
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
