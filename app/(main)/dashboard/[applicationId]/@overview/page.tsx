export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Dashboard overview and statistics
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium">Total users</div>
          <div className="text-xs text-muted-foreground">All time</div>
          <div className="mt-2 text-2xl font-bold">1</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium">Active users</div>
          <div className="text-xs text-muted-foreground">January 2025</div>
          <div className="mt-2 text-2xl font-bold">0</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium">Sign-ups</div>
          <div className="text-xs text-muted-foreground">January 2025</div>
          <div className="mt-2 text-2xl font-bold">0</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium">Sign-ins</div>
          <div className="text-xs text-muted-foreground">January 2025</div>
          <div className="mt-2 text-2xl font-bold">0</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold">Recent sign-ups</h2>
          <div className="mt-4 text-sm text-muted-foreground">
            No recent sign-ups to show
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold">Recent sign-ins</h2>
          <div className="mt-4 text-sm text-muted-foreground">
            No recent sign-ins to show
          </div>
        </div>
      </div>
    </div>
  )
}

