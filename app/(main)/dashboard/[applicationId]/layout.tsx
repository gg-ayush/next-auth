import { ApplicationSwitcherWrapper } from "@/_components/application/application-switcher-wrapper"
import { CreateApplicationDialog } from "@/components/create-application-dialog"
import { Button } from "@/ui/button"
import { Building2, HelpCircle, Settings } from "lucide-react"
import { DashboardTabs } from "./dashboard-tabs"

interface DashboardLayoutProps {
  children: React.ReactNode
  params: { applicationId: string }
  overview: React.ReactNode
  users: React.ReactNode
  configure: React.ReactNode
}

export default function DashboardLayout({ children, params, overview, users, configure }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white">
      <header className="border-b border-neutral-800">
        <div className="flex h-14 items-center gap-4 px-4">
          <Building2 className="h-8 w-8" />

          <div className="flex items-center gap-2">
            <ApplicationSwitcherWrapper currentApplicationId={params.applicationId} />
            <CreateApplicationDialog />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <DashboardTabs overview={overview} users={users} configure={configure} />
      </header>
      <main className="p-4">{children}</main>
    </div>
  )
}

