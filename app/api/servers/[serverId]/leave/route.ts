import { getProfileCached } from '@/lib/get-profile'
import { getIP } from '@/lib/ip'
import { checkRateLimit } from '@/lib/limit'
import { prisma } from '@/lib/prisma'
import { LeaveServerLimit, shouldCheckRateLimit } from '@/lib/rate-limit'
import { RateLimitExceeded, UnauthorizedError } from '@/utils/apierror'
import { asyncHandler } from '@/utils/asynchandler'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export const POST = asyncHandler(async (req: NextRequest, context) => {
  const { params } = context
  const { serverId } = params
  const { userId } = await auth()
  const ip = await getIP()
  if (shouldCheckRateLimit() && (await checkRateLimit(LeaveServerLimit, ip))) {
    throw new RateLimitExceeded()
  }

  if (!userId) {
    throw new UnauthorizedError('unauthorized for this request')
  }

  // ----- Cached profile -----
  const profile = await getProfileCached(userId)
  if (!profile) throw new UnauthorizedError()
  const update = await prisma.server.update({
    where: {
      id: serverId,
    },
    data: {
      members: {
        deleteMany: {
          profileId: profile.id,
        },
      },
    },
  })

  if (!update) {
    throw new UnauthorizedError('unable to leave server try again later')
  }
  return NextResponse.json(
    {
      success: true,
      data: update,
    },
    {
      status: 200,
    }
  )
})
