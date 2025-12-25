import { getProfileCached } from '@/lib/get-profile'
import { getIP } from '@/lib/ip'
import { checkRateLimit } from '@/lib/limit'
import { prisma } from '@/lib/prisma'
import { createServerLimiter, shouldCheckRateLimit } from '@/lib/rate-limit'
import { updateServerSchema } from '@/schema/server-schema'
import { InternalServerError, RateLimitExceeded, UnauthorizedError } from '@/utils/apierror'
import { asyncHandler } from '@/utils/asynchandler'
import { validateOrThrow } from '@/utils/valideschema'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export const PATCH = asyncHandler(async (req: NextRequest, context) => {
  const { params } = context
  const { serverId } = params
  const bodyData = await req.json()
  const { userId } = await auth()
  const ip = await getIP()

  if (shouldCheckRateLimit() && (await checkRateLimit(createServerLimiter, ip))) {
    throw new RateLimitExceeded()
  }

  if (!userId) {
    throw new UnauthorizedError('unauthorized for this request')
  }

  // ----- Cached profile -----
  const profile = await getProfileCached(userId)
  if (!profile) throw new UnauthorizedError()

  //--------Verify data-----

  const data = validateOrThrow(updateServerSchema, bodyData)
  //only admin can update the profile
  const serverupdate = await prisma.server.update({
    where: {
      id: serverId,
      profileId: profile.id,
    },
    data: {
      title: data?.title,
      description: data.description,
      imageUrl: data.imageUrl,
    },
  })
  if (!serverupdate) {
    throw new InternalServerError()
  }
  return NextResponse.json({ success: true, data: serverupdate }, { status: 200 })
})

export const DELETE = asyncHandler(async (req: NextRequest, context) => {
  const { params } = context
  const { serverId } = params
  const { userId } = await auth()
  const ip = await getIP()
  if (shouldCheckRateLimit() && (await checkRateLimit(createServerLimiter, ip))) {
    throw new RateLimitExceeded()
  }

  if (!userId) {
    throw new UnauthorizedError('unauthorized for this request')
  }

  // ----- Cached profile -----
  const profile = await getProfileCached(userId)
  if (!profile) throw new UnauthorizedError()

  //-------check admin previligous and delete
  const serverdelete = await prisma.server.deleteMany({
    where: {
      id: serverId,
      profileId: profile.id,
    },
  })
  if (!serverdelete) {
    throw new UnauthorizedError('user dont have illibility to delete server')
  }
  return NextResponse.json({ success: true, data: serverdelete }, { status: 200 })
})
