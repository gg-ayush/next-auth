import { getApplications } from "@/actions/auth/developer"
import { CreateApplicationDialog } from "@/components/create-application-dialog"
import { Building2 } from "lucide-react"
import { Button } from "@/ui/button"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const { success, data: applications } = await getApplications()

  if (!success || !applications?.length) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-semibold">No applications found</h1>
          <p className="text-sm text-muted-foreground">Get started by creating your first application</p>
        </div>
        <CreateApplicationDialog />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Your Applications</h1>
        <p className="text-sm text-muted-foreground">Select an application to view its dashboard</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {applications.map((app) => (
          <Link
            key={app.id}
            href={`/dashboard/${app.id}`}
            className="group relative rounded-lg border p-6 hover:border-foreground"
          >
            <h2 className="font-semibold">{app.name}</h2>
            {app.description && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{app.description}</p>}
            <Button className="absolute right-4 top-4 opacity-0 group-hover:opacity-100" variant="ghost" size="sm">
              View Dashboard
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}

