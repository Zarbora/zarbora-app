"use client";

import { useState } from "react";
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

interface ResourceDetailsDialogProps {
  resource: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResourceDetailsDialog({
  resource,
  open,
  onOpenChange,
}: ResourceDetailsDialogProps) {
  const [valuation, setValuation] = useState(
    resource.currentOwner
      ? resource.currentValue
      : resource.currentDepreciatedValue || resource.currentValue
  );
  const [activeTab, setActiveTab] = useState(
    resource.currentOwner ? "details" : "claim"
  );
  const Icon = resource.icon;

  const taxRate = 0.1; // 10% Harberger tax rate
  const dailyTax = valuation * taxRate;
  const monthlyTax = dailyTax * 30;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-stone-100 p-2">
              <Icon className="h-5 w-5 text-stone-600" />
            </div>
            <DialogTitle className="text-xl">{resource.name}</DialogTitle>
          </div>
          <DialogDescription className="flex items-center text-sm">
            <MapPin className="mr-1 h-3 w-3" />
            {resource.location}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Resource Details</TabsTrigger>
            <TabsTrigger value="claim">
              {resource.currentOwner ? "Buy Resource" : "Claim Resource"}
            </TabsTrigger>
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
                  {resource.currentOwner
                    ? `${resource.currentValue} DAI`
                    : `${
                        resource.currentDepreciatedValue ||
                        resource.currentValue
                      } DAI`}
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-stone-800">
                  Daily Tax
                </h3>
                <p className="text-sm text-stone-600">
                  {resource.dailyTax} DAI
                </p>
              </div>
              {resource.currentOwner && (
                <>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-stone-800">
                      Current Owner
                    </h3>
                    <p className="text-sm text-stone-600">
                      {resource.ownerName || resource.currentOwner}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-stone-800">
                      Occupancy Until
                    </h3>
                    <p className="text-sm text-stone-600">
                      {resource.occupancyEnds
                        ? formatDate(resource.occupancyEnds)
                        : "N/A"}
                    </p>
                  </div>
                </>
              )}
            </div>

            {resource.depreciating && !resource.currentOwner && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>Price Depreciation Active</AlertTitle>
                <AlertDescription>
                  This resource's price is decreasing by{" "}
                  {resource.depreciationRate} DAI per day while unoccupied.
                  Original value: {resource.originalValue} DAI.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-stone-800">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {resource.amenities.map((amenity: string) => (
                  <Badge key={amenity} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="claim" className="space-y-4 pt-4">
            <Alert className="bg-stone-50">
              <Info className="h-4 w-4" />
              <AlertTitle>Harberger Tax System</AlertTitle>
              <AlertDescription>
                1. You set your valuation for this resource
                <br />
                2. You pay a continuous tax based on your valuation
                <br />
                3. Anyone can buy this resource from you at your stated price
                <br />
                4. Higher valuations = higher taxes but more security
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="valuation"
                    className="text-sm flex items-center"
                  >
                    Your Valuation (DAI)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1"
                          >
                            <HelpCircle className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            Set your honest valuation. Too high = pay more tax.
                            Too low = risk someone buying it from you.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <span className="text-sm font-medium">{valuation} DAI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="valuation"
                    min={10}
                    max={500}
                    step={5}
                    value={[valuation]}
                    onValueChange={(value) => setValuation(value[0])}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="daily-tax" className="text-sm">
                    Daily Tax
                  </Label>
                  <Input
                    id="daily-tax"
                    value={`${dailyTax.toFixed(2)} DAI`}
                    readOnly
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="monthly-tax" className="text-sm">
                    Monthly Tax
                  </Label>
                  <Input
                    id="monthly-tax"
                    value={`${monthlyTax.toFixed(2)} DAI`}
                    readOnly
                    className="mt-1"
                  />
                </div>
              </div>

              {resource.currentOwner ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Buy From Current Owner</AlertTitle>
                  <AlertDescription>
                    You are about to buy this resource from{" "}
                    {resource.ownerName || resource.currentOwner} at their
                    stated price of {resource.currentValue} DAI.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
                  <p className="text-sm text-stone-600">
                    By claiming this resource, you agree to pay a continuous tax
                    of {dailyTax.toFixed(2)} DAI per day based on your
                    valuation. Anyone can purchase this resource from you at
                    your stated price of {valuation} DAI.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {activeTab === "claim" && (
            <Button className="bg-stone-800 text-white hover:bg-stone-700">
              <CreditCard className="mr-2 h-4 w-4" />
              {resource.currentOwner
                ? `Buy for ${resource.currentValue} DAI`
                : `Claim for ${valuation} DAI`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
