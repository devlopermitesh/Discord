import { Role } from '@/lib/generated/prisma/enums'
import { getProfileCached } from '@/lib/get-profile'
import { prisma } from '@/lib/prisma'
import { updatechannelSchema } from '@/schema/channel-schema'
import { BadRequestError, InternalServerError, UnauthorizedError } from '@/utils/apierror'
import { asyncHandler } from '@/utils/asynchandler'
import { validateOrThrow } from '@/utils/valideschema'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export const PATCH = asyncHandler(
  async (req: NextRequest, context?: { params: { channelId: string } }) => {
    const bodyData = await req.json()
    const { searchParams } = new URL(req.url)
    const { userId } = await auth()
    const params = context!.params
    const { channelId } = params

    const serverId = searchParams.get('serverId')

    if (!userId) {
      throw new UnauthorizedError('unauthorized for this request')
    }

    // ----- Cached profile -----
    const profile = await getProfileCached(userId)
    if (!profile) throw new UnauthorizedError()

    if (!serverId) throw new BadRequestError('Server id is missing')

    //--------Verify data-----

    const data = validateOrThrow(updatechannelSchema, bodyData)

    //---------check role--------
    const member = await prisma.member.findFirst({
      where: {
        serverId,
        profileId: profile.id,
        role: {
          in: [Role.ADMIN, Role.MOD], // Admin ya Moderator allowed
        },
      },
    })

    if (!member) {
      throw new UnauthorizedError('Unauthorized: User not authorized to create channel')
    }
    const updatechannel = await prisma.channel.update({
      where: {
        id: channelId,
      },
      data: {
        title: data.title,
        type: data.type,
      },
      include: {
        profile: true,
      },
    })
    if (!updatechannel) {
      throw new InternalServerError()
    }
    return NextResponse.json({ success: true, data: updatechannel }, { status: 200 })
  }
)

export const DELETE = asyncHandler(
  async (req: NextRequest, context?: { params: { channelId: string } }) => {
    const { searchParams } = new URL(req.url)
    const { userId } = await auth()
    const params = context!.params
    const { channelId } = params

    const serverId = searchParams.get('serverId')

    if (!userId) {
      throw new UnauthorizedError('unauthorized for this request')
    }

    // ----- Cached profile -----
    const profile = await getProfileCached(userId)
    if (!profile) throw new UnauthorizedError()

    if (!serverId) throw new BadRequestError('Server id is missing')

    //---------check role--------
    const member = await prisma.member.findFirst({
      where: {
        serverId,
        profileId: profile.id,
        role: {
          in: [Role.ADMIN, Role.MOD], // Admin ya Moderator allowed
        },
      },
    })

    if (!member) {
      throw new UnauthorizedError('Unauthorized: User not authorized to create channel')
    }

    //delete channel
    const deleteChannel = await prisma.channel.delete({
      where: {
        id: channelId,
      },
    })
    if (!deleteChannel) {
      throw new InternalServerError()
    }
    return NextResponse.json({ success: true, data: deleteChannel }, { status: 200 })
  }
)
