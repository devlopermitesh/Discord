import { Type } from '@/lib/generated/prisma/enums'
import z from 'zod'

export const createchannelSchema = z.object({
  title: z
    .string()
    .min(1, 'invalid channel name too small!')
    .refine((name) => name !== 'general', { message: 'Name cant be general' }),
  type: z.enum(Type),
})
