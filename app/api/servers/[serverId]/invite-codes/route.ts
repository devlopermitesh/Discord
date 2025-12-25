import { getProfileCached } from '@/lib/get-profile'
import { getIP } from '@/lib/ip'
import { checkRateLimit } from '@/lib/limit'
import { prisma } from '@/lib/prisma'
import { shouldCheckRateLimit, updateServerInvitecodeLimiter } from '@/lib/rate-limit'
import { InternalServerError, RateLimitExceeded, UnauthorizedError } from '@/utils/apierror'
import { asyncHandler } from '@/utils/asynchandler'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuid } from 'uuid'
export const PATCH = asyncHandler(async (req: NextRequest, context) => {
  const { params } = context
  const { serverId } = params
  const { userId } = await auth()
  const ip = await getIP()

  if (shouldCheckRateLimit() && (await checkRateLimit(updateServerInvitecodeLimiter, ip))) {
    throw new RateLimitExceeded()
  }

  if (!userId) {
    throw new UnauthorizedError('unauthorized for this request')
  }

  // ----- Cached profile -----
  const profile = await getProfileCached(userId)
  if (!profile) throw new UnauthorizedError()

  const serverupdated = await prisma.server.update({
    where: {
      id: serverId,
      profileId: profile.id,
    },
    data: {
      inviteCode: uuid(),
    },
  })
  if (!serverupdated) {
    throw new InternalServerError()
  }
  return NextResponse.json(
    {
      success: true,
      data: serverupdated,
    },
    {
      status: 200,
    }
  )
})
