import { Avatar, AvatarFallback } from "@/ui/avatar"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/ui/table"

const users = [
  {
    email: 'asd@gmail.com',
    username: 'gg-lama',
    phone: '+19810369952',
    lastSignedIn: '-',
    joined: 'January 10, 2025'
  }
]

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage users, their settings and their information
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="font-semibold">
            All
          </Button>
          <Button variant="ghost">Invitations</Button>
        </div>

        <div className="flex items-center gap-4">
          <Input
            placeholder="Search"
            className="max-w-sm"
          />
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
            <Button>Create user</Button>
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
                <TableRow key={user.email}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.lastSignedIn}</TableCell>
                  <TableCell>{user.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

