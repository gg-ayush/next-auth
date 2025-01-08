'use client'

import { useState, useEffect } from "react"
import { Plus, Search, Settings } from 'lucide-react'
import { ApplicationSelector } from "@/ui/application-selector"
import { Button } from "@/ui/button/button"
import { Input } from "@/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs"
import { DeveloperActions } from "./DeveloperActions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog"

interface Application {
  id: string
  name: string
  description: string
}

interface User {
  id: string
  name: string
  username: string
  phoneNumber: string
  lastSignedIn: string
  joined: string
}

export function DeveloperDashboard({ 
  initialApplications,
  session 
}: { 
  initialApplications: Application[] | undefined,
  session: any 
}) {
  const [applications, setApplications] = useState<Application[]>(initialApplications || [])
  const [selectedAppId, setSelectedAppId] = useState<string>(() => {
    return applications.length > 0 ? applications[0].id : ''
  })
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (selectedAppId) {
      // Fetch users for the selected application
      // This is a mock implementation. Replace with actual API call.
      const mockUsers: User[] = [
        { id: '1', name: 'John Doe', username: 'johnd', phoneNumber: '+1234567890', lastSignedIn: '2023-06-01', joined: '2023-01-01' },
        { id: '2', name: 'Jane Smith', username: 'janes', phoneNumber: '+0987654321', lastSignedIn: '2023-06-02', joined: '2023-02-15' },
      ]
      setUsers(mockUsers)
    }
  }, [selectedAppId])

  const handleCreateApplication = (newApp: Application) => {
    setApplications([...applications, newApp])
    setSelectedAppId(newApp.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {applications.length > 0 ? (
          <ApplicationSelector 
            applications={applications}
            selectedId={selectedAppId}
            onSelect={setSelectedAppId}
          />
        ) : (
          <p className="text-muted-foreground">No applications available.</p>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {applications.length === 0 ? 'Add application' : 'Create application'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Application</DialogTitle>
            </DialogHeader>
            <DeveloperActions />
          </DialogContent>
        </Dialog>
      </div>

      {applications.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="configure">Configure</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">Total Users</h3>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">Active Users</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">Recent Activity</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users..." 
                  className="w-[300px]"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Create user</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                  </DialogHeader>
                  <DeveloperActions />
                </DialogContent>
              </Dialog>
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
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No users yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.phoneNumber}</TableCell>
                        <TableCell>{user.lastSignedIn}</TableCell>
                        <TableCell>{user.joined}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="configure" className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <h3 className="font-semibold">Application Settings</h3>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Application Name</label>
                  <Input className="mt-1" value={applications.find(app => app.id === selectedAppId)?.name || ''} />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input className="mt-1" value={applications.find(app => app.id === selectedAppId)?.description || ''} />
                </div>
                <Button>Save Changes</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}