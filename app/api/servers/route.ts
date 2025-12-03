import { asyncHandler } from '@/utils/asynchandler'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { InternalServerError, RateLimitExceeded, UnauthorizedError } from '@/utils/apierror'
import { prisma } from '@/lib/prisma'
import { validateOrThrow } from '@/utils/valideschema'
import { createServerSchema } from '@/schema/server-schema'
import { v4 as uuidv4 } from 'uuid'
import { Role } from '@/lib/generated/prisma/enums'
import { getIP } from '@/lib/ip'
import { checkRateLimit } from '@/lib/limit'
import { createServerLimiter, shouldCheckRateLimit } from '@/lib/rate-limit'
import { getProfileCached } from '@/lib/get-profile'
export const POST = asyncHandler(async (req: NextRequest, _context) => {
  const { userId } = await auth()
  const Bodydata = await req.json()
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

  const data = validateOrThrow(createServerSchema, Bodydata)
  //create a new server
  const server = await prisma.server.create({
    data: {
      profileId: profile.id,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      inviteCode: uuidv4(),
      channels: {
        create: [
          {
            title: 'general',
            profileId: profile.id,
          },
        ],
      },
      members: {
        create: [{ profileId: profile.id, role: Role.ADMIN }],
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      inviteCode: true,
      imageUrl: true,
      profileId: true,
      createdAt: true,
    },
  })

  if (!server) {
    throw new InternalServerError()
  }

  return NextResponse.json(
    {
      success: true,
      data: server,
    },
    {
      status: 200,
    }
  )
})
