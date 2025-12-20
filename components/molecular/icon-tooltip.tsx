'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ReactNode } from 'react'

interface CustomTooltipProps {
  children: ReactNode // Jo hover pe dikhega (button, icon, text etc.)
  content: ReactNode | string // Tooltip ke andar ka text/content
  side?: 'top' | 'right' | 'bottom' | 'left' // Default top
  align?: 'start' | 'center' | 'end'
  delayDuration?: number // Hover delay in ms
  className?: string // Extra classes agar chahiye
}

export function CustomTooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  delayDuration = 300,
  className,
}: CustomTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={`z-50 max-w-xs break-words ${className || ''}`}
          sideOffset={5}
        >
          {typeof content === 'string' ? <p>{content}</p> : content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
