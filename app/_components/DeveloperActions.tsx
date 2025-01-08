'use client'

import { createNewApplication, createUserInApplication } from '@/actions/auth/developer'
import { toast } from "@/layout/base/toast/use-toast"
import { createApplicationSchema, createUserInApplicationSchema } from '@/schemas'
import { Button } from "@/ui/button/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form"
import { Input } from "@/ui/input"
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type ActionType = 'createApp' | 'createUser'

export function DeveloperActions() {
  const [actionType, setActionType] = useState<ActionType>('createApp')

  const createAppForm = useForm<z.infer<typeof createApplicationSchema>>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: { name: '', description: '' },
  })

  const createUserForm = useForm<z.infer<typeof createUserInApplicationSchema>>({
    resolver: zodResolver(createUserInApplicationSchema),
    defaultValues: { application_id: '', username: '', email: '', password: '', phone_number: '' },
  })

  const onCreateApp = async (data: z.infer<typeof createApplicationSchema>) => {
    const result = await createNewApplication(data)
    if (result.success) {
      toast({ title: "Success", description: result.message })
      createAppForm.reset()
    } else {
      toast({ title: "Error", description: result.error?.message, variant: "destructive" })
    }
  }

  const onCreateUser = async (data: z.infer<typeof createUserInApplicationSchema>) => {
    const result = await createUserInApplication(data)
    if (result.success) {
      toast({ title: "Success", description: result.message })
      createUserForm.reset()
    } else {
      toast({ title: "Error", description: result.error?.message, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Button onClick={() => setActionType('createApp')} variant={actionType === 'createApp' ? 'default' : 'outline'}>Create Application</Button>
        <Button onClick={() => setActionType('createUser')} variant={actionType === 'createUser' ? 'default' : 'outline'}>Create User</Button>
      </div>

      {actionType === 'createApp' && (
        <Form {...createAppForm}>
          <form onSubmit={createAppForm.handleSubmit(onCreateApp)} className="space-y-4">
            <FormField
              control={createAppForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createAppForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create Application</Button>
          </form>
        </Form>
      )}

      {actionType === 'createUser' && (
        <Form {...createUserForm}>
          <form onSubmit={createUserForm.handleSubmit(onCreateUser)} className="space-y-4">
            <FormField
              control={createUserForm.control}
              name="application_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createUserForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createUserForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createUserForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createUserForm.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create User</Button>
          </form>
        </Form>
      )}
    </div>
  )
}

