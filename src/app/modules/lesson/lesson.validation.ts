import { z } from 'zod'

// 🔹 Stem Schema (for creation)
export const StemCreateSchema = z.object({
  body: z.object({
    stemTitle: z.string().min(1),
    stemDescription: z.string().optional(),
    stemPicture: z.string().optional(),
  }),
})

// 🔹 Question Schema (for creation)
export const QuestionCreateSchema = z.object({
  body: z
    .object({
      questionText: z.string().min(1),
      options: z
        .array(z.string())
        .min(2, 'Each question must have at least 2 options'),
      correctAnswer: z.number().int().min(0).optional(),
      explanation: z.string().optional(),
      stems: z
        .array(z.string().regex(/^[a-fA-F0-9]{24}$/))
        .optional()
        .default([]), // ObjectId strings
    })
    .superRefine((obj, ctx) => {
      if (obj.correctAnswer !== undefined) {
        if (!Array.isArray(obj.options) || obj.options.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'options must be a non-empty array when correctAnswer is provided',
          })
        } else if (
          obj.correctAnswer < 0 ||
          obj.correctAnswer >= obj.options.length
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'correctAnswer index out of bounds',
          })
        }
      }
    }),
})

// 🔹 Lesson Schema (for creation)
export const LessonCreateSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    category: z.enum(['case', 'nextgen']),
    lessonType: z.enum(['chart', 'video', 'text', 'simulation']),
    questions: z
      .array(z.string().regex(/^[a-fA-F0-9]{24}$/))
      .optional()
      .default([]), // ObjectId strings
  }),
})

// 🔹 Type inference for creation
export type LessonCreateInput = z.infer<typeof LessonCreateSchema>

// 🔹 Stem Schema (for update)
export const StemUpdateSchema = z.object({
  body: z.object({
    stemTitle: z.string().min(1).optional(),
    stemDescription: z.string().optional(),
    stemPicture: z.string().optional(),
  }),
})

// 🔹 Question Schema (for update)
export const QuestionUpdateSchema = z.object({
  body: z
    .object({
      questionText: z.string().min(1).optional(),
      options: z
        .array(z.string())
        .min(2, 'Each question must have at least 2 options')
        .optional(),
      correctAnswer: z.number().int().min(0).optional(),
      explanation: z.string().optional(),
      stems: z.array(z.string().regex(/^[a-fA-F0-9]{24}$/)).optional(), // ObjectId strings
    })
    .superRefine((obj, ctx) => {
      if (obj.correctAnswer !== undefined && obj.options !== undefined) {
        if (!Array.isArray(obj.options) || obj.options.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'options must be a non-empty array when correctAnswer is provided',
          })
        } else if (
          obj.correctAnswer < 0 ||
          obj.correctAnswer >= obj.options.length
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'correctAnswer index out of bounds',
          })
        }
      }
    }),
})
