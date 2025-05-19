"use client"

import { useState } from "react"
import { BarChart3, Coffee, Laptop, Utensils, Wifi } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for resource pools
const resourcePools = [
  {
    id: 1,
    name: "Food & Beverages",
    icon: Utensils,
    collected: 2450,
    target: 3000,
    percentage: 82,
    contributors: 78,
    description: "Funds community meals, snacks, and beverages throughout the event",
  },
  {
    id: 2,
    name: "AV Equipment",
    icon: Laptop,
    collected: 1800,
    target: 2000,
    percentage: 90,
    contributors: 45,
    description: "Provides projectors, sound systems, and recording equipment for sessions",
  },
  {
    id: 3,
    name: "Internet & Connectivity",
    icon: Wifi,
    collected: 950,
    target: 1200,
    percentage: 79,
    contributors: 62,
    description: "Ensures reliable high-speed internet throughout all venues",
  },
  {
    id: 4,
    name: "Coffee Station",
    icon: Coffee,
    collected: 600,
    target: 800,
    percentage: 75,
    contributors: 53,
    description: "Keeps the community caffeinated with quality coffee all day",
  },
]

// Sample data for tax allocation
const taxAllocationData = [
  { category: "Food & Beverages", percentage: 35 },
  { category: "AV Equipment", percentage: 25 },
  { category: "Internet", percentage: 15 },
  { category: "Coffee", percentage: 10 },
  { category: "Venue Maintenance", percentage: 10 },
  { category: "Emergency Fund", percentage: 5 },
]

export function ResourcePoolsDashboard() {
  const [activeTab, setActiveTab] = useState("pools")

  return (
    <div>
      <h2 className="mb-6 text-2xl font-medium text-stone-800">Resource Pools</h2>

      <Tabs defaultValue="pools" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pools">Resource Pools</TabsTrigger>
          <TabsTrigger value="allocation">Tax Allocation</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {resourcePools.map((pool) => (
              <Card key={pool.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-stone-100 p-1.5">
                        <pool.icon className="h-4 w-4 text-stone-600" />
                      </div>
                      <CardTitle className="text-lg font-medium">{pool.name}</CardTitle>
                    </div>
                    <span className="text-sm font-medium text-stone-600">
                      {pool.collected} / {pool.target} DAI
                    </span>
                  </div>
                  <CardDescription>{pool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <Progress value={pool.percentage} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>{pool.percentage}% funded</span>
                    <span>{pool.contributors} contributors</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="allocation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Harberger Tax Allocation</span>
              </CardTitle>
              <CardDescription>
                Transparency on how Harberger taxes from premium slots are allocated to community resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxAllocationData.map((item) => (
                  <div key={item.category}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm text-stone-500">{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-stone-500">Total Harberger taxes collected: 1,245 DAI (last 7 days)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
