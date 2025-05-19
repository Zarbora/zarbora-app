import { ZonesOverview } from "@/components/zones-overview"

export default function ZonesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">City Zones</h1>
        <p className="mt-2 text-sm text-stone-600">
          Explore the different zones in the city, each with its own Harberger tax rate, eligibility rules, and custom
          hooks for resource allocation.
        </p>
      </div>
      <ZonesOverview />
    </div>
  )
}
