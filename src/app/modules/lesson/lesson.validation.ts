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
  body: z.object({
    questionText: z.string().min(1),
    options: z
      .array(z.string())
      .min(2, 'Each question must have at least 2 options'),
    correctAnswer: z.string().min(1),
    explanation: z.string().optional(),
    stems: z
      .array(z.string().regex(/^[a-fA-F0-9]{24}$/))
      .optional()
      .default([]), // ObjectId strings
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
