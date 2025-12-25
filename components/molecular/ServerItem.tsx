'use client'

import { cn } from '@/lib/utils'
import { useParams, useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

type server = {
  title: string
  id: string
  imageUrl: string | null
}
interface ServerItemProps {
  server: server
}
const ServerItem: React.FC<ServerItemProps> = ({ server }) => {
  const params = useParams()
  const router = useRouter()
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return (
    <div
      onClick={() => router.push(`/servers/${server.id}`)}
      className="group  flex items-center cursor-pointer"
    >
      <div
        className={cn(
          'absolute rounded-r-full w-1 left-0 bg-primary transition-all ',
          params.serverId === server.id ? 'h-6' : 'h-2',
          params.serverId !== server.id && 'group-hover:h-5'
        )}
      />
      <Avatar className="size-8 rounded-md">
        <AvatarImage
          src={server.imageUrl ?? undefined}
          className={cn(
            'rounded-full ',
            params.serverId === server.id && 'aspect-square object-cover rounded-md'
          )}
        />
        <AvatarFallback className="rounded-md">
          <div className="bg-gray-300 group-hover:bg-[var(--nav-action-hover)] rounded-md p-2 transition-all duration-700 flex items-center justify-center size-full">
            <p className="font-semibold text-lg group-hover:text-white">
              {getInitials(server.title)}
            </p>
          </div>
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
export default ServerItem
