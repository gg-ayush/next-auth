'use client'
import { ApplicationUsers } from "@/app/_components/ApplicationUsers";
import { DeveloperDashboard } from "@/app/_components/DeveloperDashboard";


export default function DeveloperDashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <DeveloperDashboard />
      <ApplicationUsers />
    </div>
  )
}

