import { Channel, Server } from '@/lib/generated/prisma/client'
import { Hash } from 'lucide-react'
import React from 'react'
import { UserAvatar } from '../atoms/UserAvatar'
import { MobileMenutoggle } from './Mobiletoggle'

interface ChatHeaderProps {
  name: string
  type: 'channel' | 'member'
  serverId: string
  imageUrl?: string
}
const IconMap = {
  ['channel']: <Hash className="w-5 h-5 dark:text-zinc-100 text-zinc-900" />,
}
const ChatHeader: React.FC<ChatHeaderProps> = ({ name, serverId, type, imageUrl }) => {
  return (
    <div className="flex w-full  border-neutral-800 bg-white dark:bg-black px-2">
      <MobileMenutoggle serverId={serverId} />
      {type === 'channel' && (
        <div className="flex py-4 rounded items-center gap-2">
          {IconMap[type]}
          <p className="text-md font-semibold">{name}</p>
        </div>
      )}
      {type === 'member' && (
        <div className="flex py-4 rounded items-center gap-2">
          <UserAvatar size="md" src={imageUrl} />
          <p className="text-md font-semibold">{name}</p>
        </div>
      )}
    </div>
  )
}
export default ChatHeader
