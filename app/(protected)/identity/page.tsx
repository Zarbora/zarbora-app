import { IdentityOverview } from "@/components/identity-overview"

export default function IdentityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">Identity</h1>
        <p className="mt-2 text-sm text-stone-600">
          View your profile, roles, attestations, and governance participation in the city.
        </p>
      </div>
      <IdentityOverview />
    </div>
  )
}
