import type { Application } from "@/core/types/application"
import { ApplicationSwitcher } from "./application-switcher"
import { auth } from "@/auth"
import { getApplications } from "@/app/actions/auth/developer"

export async function ApplicationSwitcherWrapper({ currentApplicationId }: { currentApplicationId: string }) {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  const { success, data: applications } = await getApplications()

  if (!success || !applications?.length) {
    return null
  }

  return (
    <ApplicationSwitcher applications={applications as Application[]} currentApplicationId={currentApplicationId} />
  )
}

