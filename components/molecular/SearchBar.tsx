'use client'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Kbd, KbdGroup } from '../ui/kbd'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import { useParams, useRouter } from 'next/navigation'

interface SearchBarProps {
  data: {
    label: string
    type: 'channel' | 'member'
    data:
      | {
          id: string
          icon: React.ReactElement
          name: string
        }[]
      | undefined
  }[]
}

const SearchBar: React.FC<SearchBarProps> = ({ data }) => {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false) // ← Start CLOSED

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev) // Toggle open/close
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Click on search button to open dialog
  const handleSearchClick = () => {
    setOpen(true)
  }

  const onClick = ({ id, type }: { id: string; type: 'channel' | 'member' }) => {
    if (type === 'channel') {
      router.push(`/servers/${params?.serverId}/channels/${id}`)
    } else if (type === 'member') {
      router.push(`/servers/${params?.serverId}/conversations/${id}`)
    }
    router.refresh()
    setOpen(false) // Close dialog after navigation
  }

  return (
    <>
      {/* Clickable search button */}
      <button
        onClick={handleSearchClick}
        className="group px-2 py-1.5 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <KbdGroup className="ml-auto pointer-events-none flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search channels and members..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {data.map(({ label, type, data: items }) => {
            if (!items || items.length === 0) return null

            return (
              <CommandGroup key={label} heading={label}>
                {items.map((item) => (
                  <CommandItem key={item.id} onSelect={() => onClick({ id: item.id, type })}>
                    {item.icon}
                    <span>{item.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default SearchBar
