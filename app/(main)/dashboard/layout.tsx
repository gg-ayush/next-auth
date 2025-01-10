'use client'

import { Building2, HelpCircle, Settings } from 'lucide-react'
import { useState } from "react"

import { Button } from "@/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/ui/select"

export default function DashboardLayout({
  children,
  overview,
  users,
  configure,
}: {
  children: React.ReactNode
  overview: React.ReactNode
  users: React.ReactNode
  configure: React.ReactNode
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'configure'>('overview')

  const handleTabChange = (tab: 'overview' | 'users' | 'configure') => {
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex h-14 items-center gap-4 px-4">
          <Building2 className="h-8 w-8" />
          
          {/* App Selector */}
          <Select defaultValue="gg">
            <SelectTrigger className="w-[180px] border-neutral-200 dark:border-neutral-800">
              <SelectValue placeholder="Select application" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gg">gg</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Secondary Navigation */}
        <nav className="flex px-4">
          <Button 
            variant="ghost"
            onClick={() => handleTabChange('overview')}
            className={`border-b-2 px-4 py-2 text-sm hover:text-neutral-900 dark:hover:text-neutral-100 ${
              activeTab === 'overview' ? 'border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100' : 'border-transparent text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Overview
          </Button>
          <Button 
            variant="ghost"
            onClick={() => handleTabChange('users')}
            className={`border-b-2 px-4 py-2 text-sm hover:text-neutral-900 dark:hover:text-neutral-100 ${
              activeTab === 'users' ? 'border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100' : 'border-transparent text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Users
          </Button>
          <Button 
            variant="ghost"
            onClick={() => handleTabChange('configure')}
            className={`border-b-2 px-4 py-2 text-sm hover:text-neutral-900 dark:hover:text-neutral-100 ${
              activeTab === 'configure' ? 'border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100' : 'border-transparent text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Configure
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {activeTab === 'overview' && overview}
        {activeTab === 'users' && users}
        {activeTab === 'configure' && configure}
      </main>
    </div>
  )
}

