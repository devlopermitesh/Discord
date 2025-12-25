'use client'

import MemberItem from '@/components/molecular/MemberItem'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useModel } from '@/hooks/use-model'
import { Role } from '@/lib/generated/prisma/enums'
import { serverwithprofilewithmembers } from '@/types'

const ManageUserModal = () => {
  const { isOpen, modelType, onClose, data } = useModel()
  const serverdata = data as { server: serverwithprofilewithmembers }
  const server = serverdata?.server

  return (
    <Dialog open={isOpen && modelType == 'manageserveruser'} onOpenChange={onClose}>
      <DialogContent
        className="
    bg-background text-primary
    overflow-y-auto 
    max-h-[90vh] 
    sm:max-h-[85vh] 
    rounded-xl 
    p-6 
    sm:p-8
    no-scrollbar
  "
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl sm:text-2xl font-semibold tracking-tight">
            Manage Users
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            Currently {server?.members.length} user in your Server
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 w-full rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm leading-none font-medium">Members</h4>
            {server.members
              .filter((member) => member.role === Role.ADMIN)
              .map((member) => (
                <MemberItem
                  serverId={server.id}
                  key={member.id}
                  profileId={server.profileId}
                  member={member}
                />
              ))}
            {server.members
              .filter((member) => member.role === Role.MOD)
              .map((member) => (
                <MemberItem
                  serverId={server.id}
                  key={member.id}
                  profileId={server.profileId}
                  member={member}
                />
              ))}
            {server.members
              .filter((member) => member.role === Role.GUEST)
              .map((member) => (
                <MemberItem
                  serverId={server.id}
                  key={member.id}
                  profileId={server.profileId}
                  member={member}
                />
              ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ManageUserModal
