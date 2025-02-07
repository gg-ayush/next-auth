import { getApplicationUsers } from "@/services/user"
import { UsersPage } from "./users-page"

interface User {
  id: string
  email: string | null
  username: string | null
  phone_number: string | null
  lastSignedIn?: string | null
  joined: string
}

export async function UsersWrapper({ applicationId }: { applicationId: string }) {
  console.log(`UsersWrapper: Fetching users for application ${applicationId}`)
  const result = await getApplicationUsers(applicationId)

  if (!result.success || !result.data) {
    console.error("Failed to fetch users:", result.error)
    // Return empty array instead of null to maintain type safety
    return <UsersPage initialUsers={[]} applicationId={applicationId} />
  }

  console.log(`UsersWrapper: Fetched ${result.data.length} users`)

  return <UsersPage initialUsers={result.data as User[]} applicationId={applicationId} />
}

