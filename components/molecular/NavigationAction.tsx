'use client'

import { useModel } from '@/hooks/use-model'
import { Plus } from 'lucide-react'

export default function NavigationAction() {
  const { onOpen } = useModel()
  return (
    <div>
      <button
        onClick={() => onOpen('createServer', { server: undefined })}
        className="group flex items-center"
      >
        {/* plus icon  */}
        <div
          className="
          flex h-10 w-10 items-center justify-center
          rounded-full bg-background text-primary
          transition-all duration-200 cursor-pointer
          group-hover:rounded-2xl
          group-hover:bg-[var(--nav-action-hover)]
          group-hover:scale-110
        "
        >
          <Plus className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90  bg-foreground group-hover:bg-background rounded-full text-background group-hover:text-foreground" />
        </div>
      </button>
    </div>
  )
}
