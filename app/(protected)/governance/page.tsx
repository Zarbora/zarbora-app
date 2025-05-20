import { GovernanceOverview } from "@/components/governance-overview"

export default function GovernancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">Governance</h1>
        <p className="mt-2 text-sm text-stone-600">
          Vote on proposals that affect the city. Your governance weight is derived from your Harberger tax payments.
        </p>
      </div>
      <GovernanceOverview />
    </div>
  )
}
