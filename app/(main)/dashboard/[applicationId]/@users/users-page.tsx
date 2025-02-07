"use client"

import { CreateUserDialog } from "@/components/create-user-dialog"
import { getApplicationUsers } from "@/services/user"
import { Avatar, AvatarFallback } from "@/ui/avatar"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table"
import { useEffect, useState } from "react"

interface User {
  id: string
  email: string | null
  username: string | null
  phone_number: string | null
  lastSignedIn?: string | null
  joined: string
}

interface UsersPageProps {
  initialUsers: User[]
  applicationId: string
}

export function UsersPage({ initialUsers, applicationId }: UsersPageProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)

  useEffect(() => {
    console.log("UsersPage: Initial users:", initialUsers)
    console.log("UsersPage: Current users state:", users)
  }, [initialUsers, users])

  useEffect(() => {
    const refreshUsers = async () => {
      console.log("UsersPage: Refreshing users")
      const result = await getApplicationUsers(applicationId)
      if (result.success && result.data) {
        setUsers(result.data as User[])
        console.log("UsersPage: Users refreshed, new count:", result.data.length)
      } else {
        console.error("Failed to refresh users:", result.error)
      }
    }

    // Set up an interval to refresh users every 5 seconds
    const intervalId = setInterval(refreshUsers, 5000)

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [applicationId])

  const hasUsers = users.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">Create and manage users, their settings and their information</p>
      </div>

      <div className="space-y-4">
        {hasUsers ? (
          <>
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="font-semibold">
                All
              </Button>
              <Button variant="ghost">Invitations</Button>
            </div>

            <div className="flex items-center gap-4">
              <Input placeholder="Search" className="max-w-sm" />
              <Select defaultValue="joined">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joined">Sort by: Joined</SelectItem>
                  <SelectItem value="username">Sort by: Username</SelectItem>
                  <SelectItem value="last-signed-in">Sort by: Last signed in</SelectItem>
                </SelectContent>
              </Select>
              <div className="ml-auto">
                <CreateUserDialog applicationId={applicationId} />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Phone number</TableHead>
                    <TableHead>Last signed in</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{user.email ? user.email.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                          </Avatar>
                          {user.email || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>{user.username || "N/A"}</TableCell>
                      <TableCell>{user.phone_number || "N/A"}</TableCell>
                      <TableCell>{user.lastSignedIn || "-"}</TableCell>
                      <TableCell>{new Date(user.joined).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <p className="text-sm text-muted-foreground">No users found</p>
            <CreateUserDialog applicationId={applicationId} />
          </div>
        )}
      </div>
    </div>
  )
}

