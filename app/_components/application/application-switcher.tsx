"use client"

import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import type { Application } from "@/core/types/application"

interface ApplicationSwitcherProps {
  applications: Application[]
  currentApplicationId: string
}

export function ApplicationSwitcher({ applications, currentApplicationId }: ApplicationSwitcherProps) {
  const router = useRouter()

  const handleApplicationChange = (applicationId: string) => {
    router.push(`/dashboard/${applicationId}`)
  }

  const currentApplication = applications.find((app) => app.id === currentApplicationId)

  return (
    <Select value={currentApplicationId} onValueChange={handleApplicationChange}>
      <SelectTrigger className="w-[180px] bg-[#0A0B0F] border-neutral-800 text-white">
        <SelectValue placeholder="Select application">{currentApplication?.name || "Select application"}</SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-[#0A0B0F] border-neutral-800 text-white">
        {applications.map((app) => (
          <SelectItem key={app.id} value={app.id} className="text-white hover:bg-neutral-800">
            {app.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

