'use client'
import React, { useState } from 'react'

// Tooltip Component
interface ActionTooltipProps {
  children: React.ReactNode
  content: string
  side?: 'left' | 'right' | 'top' | 'bottom'
  align?: 'center' | 'start' | 'end'
  className?: string
}

const ActionTooltip: React.FC<ActionTooltipProps> = ({
  children,
  content,
  side = 'top',
  align = 'center',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const alignClasses = {
    center: '',
    start: side === 'top' || side === 'bottom' ? 'left-0 translate-x-0' : 'top-0 translate-y-0',
    end:
      side === 'top' || side === 'bottom'
        ? 'left-auto right-0 translate-x-0'
        : 'top-auto bottom-0 translate-y-0',
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`
            absolute z-50 px-3 py-2 text-sm font-medium rounded-lg shadow-lg
            whitespace-nowrap pointer-events-none
            bg-primary  text-primary-foreground
            ${positionClasses[side]}
            ${alignClasses[align]}
            ${className}
            animate-in fade-in-0 zoom-in-95
          `}
        >
          <p className="font-medium text-sm">{content}</p>
          <div
            className={`
              absolute w-2 h-2 bg-primary dark:bg-primary/90 rotate-45
              ${side === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : ''}
              ${side === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : ''}
              ${side === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
              ${side === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}
            `}
          />
        </div>
      )}
    </div>
  )
}

export default ActionTooltip
