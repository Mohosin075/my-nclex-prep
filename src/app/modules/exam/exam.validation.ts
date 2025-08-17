// src/modules/exam/exam.validation.ts
import { z } from 'zod'
import { QuestionType } from './exam.interface'

const optionZ = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  isCorrect: z.boolean().optional(),
  explanation: z.string().optional(),
  mediaUrl: z.string().url().optional(),
})

export const questionZ = z
  .object({
    type: z.nativeEnum(QuestionType),
    stems: z
      .array(
        z.object({
          stemTitle: z.string().optional(),
          stemDescription: z.string().optional(),
        }),
      )
      .optional(),
    title: z.string().min(1),

    // MCQ
    options: z.array(optionZ).optional(),
    allowMultiple: z.boolean().optional(),

    // Number
    numberAnswer: z.number().optional(),
    numberMin: z.number().optional(),
    numberMax: z.number().optional(),

    // Rearranging
    rearrangeItems: z.array(z.string()).optional(),
    correctOrder: z.array(z.number()).optional(),

    points: z.number().min(0).optional(),
    negativePoints: z.number().min(0).optional(),
    tags: z.array(z.string()).optional(),
    explanation: z.string().optional(),
  })
  .superRefine((q, ctx) => {
    const isMCQ = [
      QuestionType.CHECKBOX,
      QuestionType.RADIO,
      QuestionType.BOX,
      QuestionType.CHART_BOX,
      QuestionType.DROPDOWN,
    ].includes(q.type)

    if (isMCQ) {
      if (!q.options?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'options required',
        })
      }
      const single =
        q.type === QuestionType.RADIO ||
        q.type === QuestionType.BOX ||
        (q.type === QuestionType.DROPDOWN && !q.allowMultiple)

      if (single && (q.options?.filter(o => o.isCorrect).length ?? 0) !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'exactly one correct option required',
        })
      }
    }

    if (q.type === QuestionType.NUMBER && q.numberAnswer === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'numberAnswer required',
      })
    }

    if (q.type === QuestionType.REARRANGE) {
      if (!q.rearrangeItems?.length || !q.correctOrder?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'rearrangeItems & correctOrder required',
        })
      }
    }
  })

export const createExamZ = z.object({
  body: z.object({
    name: z.string().min(1),
    code: z.string().optional(),
    description: z.string().optional(),
    isPublished: z.boolean().optional(),
    durationMinutes: z.number().int().nonnegative().optional(),
    passMark: z.number().min(0).max(100).optional(),
    questions: z.array(questionZ).default([]),
  }),
})
