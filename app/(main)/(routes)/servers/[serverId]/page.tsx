import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import React from 'react'

interface ServerParams {
  params: Promise<{
    serverId: string
  }>
}
const Page = async ({ params }: ServerParams) => {
  const { serverId } = await params
  //finder server
  const server = await prisma.server.findFirst({
    where: {
      id: serverId,
    },
    include: {
      channels: true,
    },
  })

  if (!server) {
    redirect('/')
  }
  const channelIntial = server.channels[0]
  if (!channelIntial) {
    return null
  }
  redirect(`/servers/${serverId}/channels/${channelIntial.id}`)
}
export default Page
