import { Profile } from '@/lib/generated/prisma/client'
import { Role } from '@/lib/generated/prisma/enums'
import React, { useState } from 'react'
import { UserAvatar } from '../atoms/UserAvatar'
import { EllipsisVertical, Loader2, Shield, ShieldAlert, ShieldCheck } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import queryString from 'query-string'
import { api, ENDPOINTS } from '@/config'
import { useModel } from '@/hooks/use-model'
interface MemberItemProps {
  serverId: string
  profileId: string
  member: {
    id: string
    profileId: string
    createdAt: Date
    updatedAt: Date
    role: Role
    serverId: string
  } & {
    profile: Profile
  }
}

const MemberItem: React.FC<MemberItemProps> = ({ serverId, profileId, member }) => {
  const { onOpen } = useModel()
  const [loadingId, setloadingId] = useState('')
  const roleLabels = {
    [Role.GUEST]: 'Guest',
    [Role.MOD]: 'Moderator',
    [Role.ADMIN]: 'Admin',
  }

  const roleIcons = {
    [Role.GUEST]: <Shield className="w-4 h-4 ml-2 text-zinc-500" />,
    [Role.MOD]: <ShieldCheck className="w-4 h-4 ml-2 text-green-500" />,
    [Role.ADMIN]: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
  }

  // kick user out
  const kickout = async (memberId: string) => {
    try {
      setloadingId(memberId)
      const query = queryString.stringifyUrl({
        url: ENDPOINTS.kickoutuser(memberId),
        query: {
          serverId: serverId,
        },
      })
      const response = await api.delete(query)
      onOpen('manageserveruser', { server: response.data.data })
    } catch (error) {
      console.log('Error', error)
    } finally {
      setloadingId('')
    }
  }

  //asign new role

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      setloadingId(memberId)
      const query = queryString.stringifyUrl({
        url: ENDPOINTS.alterRoleuser(memberId),
        query: { serverId: serverId },
      })
      const response = await api.patch(query, { role: newRole })
      onOpen('manageserveruser', { server: response.data.data })
    } catch (error) {
      console.log('Error', error)
    } finally {
      setloadingId('')
    }
  }

  return (
    <div className="flex items-center justify-between py-2 px-4 hover:bg-zinc-100 rounded-md">
      <div className="flex items-center gap-3">
        <UserAvatar src={member.profile.imageUrl} size="md" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <p className="text-zinc-700 text-sm font-medium">{member.profile.name}</p>
            {roleIcons[member.role]}
          </div>
          <p className="text-zinc-600 text-xs">{member.profile.email}</p>
        </div>
      </div>

      {member.profileId !== profileId &&
        (member.id !== loadingId ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-md hover:bg-zinc-200">
                <EllipsisVertical className="h-5 w-5 text-zinc-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Manage Member</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  <span>Change Role</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(value) => handleRoleChange(member.id, value)}
                  >
                    {Object.values(Role)
                      .filter((role) => role !== Role.ADMIN)
                      .map((role) => (
                        <DropdownMenuRadioItem key={role} value={role}>
                          <div className="flex items-center gap-2">
                            {roleIcons[role as keyof typeof roleIcons]}
                            {roleLabels[role as keyof typeof roleLabels]}
                          </div>
                        </DropdownMenuRadioItem>
                      ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Add more actions here, e.g., Kick Member, Ban, etc. */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => kickout(member.id)}
                className="text-rose-500 focus:text-rose-500"
              >
                Kick Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Loader2 className="h-4 w-4 ml-2 animate-spin" />
        ))}
    </div>
  )
}

export default MemberItem
