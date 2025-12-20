'use client'
import { Tooltip } from 'react-tooltip'
import { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ElementType
  tooltipText?: string
  size?: number
  tooltipId: string
  className?: string
  textclass?: string
}

const IconButton = ({
  icon: Icon,
  tooltipText,
  tooltipId,
  size,
  className,
  textclass,
  children,
  ...props
}: IconButtonProps) => {
  return (
    <div>
      <button
        {...props} // Pass all button props
        className={twMerge('p-2 rounded-full hover:bg-gray-200 transition duration-300', className)}
        type="button"
        data-tooltip-id={tooltipId} // Link button to tooltip
        data-tooltip-content={tooltipText} // Tooltip content
      >
        {children}
        {Icon && <Icon size={size} className="text-xl" />}
      </button>

      {/* Tooltip */}
      {tooltipText !== null && tooltipText !== undefined && tooltipText !== '' && (
        <Tooltip className={textclass} id={tooltipId} place="left" />
      )}
    </div>
  )
}

export default IconButton
