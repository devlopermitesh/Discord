import { z } from 'zod'

export const createServerSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'description is required'),
  imageUrl: z.string().optional().nullable(),
})

export const updateServerSchema = createServerSchema.partial().extend({
  imageUrl: z.string().optional().nullable(),
})
