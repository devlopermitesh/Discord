import { Role } from '@/lib/generated/prisma/enums'
import { getProfileCached } from '@/lib/get-profile'
import { getIP } from '@/lib/ip'
import { checkRateLimit } from '@/lib/limit'
import { prisma } from '@/lib/prisma'
import { rateLimitUpload, shouldCheckRateLimit } from '@/lib/rate-limit'
import {
  BadRequestError,
  InternalServerError,
  RateLimitExceeded,
  UnauthorizedError,
} from '@/utils/apierror'
import { asyncHandler } from '@/utils/asynchandler'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export const PATCH = asyncHandler(async (req: NextRequest, context) => {
  const { params } = context
  const { memberId } = params
  const { role } = await req.json()
  const { searchParams } = new URL(req.url)
  const serverId = searchParams.get('serverId')
  const { userId } = await auth()
  const ip = await getIP()

  if (shouldCheckRateLimit() && (await checkRateLimit(rateLimitUpload, ip))) {
    throw new RateLimitExceeded()
  }

  if (!userId) {
    throw new UnauthorizedError('unauthorized for this request')
  }

  // ----- Cached profile -----
  const profile = await getProfileCached(userId)
  if (!profile) throw new UnauthorizedError()

  if (!serverId) throw new BadRequestError('Server id is missing')
  if (!memberId) throw new BadRequestError('Member Id is missing')
  //--------Verify data-----
  if (!Object.values(Role).includes(role)) {
    throw new BadRequestError('Invalid role')
  }
  //-------Update Operations--------
  const updateserver = await prisma.server.update({
    where: {
      id: serverId,
      profileId: {
        not: memberId,
      },
      profile: {
        id: profile.id,
      },
    },
    data: {
      members: {
        update: {
          where: {
            id: memberId,
          },
          data: {
            role: role,
          },
        },
      },
    },
    include: {
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  })
  console.log('updateserver', updateserver)
  if (!updateserver) {
    throw new InternalServerError()
  }
  return NextResponse.json({ success: true, data: updateserver }, { status: 200 })
})

export const DELETE = asyncHandler(
  async (req: NextRequest, context: { params: { memberId: string } }) => {
    const { params } = context
    const { memberId } = params
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')
    const { userId } = await auth()
    if (!userId) {
      throw new UnauthorizedError('unauthorized for this request')
    }

    // ----- Cached profile -----
    const profile = await getProfileCached(userId)
    if (!profile) throw new UnauthorizedError()

    if (!serverId) throw new BadRequestError('Server id is missing')
    if (!memberId) throw new BadRequestError('Member Id is missing')

    const serverupdate = await prisma.server.update({
      where: {
        id: serverId,
        profileId: {
          not: memberId,
        },
        profile: {
          id: profile.id,
        },
      },
      data: {
        members: {
          delete: {
            id: memberId,
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    })

    if (!serverupdate) {
      throw new InternalServerError()
    }

    return NextResponse.json({ success: true, data: serverupdate }, { status: 200 })
  }
)
