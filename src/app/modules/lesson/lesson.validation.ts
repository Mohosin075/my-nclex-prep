import { z } from 'zod';

const questionsItemSchema = z.object({
  questionText: z.string(),
  options: z.array(z.string()),
  array: z.record(z.string(), z.any()),
  stemTitle: z.string(),
  stemDescription: z.string().optional(),
  stemPicture: z.string().optional(),
});

export const LessonValidations = {
  create: z.object({
    title: z.string(),
    category: z.string(),
    lessonType: z.string(),
    questions: z.array(questionsItemSchema),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),

  update: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    lessonType: z.string().optional(),
    questions: z.array(questionsItemSchema).optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  }),
};
