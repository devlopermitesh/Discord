import { getProfileCached } from '@/lib/get-profile'
import { prisma } from '@/lib/prisma'
import { RedirectToSignIn, UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import NavigationAction from '../molecular/NavigationAction'
import ActionTooltip from '../molecular/action-tooltip'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import ServerItem from '../molecular/ServerItem'
import IconButton from '../atoms/IconButton'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { CustomTooltip } from '../molecular/icon-tooltip'
import { ModeToggle } from '../ui/mode-toggle'

interface sidebarProps {
  className?: string | undefined
}
const Sidebar = async ({ className }: sidebarProps) => {
  const user = await currentUser()
  if (!user) {
    return <RedirectToSignIn />
  }
  const profile = await getProfileCached(user?.id)
  if (!profile) {
    return redirect('/')
  }
  //get all the server by profile Id
  const servers = await prisma.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })
  return (
    <div className={`z-30  fixed inset-y-0 ${className}`}>
      <div className="space-y-4 w-full flex flex-col items-center text-primary dark:bg-[#1E1F22] py-3 h-full">
        <ActionTooltip content="Create a new server" side="right" align="end">
          <NavigationAction />
        </ActionTooltip>
        <Separator className="rounded-md w-10 max-auto h-0.5 mx-auto bg-zinc-300 dark:bg-zinc-700" />
        <ScrollArea className="flex-1 w-full ">
          <div className="flex flex-col items-center gap-4 py-8">
            {servers.map((server) => (
              <CustomTooltip key={server.id} content={`${server.title}`} align="end" side="right">
                <ServerItem server={server} />
              </CustomTooltip>
            ))}
          </div>
        </ScrollArea>

        <div className="pb-3  flex flex-col items-center gap-4 py-8">
          <ModeToggle />
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'h-12 w-12',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
export default Sidebar
