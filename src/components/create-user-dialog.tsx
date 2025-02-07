"use client"

import { createUserInApplication } from "@/actions/auth/developer"
import { inviteUser } from "@/actions/auth/invitations"
import type { ResponseError, ResponseSuccess } from "@/core/types"
import { toast } from "@/layout/base/toast/use-toast"
import { Button } from "@/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs"
import { Badge } from "@/ui/badge"
import { Checkbox } from "@/ui/checkbox"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"

interface User {
  id: string
  email: string
  username: string
  phone_number: string
}

export function CreateUserDialog({ applicationId }: { applicationId: string }) {
  const [activeTab, setActiveTab] = useState<"create" | "invite">("create")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Create User State
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [ignorePasswordPolicies, setIgnorePasswordPolicies] = useState(false)
  const [countryCode, setCountryCode] = useState("US")

  // Invite User State
  const [inviteEmail, setInviteEmail] = useState("")
  const [expiryDays, setExpiryDays] = useState("30")

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!applicationId) {
      toast({
        title: "Error",
        description: "Application ID is missing",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const payload = {
        email,
        username,
        password,
        phone_number: `+${countryCode}${phone}`,
        application_id: applicationId,
      }

      console.log("Submitting user creation with payload:", { ...payload, password: "******" })

      const result = (await createUserInApplication(payload)) as ResponseSuccess<User> | ResponseError

      console.log("User creation result:", result)

      if (result.success) {
        setIsOpen(false)
        resetForm()
        toast({
          title: "Success",
          description: `Successfully created user ${result.data.username}`,
        })
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.error.message || "Failed to create user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to create user:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await inviteUser({
        email: inviteEmail,
        applicationId,
        expiresInDays: Number.parseInt(expiryDays),
      })

      if (result.success) {
        setIsOpen(false)
        resetForm()
        toast({
          title: "Success",
          description: `Invitation sent to ${inviteEmail}`,
        })
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send invitation",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to send invitation:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setUsername("")
    setPhone("")
    setPassword("")
    setIgnorePasswordPolicies(false)
    setInviteEmail("")
    setExpiryDays("30")
    setCountryCode("US")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{activeTab === "create" ? "Create new user" : "Invite new user"}</DialogTitle>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
              Development
            </Badge>
          </div>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "create" | "invite")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create User</TabsTrigger>
            <TabsTrigger value="invite">Invite User</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-email">Email</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">US</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="CA">CA</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ignore-policies"
                  checked={ignorePasswordPolicies}
                  onCheckedChange={(checked) => setIgnorePasswordPolicies(checked as boolean)}
                />
                <label
                  htmlFor="ignore-policies"
                  className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ignore password policies
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                If checked, password policies will not be enforced on this password.
              </p>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create user"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="invite">
            <form onSubmit={handleInviteUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Set invitation expiry</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="90"
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(e.target.value)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">Days</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Invite links will expire after the specified number of days
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Invite user"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

