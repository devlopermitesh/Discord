import { prisma } from '@/lib/prisma'
import { cacheGet, cacheSet } from '@/lib/cache'
type Profile = {
  id: string
  userId: string
  email: string
  name: string
  imageUrl: string | null
}

export async function getProfileCached(userId: string): Promise<Profile | null> {
  const key = `profile:${userId}`

  //  Check cache
  const cached = await cacheGet(key)
  if (cached) return cached

  //  DB fetch
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true, userId: true, name: true, imageUrl: true, email: true, createdAt: true },
  })
  if (!profile) return null

  // 3) Save to cache
  await cacheSet(key, profile, 300) // 5 minutes

  return profile
}
