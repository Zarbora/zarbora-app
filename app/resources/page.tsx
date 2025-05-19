import { ResourcesOverview } from "@/components/resources-overview"
import { ProtectedRoute } from "@/components/protected-route"

export default function ResourcesPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Public Resources</h1>
          <p className="mt-2 text-sm text-stone-600">
            Browse and claim resources governed by Harberger taxes. Set your valuation, pay the tax, and use the
            resource until someone buys it from you.
          </p>
        </div>
        <ResourcesOverview />
      </div>
    </ProtectedRoute>
  )
}
