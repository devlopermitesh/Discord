import { getProfileCached } from '@/lib/get-profile'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import ServerHeader from '../molecular/serverheader'
import { ScrollArea } from '../ui/scroll-area'
import SearchBar from '../molecular/SearchBar'
import { Role, Type } from '@/lib/generated/prisma/enums'
import { Hash, Mic, ShieldCheck, Video } from 'lucide-react'
import ServerSection from '../atoms/ServerSection'
import ServerChannel from '../molecular/ServerChannel'
import ServerMember from '../molecular/ServerMember'

const ChannelSidebar = async ({ serverId }: { serverId: string }) => {
  const user = await currentUser()
  const iconMap = {
    [Type.TEXT]: <Hash className="ml-2 h-4 w-4" />,
    [Type.AUDIO]: <Mic className="ml-2 h-4 w-4" />,
    [Type.VIDEO]: <Video className="ml-2 h-4 w-4" />,
  }
  const roleIconMap = {
    [Role.GUEST]: <div className="h-4 w-4 ml-2" />,
    [Role.MOD]: <ShieldCheck className="text-green-400 h-4 w-4 ml-2" />,
    [Role.ADMIN]: <ShieldCheck className="text-rose-400 h-4 w-4 ml-2" />,
  }
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
  const members = serverdata?.members.filter((member) => member.profileId !== String(profile.id))
  const textchannels = serverdata?.channels.filter((channel) => channel.type === Type.TEXT)
  const audiochannels = serverdata?.channels.filter((channel) => channel.type === Type.AUDIO)
  const videochannels = serverdata?.channels.filter((channel) => channel.type === Type.VIDEO)
  const roles = serverdata.members.filter((member) => member.profileId === profile.id)[0]

  return (
    <div className="flex flex-1 flex-col h-full w-full dark:bg-[#1E1F22] border-l border-r ">
      <ServerHeader role={roles.role} server={serverdata} />
      <ScrollArea className="flex px-3">
        <div className="mt-2">
          <SearchBar
            data={[
              {
                label: 'Text Channel',
                type: 'channel',
                data: textchannels.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.title,
                })),
              },

              {
                label: 'Voice Channel',
                type: 'channel',
                data: audiochannels.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.title,
                })),
              },

              {
                label: 'Video Channel',
                type: 'channel',
                data: videochannels.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.title,
                })),
              },

              {
                label: 'general',
                type: 'member',
                data: members.map((member) => ({
                  id: member.id,
                  icon: roleIconMap[member.role],
                  name: member.profile.name,
                })),
              },
            ]}
          />
        </div>
        {!!textchannels.length && (
          <>
            <ServerSection
              label={'Text Channels'}
              role={roles.role}
              sectionType={'channels'}
              channelType={Type.TEXT}
            />
            {textchannels.map((textchannel) => (
              <ServerChannel
                key={textchannel.id}
                channel={textchannel}
                role={roles.role}
                server={serverdata}
              />
            ))}
          </>
        )}
        {!!audiochannels.length && (
          <>
            <ServerSection
              label={'Voice Channels'}
              role={roles.role}
              sectionType={'channels'}
              channelType={Type.AUDIO}
            />
            {audiochannels.map((audiochannel) => (
              <ServerChannel
                key={audiochannel.id}
                channel={audiochannel}
                role={roles.role}
                server={serverdata}
              />
            ))}
          </>
        )}
        {!!videochannels.length && (
          <>
            <ServerSection
              label={'Video Channels'}
              role={roles.role}
              sectionType={'channels'}
              channelType={Type.VIDEO}
            />
            {videochannels.map((videochannel) => (
              <ServerChannel
                key={videochannel.id}
                channel={videochannel}
                role={roles.role}
                server={serverdata}
              />
            ))}
          </>
        )}
        {!!members.length && (
          <>
            <ServerSection
              label="Members"
              role={roles.role}
              sectionType="members"
              server={serverdata}
            />
            {members.map((member) => (
              <ServerMember key={member.id} member={member} />
            ))}
          </>
        )}
      </ScrollArea>
    </div>
  )
}
export default ChannelSidebar
