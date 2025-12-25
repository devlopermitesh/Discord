import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'

/**
 *  different rate limiter instances
 */
export const createServerLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, '60 s'), // 2 request per minute
  analytics: true,
  prefix: 'rl_newserver',
})
export const LeaveServerLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'), // 5 request per minute
  analytics: false,
  prefix: 'rl_leaveserver',
})

export const rateLimitChat = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'), // chat-friendly
  prefix: 'rl_chat',
})

export const rateLimitUpload = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 m'), // upload expensive
  prefix: 'rl_upload',
})

export const rateLimitSearch = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  prefix: 'rl_search',
})
export const updateServerInvitecodeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, '1 d'),
  prefix: 'rsil_code',
})

export function shouldCheckRateLimit(): boolean {
  // Development mein skip karo
  if (process.env.NODE_ENV === 'development') {
    return false
  }

  // Production mein check karo
  return true
}
