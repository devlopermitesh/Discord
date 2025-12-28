import { Role } from '@/lib/generated/prisma/enums'
import { getProfileCached } from '@/lib/get-profile'
import { getIP } from '@/lib/ip'
import { checkRateLimit } from '@/lib/limit'
import { prisma } from '@/lib/prisma'
import { createServerLimiter, shouldCheckRateLimit } from '@/lib/rate-limit'
import { createchannelSchema } from '@/schema/channel-schema'
import { BadRequestError, RateLimitExceeded, UnauthorizedError } from '@/utils/apierror'
import { asyncHandler } from '@/utils/asynchandler'
import { validateOrThrow } from '@/utils/valideschema'
import { auth } from '@clerk/nextjs/server'
import { unauthorized } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export const POST = asyncHandler(async (req: NextRequest, _context) => {
  const Bodydata = await req.json()
  const { searchParams } = new URL(req.url)
  const { userId } = await auth()
  const ip = await getIP()
  const serverId = searchParams.get('serverId')

  if (shouldCheckRateLimit() && (await checkRateLimit(createServerLimiter, ip))) {
    throw new RateLimitExceeded()
  }

  if (!userId) {
    throw new UnauthorizedError('unauthorized for this request')
  }

  // ----- Cached profile -----
  const profile = await getProfileCached(userId)
  if (!profile) throw new UnauthorizedError()

  if (!serverId) throw new BadRequestError('Server id is missing')

  //---data validation-----
  const data = validateOrThrow(createchannelSchema, Bodydata)

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

  //create channel
  const newchannel = await prisma.channel.create({
    data: {
      title: data.title,
      serverId: serverId,
      profileId: profile.id,
      type: data.type,
    },
  })
  if (!newchannel) {
    throw unauthorized()
  }

  return NextResponse.json({ success: true, data: newchannel }, { status: 200 })
})
