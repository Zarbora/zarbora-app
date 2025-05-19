"use client"

import { useState } from "react"
import { AlertCircle, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function HarbergerPricing() {
  const [valuation, setValuation] = useState(50)
  const taxRate = 0.1 // 10% Harberger tax rate
  const hourlyRent = valuation * taxRate
  const dailyRent = hourlyRent * 24
  const retentionDays = Math.floor(valuation / dailyRent)

  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-base font-medium text-stone-800">Harberger Slot Pricing</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">Harberger tax explanation</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Harberger taxes ensure efficient allocation of premium slots. You set your valuation and pay a
                continuous tax based on it. Anyone can buy your slot at your stated price. Higher valuations mean higher
                taxes but more security.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>How Harberger Slots Work</AlertTitle>
        <AlertDescription className="text-xs">
          1. You set your valuation for the premium slot
          <br />
          2. You pay a continuous tax based on your valuation
          <br />
          3. Anyone can buy your slot at your stated price
          <br />
          4. Higher valuations = higher taxes but more security
        </AlertDescription>
      </Alert>

      <div className="mb-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="valuation" className="text-sm">
              Your Valuation (DAI)
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
            <Label htmlFor="hourly-rent" className="text-sm">
              Hourly Rent
            </Label>
            <Input id="hourly-rent" value={`${hourlyRent.toFixed(2)} DAI`} readOnly className="mt-1" />
          </div>
          <div>
            <Label htmlFor="daily-rent" className="text-sm">
              Daily Rent
            </Label>
            <Input id="daily-rent" value={`${dailyRent.toFixed(2)} DAI`} readOnly className="mt-1" />
          </div>
        </div>

        <div>
          <Label className="text-sm">Retention Period (if no buyout)</Label>
          <div className="mt-1 rounded-md border border-stone-200 bg-stone-100 p-2 text-center">
            <span className="text-lg font-medium">{retentionDays} days</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-stone-500">
        Note: You only pay while you hold the slot. Taxes fund community resources.
      </div>
    </div>
  )
}
