'use client'
import { Role, Type } from '@/lib/generated/prisma/enums'
import React from 'react'
import IconButton from './IconButton'
import { Plus, Settings, User } from 'lucide-react'
import ActionTooltip from '../molecular/action-tooltip'
import { useModel } from '@/hooks/use-model'
import { Server } from '@/lib/generated/prisma/client'

interface ServerSectionProps {
  label: string
  sectionType: 'channels' | 'members'
  channelType?: Type
  server?: Server
  role: Role
}
const ServerSection: React.FC<ServerSectionProps> = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}) => {
  const { onOpen, data } = useModel()
  return (
    <div className="mb-2 mt-2 flex items-center justify-between group ">
      <p className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-700 hover:dark:text-zinc-600 text-sm font-medium">
        {label}
      </p>
      {role !== Role.GUEST && sectionType == 'channels' && (
        <ActionTooltip align="end" side="top" className="" content="Create Channel">
          <div className="hidden text-zinc-400 dark:text-zinc-700 rounded hover:text-zinc-500 hover:dark:text-zinc-600 transition  ml-auto ">
            <Plus
              className="hidden h-4 w-4 bg-muted rounded "
              onClick={() => onOpen('createServer', { server: undefined })}
            />
          </div>
        </ActionTooltip>
      )}
      {role === Role.ADMIN && sectionType == 'members' && (
        <ActionTooltip align="end" side="right" content="Create Channel">
          <div className="text-zinc-400 dark:text-zinc-700 hover:text-zinc-500 hover:dark:text-zinc-600 transition">
            <Settings
              className="ml-2 h-4 w-4 p-1 bg-muted "
              onClick={() => onOpen('manageserveruser', { server: server })}
            />
          </div>
        </ActionTooltip>
      )}
    </div>
  )
}
export default ServerSection
