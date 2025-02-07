'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createNewApplication } from '@/actions/auth/developer'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Textarea } from "@/ui/textarea"
import { Plus } from 'lucide-react'
import { toast } from "@/layout/base/toast/use-toast"
import { ResponseSuccess, ResponseError } from "@/core/types"

interface Application {
  id: string;
  name: string;
  description: string | null;
}

export function CreateApplicationDialog() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await createNewApplication({ name, description }) as ResponseSuccess<Application> | ResponseError

      if (result.success) {
        setIsOpen(false)
        router.refresh()
        router.push(`/dashboard/${result.data.id}`)
        toast({
          title: "Application created",
          description: `Successfully created ${result.data.name}`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error.message || "Failed to create application",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error creating application:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Application'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

