import { getProfileCached } from '@/lib/get-profile'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import ServerHeader from '../molecular/serverheader'

const ChannelSidebar = async ({ serverId }: { serverId: string }) => {
  const user = await currentUser()

  if (!user) {
    return redirect('/login')
  }
  const profile = await getProfileCached(user.id)
  if (!profile) return redirect('/login')
  //fetch all the servers channel, &members
  const serverdata = await prisma.server.findFirst({
    where: {
      id: serverId,
      profile: {},
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        orderBy: {
          role: 'desc',
        },
        include: {
          profile: true,
        },
      },
    },
  })
  if (!serverdata) return redirect('/login')
  //filter arrays components
  // const members = serverdata?.members.filter((member) => member.profileId !== String(profile.id));
  // const textchannels = serverdata?.channels.filter((channel) => channel.type === Type.TEXT);
  // const audiochannels = serverdata?.channels.filter((channel) => channel.type === Type.AUDIO);
  // const videochannels = serverdata?.channels.filter((channel) => channel.type === Type.VIDEO);
  const roles = serverdata.members.filter((member) => member.profileId === profile.id)[0]

  return (
    <div className="flex flex-1 flex-col h-full w-full dark:bg-[#1E1F22] border-l border-r ">
      <ServerHeader role={roles.role} server={serverdata} />
      {serverdata.channels.map((channel) => (
        <p key={channel.id}>{channel.title}</p>
      ))}
    </div>
  )
}
export default ChannelSidebar
