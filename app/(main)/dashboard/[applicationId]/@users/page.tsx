import { UsersWrapper } from "./users-wrapper"

export default function UsersPage({ params }: { params: { applicationId: string } }) {
  return <UsersWrapper applicationId={params.applicationId} />
}