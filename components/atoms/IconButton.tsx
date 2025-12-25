'use client'
import { PlacesType, Tooltip } from 'react-tooltip'
import { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ElementType
  tooltipText?: string
  size?: number
  side?: PlacesType
  tooltipId: string
  className?: string
  textclass?: string
}

const IconButton = ({
  icon: Icon,
  tooltipText,
  tooltipId,
  size,
  side = 'right-end',
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
        <Tooltip className={textclass} id={tooltipId} place={side} />
      )}
    </div>
  )
}

export default IconButton
