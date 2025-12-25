import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from 'lucide-react' // Optional: nice default icon
import clsx from 'clsx'

interface UserAvatarProps {
  src?: string | null
  alt?: string
  fallback?: string // e.g., initials like "JD"
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function UserAvatar({
  src,
  alt = 'User avatar',
  fallback,
  size = 'md',
  className,
}: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }

  const initials = fallback || (alt ? getInitials(alt) : 'U')

  return (
    <Avatar className={clsx(sizeClasses[size], className)}>
      <AvatarImage src={src || undefined} alt={alt} />
      <AvatarFallback className={textSizeClasses[size]}>
        {initials.length <= 3 ? (
          initials
        ) : (
          <User className={clsx('h-1/2 w-1/2', textSizeClasses[size])} />
        )}
      </AvatarFallback>
    </Avatar>
  )
}

// Helper to extract initials from name
function getInitials(name: string): string {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}
