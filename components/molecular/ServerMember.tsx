'use client'
import { Member, Profile, Role, Server } from '@/lib/generated/prisma/browser'
import { cn } from '@/lib/utils'
import { useParams, useRouter } from 'next/navigation'
import { UserAvatar } from '../atoms/UserAvatar'
import React from 'react'
import { ShieldAlert, ShieldCheck } from 'lucide-react'

interface ServerMemberProps {
  member: Member & { profile: Profile }
  server?: Server
}
const roleIcons = {
  [Role.GUEST]: <div className="w-4 h-4 ml-2 text-zinc-500" />,
  [Role.MOD]: <ShieldCheck className="w-4 h-4 ml-2 text-green-500" />,
  [Role.ADMIN]: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
}
const ServerMember: React.FC<ServerMemberProps> = ({ member, server }) => {
  const params = useParams()
  const router = useRouter()
  const isActive = params.id === member.profile.id

  const onClick = () => {
    router.push(`/servers/${params.serverId}/conversations/${member?.id}`)
    router.refresh()
  }
  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex items-center gap-x-2 w-full px-2 py-1.5 rounded-md transition mb-1',
        'hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        isActive && 'bg-zinc-700/20 dark:bg-zinc-700/80'
      )}
    >
      {/* IMage */}
      <UserAvatar src={member.profile.imageUrl} size="sm" />

      {/* Channel Name */}
      <p
        className={cn(
          'text-sm font-medium line-clamp-1',
          'text-zinc-500 dark:text-zinc-400',
          'group-hover:text-zinc-600 dark:group-hover:text-zinc-300',
          isActive && 'text-primary dark:text-white font-semibold'
        )}
      >
        {member.profile.name}
      </p>
      {/* Shield */}
      {roleIcons[member.role]}
    </div>
  )
}
export default ServerMember
