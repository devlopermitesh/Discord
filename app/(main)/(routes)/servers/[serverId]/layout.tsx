import { getProfileCached } from '@/lib/get-profile'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ChannelSidebar from '@/components/organisms/channelSidebar'

interface LayoutProp {
  children: React.ReactNode
  params: Promise<{ serverId: string }>
}
const Layout = async ({ children, params }: LayoutProp) => {
  const user = await currentUser()
  const { serverId } = await params
  if (!user) {
    redirect('/login')
  }
  const profile = await getProfileCached(user.id)
  if (!profile) return redirect('/login')
  //render all the message from the server
  const server = await prisma.server.findFirst({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })
  if (!server) {
    return redirect('/login')
  }
  return (
    <div className=" h-full">
      <div className="hidden md:flex flex-col inset-y-0 fixed w-60 z-20 h-full">
        <ChannelSidebar serverId={server.id} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  )
}
export default Layout
