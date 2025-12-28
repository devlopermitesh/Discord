'use client'

import { Channel, Server } from '@/lib/generated/prisma/client'
import { Role, Type } from '@/lib/generated/prisma/enums'
import { cn } from '@/lib/utils'
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { CustomTooltip } from './icon-tooltip'
import { ModelType, useModel } from '@/hooks/use-model'

interface ServerChannelProps {
  channel: Channel
  server: Server
  role: Role
}

const IconMap = {
  [Type.TEXT]: <Hash className="h-4 w-4 flex-shrink-0" />,
  [Type.AUDIO]: <Mic className="h-4 w-4 flex-shrink-0" />,
  [Type.VIDEO]: <Video className="h-4 w-4 flex-shrink-0" />,
}

const ServerChannel: React.FC<ServerChannelProps> = ({ channel, role, server }) => {
  const params = useParams()
  const router = useRouter()
  const { onOpen } = useModel()
  const isActive = params.id === channel.id
  const onClick = () => {
    router.push(`/servers/${server.id}/channels/${channel.id}`)
    router.refresh()
  }
  const onAction = (e: React.MouseEvent<HTMLDivElement>, modelType: ModelType) => {
    e.stopPropagation()
    onOpen(modelType, { server: server, channel: channel })
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
      {/* Icon */}
      <div
        className={cn(
          'text-zinc-500 dark:text-zinc-400',
          'group-hover:text-zinc-600 dark:group-hover:text-zinc-300',
          isActive && 'text-zinc-600 dark:text-zinc-200'
        )}
      >
        {IconMap[channel.type]}
      </div>

      {/* Channel Name */}
      <p
        className={cn(
          'text-sm font-medium line-clamp-1',
          'text-zinc-500 dark:text-zinc-400',
          'group-hover:text-zinc-600 dark:group-hover:text-zinc-300',
          isActive && 'text-primary dark:text-white font-semibold'
        )}
      >
        {channel.title}
      </p>
      <div className=" invisible items-center group-hover:visible transition ml-auto ">
        {role !== Role.GUEST &&
          (channel.title === 'general' ? (
            <CustomTooltip content="Lock Channel" side="top">
              <div className="p-1 rounded-md hover:bg-zinc-300/70 dark:hover:bg-zinc-700/50 transition cursor-pointer">
                <Lock className="h-4 w-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
              </div>
            </CustomTooltip>
          ) : (
            <div className="flex items-center gap-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* Edit */}
              <CustomTooltip content="Edit Channel" side="top">
                <div
                  onClick={(e) => onAction(e, 'editchannel')}
                  className="p-1 rounded-md hover:bg-zinc-300/70 dark:hover:bg-zinc-700/50 transition cursor-pointer"
                >
                  <Edit className="h-4 w-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                </div>
              </CustomTooltip>

              {/* Delete */}
              <CustomTooltip content="Delete Channel" side="top">
                <div
                  onClick={(e) => onAction(e, 'deletechannel')}
                  className="p-1 rounded-md hover:bg-zinc-300/70 dark:hover:bg-zinc-700/50 transition cursor-pointer"
                >
                  <Trash className="h-4 w-4 text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-300" />
                </div>
              </CustomTooltip>
            </div>
          ))}
      </div>
    </div>
  )
}

export default ServerChannel
