import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { cn } from '@/lib/utils'
interface ToolWrapperProps {
  children: React.ReactNode
  tip: string
  className?: string
}
export const ToolWrapper = ({ children, tip, className }: ToolWrapperProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className={cn(className)}>
        <p>{tip}</p>
      </TooltipContent>
    </Tooltip>
  )
}
