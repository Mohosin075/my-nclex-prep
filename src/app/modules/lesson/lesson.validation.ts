import { z } from 'zod'
import { defaultStats } from './lesson.constants'
import { LessonType } from '../../../enum/lesson'

// Lesson schema (main)
export const LessonSchema = z.object({
  body: z.object({
    category: z.enum(Object.values(LessonType) as [string, ...string[]]),
    name: z.string().optional(),
    code: z.string().optional(),
    description: z.string().optional(),
    isPublished: z.boolean().optional().default(false),
    durationMinutes: z.number().optional().default(100),
    passMark: z.number().optional().default(40),
    stats: z.record(z.any()).default(defaultStats),
    createdBy: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ObjectId')
      .optional(),
  }),
})

export type LessonBody = z.infer<typeof LessonSchema>
