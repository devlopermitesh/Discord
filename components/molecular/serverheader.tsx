'use client'
import { serverwithprofilewithmembers } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  ArrowLeftFromLine,
  ChevronDown,
  ChevronUp,
  DiamondPlus,
  Settings,
  Trash,
  UserPlus,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import IconButton from '../atoms/IconButton'
import { useModel } from '@/hooks/use-model'
import { Role } from '@/lib/generated/prisma/enums'

interface ServerHeaderProps {
  role: Role
  server: serverwithprofilewithmembers
}
const ServerHeader: React.FC<ServerHeaderProps> = ({ server, role }) => {
  const [opendrop, setdrop] = useState(false)
  const { onOpen } = useModel()

  const isAdmin = role === Role.ADMIN
  const isModerator = isAdmin || role == Role.MOD
  console.log('IsModerator', isModerator)
  return (
    <div className="flex flex-row border rounded-md justify-around p-2 ">
      <DropdownMenu open={opendrop} onOpenChange={() => setdrop((props) => !props)}>
        <DropdownMenuTrigger className="focus:outline-none  active:none">
          <div className="flex flex-row items-center justify-between gap-2 ">
            <p className="text-md font-semibold">{server.title} </p>
            {!opendrop ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ChevronUp className="ml-2 h-4 w-4" />
            )}
          </div>
        </DropdownMenuTrigger>

        {isModerator && (
          <IconButton
            tooltipId="userplus"
            onClick={() => onOpen('inviteserver', { server: server })}
            size={19}
            className=" rounded-md hover:bg-white/70 dark:hover:bg-black/70 hover:text-primary"
            tooltipText="Add new User"
            icon={UserPlus}
          />
        )}

        <DropdownMenuContent>
          <DropdownMenuLabel>Server features</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isModerator && (
            <DropdownMenuItem
              onClick={() => onOpen('createchannel', { server: server })}
              className="flex flex-row gap-2 justify-between"
            >
              Create Channel <DiamondPlus className="h-4 w-4 ml-2" />
            </DropdownMenuItem>
          )}

          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen('editserver', { server: server })}
              className="flex flex-row gap-2 justify-between"
            >
              Server Setting
              <Settings className="h-4 w-4 ml-2" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <>
              <DropdownMenuItem
                onClick={() => onOpen('manageserveruser', { server: server })}
                className="flex flex-row gap-2 justify-between"
              >
                Manage Members
                <Users className="h-4 w-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {!isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen('leaveserver', { server: server })}
              className="flex flex-row gap-2 justify-between text-red-500"
            >
              Leave Server
              <ArrowLeftFromLine className="h-4 w-4 ml-2 text-red-500" />
            </DropdownMenuItem>
          )}

          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen('deleteserver', { server: server })}
              className="group flex flex-row gap-2 justify-between text-red-400"
            >
              Delete Server
              <Trash className="h-4 w-4 ml-2 text-red-500 group-hover:text-primary" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ServerHeader
