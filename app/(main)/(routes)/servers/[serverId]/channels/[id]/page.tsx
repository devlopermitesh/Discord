import ChatHeader from '@/components/molecular/ChatHeader'
import { getProfileCached } from '@/lib/get-profile'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
interface ChatIdProps {
  params: Promise<{
    id: string
    serverId: string
  }>
}
async function page({ params }: ChatIdProps) {
  const { id, serverId } = await params
  const { userId } = await auth()
  if (!userId) return redirect('/login')
  const profile = await getProfileCached(userId)
  if (!profile) return redirect('/login')
  //find channel model and serverId
  const channel = await prisma.channel.findUnique({
    where: {
      id: id,
      serverId: serverId,
    },
  })

  if (!channel) {
    return redirect('/')
  }
  return (
    <div className="flex flex-col w-full h-auto ">
      <ChatHeader name={channel?.title} serverId={serverId} type="channel" />
    </div>
  )
}

export default page
