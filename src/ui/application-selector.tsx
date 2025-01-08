'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from "react"
import { Button } from "@/ui/button/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/popover/popover"
import { cn } from "@/lib/utils"

type Application = {
  id: string
  name: string
}

interface ApplicationSelectorProps {
  applications: Application[]
  selectedId: string
  onSelect: (id: string) => void
}

export function ApplicationSelector({ applications, selectedId, onSelect }: ApplicationSelectorProps) {
  const [open, setOpen] = useState(false)
  const selectedApp = applications.find((app) => app.id === selectedId)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedApp?.name ?? "Select application..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search applications..." />
          <CommandEmpty>No application found.</CommandEmpty>
          <CommandGroup>
            {applications.map((app) => (
              <CommandItem
                key={app.id}
                value={app.id}
                onSelect={() => {
                  onSelect(app.id)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedId === app.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {app.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

