"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { UserRound, Mail, Calendar } from 'lucide-react'

export default function UserProfile() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(session?.user?.name || '')
  const [email, setEmail] = useState(session?.user?.email || '')

  const handleSave = async () => {
    // Here you would typically send a request to your API to update the user's information
    // For now, we'll just simulate this with a timeout
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsEditing(false)
    // In a real application, you'd want to update the session data here
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || "User"} />
          <AvatarFallback>
            <UserRound className="w-12 h-12" />
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{session?.user?.name}</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-gray-500" />
          <span>{session?.user?.email}</span>
        </div>
        {session?.user?.createdAt && (
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span>Joined {new Date(session.user.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </form>
      ) : (
        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
      )}
    </div>
  )
}
