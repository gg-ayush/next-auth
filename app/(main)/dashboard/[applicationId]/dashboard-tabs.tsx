"use client"

import { Button } from "@/ui/button"
import { useState } from "react"

interface DashboardTabsProps {
  overview: React.ReactNode
  users: React.ReactNode
  configure: React.ReactNode
}

export function DashboardTabs({ overview, users, configure }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "configure">("overview")

  const handleTabChange = (tab: "overview" | "users" | "configure") => {
    setActiveTab(tab)
  }

  return (
    <>
      <nav className="flex px-4">
        <Button
          variant="ghost"
          onClick={() => handleTabChange("overview")}
          className={`border-b-2 px-4 py-2 text-sm hover:text-white ${
            activeTab === "overview" ? "border-white text-white" : "border-transparent text-neutral-400"
          }`}
        >
          Overview
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleTabChange("users")}
          className={`border-b-2 px-4 py-2 text-sm hover:text-white ${
            activeTab === "users" ? "border-white text-white" : "border-transparent text-neutral-400"
          }`}
        >
          Users
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleTabChange("configure")}
          className={`border-b-2 px-4 py-2 text-sm hover:text-white ${
            activeTab === "configure" ? "border-white text-white" : "border-transparent text-neutral-400"
          }`}
        >
          Configure
        </Button>
      </nav>

      <main className="p-4">
        {activeTab === "overview" && overview}
        {activeTab === "users" && users}
        {activeTab === "configure" && configure}
      </main>
    </>
  )
}

