"use client"

import { AlertCircle, Check, Code, Shield, Users } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ZoneDetailsDialogProps {
  zone: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ZoneDetailsDialog({ zone, open, onOpenChange }: ZoneDetailsDialogProps) {
  const Icon = zone.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-stone-100 p-2">
              <Icon className="h-5 w-5 text-stone-600" />
            </div>
            <DialogTitle className="text-xl">{zone.name}</DialogTitle>
          </div>
          <DialogDescription>{zone.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="hooks">Custom Hooks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Tax Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{zone.taxRate}%</p>
                  <p className="text-xs text-stone-500">Applied to all resources in this zone</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Daily Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{zone.dailyTaxRevenue} DAI</p>
                  <p className="text-xs text-stone-500">From {zone.resourceCount} resources</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Resource Types</CardTitle>
                <CardDescription>Available in this zone</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {zone.resourceTypes.map((type: string) => (
                    <Badge key={type} className="bg-stone-100 text-stone-800 hover:bg-stone-200">
                      {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Zone Governance</AlertTitle>
              <AlertDescription>
                Tax revenue from this zone is allocated to zone maintenance and community resources. Governance weight
                for zone decisions is proportional to tax payments within the zone.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="eligibility" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Eligibility Rules
                </CardTitle>
                <CardDescription>Who can claim resources in this zone</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {zone.eligibilityRules.map((rule: string) => (
                    <li key={rule} className="flex items-start">
                      <Check className="mr-2 h-4 w-4 text-green-600" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Alert className="bg-stone-50">
              <Shield className="h-4 w-4" />
              <AlertTitle>Verification Process</AlertTitle>
              <AlertDescription>
                Eligibility is verified through SBT attestations and on-chain identity verification. This ensures
                resources are allocated to qualified community members.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="hooks" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="mr-2 h-5 w-5" />
                  Custom Hook Contracts
                </CardTitle>
                <CardDescription>Special rules for resource allocation in this zone</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {zone.customHooks.map((hook: string) => (
                    <li key={hook} className="flex items-start">
                      <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-stone-400"></div>
                      <div>
                        <p className="font-medium">{hook}</p>
                        <p className="text-sm text-stone-500">
                          Custom logic to enforce zone-specific rules and requirements
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Alert className="bg-amber-50 text-amber-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Developer Note</AlertTitle>
              <AlertDescription>
                Custom hooks are implemented as smart contracts that interact with the Harberger tax system. They can
                modify eligibility, pricing, and tax rates based on zone-specific requirements.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
