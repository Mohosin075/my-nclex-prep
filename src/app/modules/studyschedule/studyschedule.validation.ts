import { z } from 'zod';

export const StudyscheduleValidations = {
  create: z.object({
    body : z.object({
      calendar: z.string().datetime(),
      title: z.string(),
      description: z.string().optional(),
    })
  }),

  update: z.object({
    body : z.object({
      calendar: z.string().datetime().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      createdBy: z.string().optional(),
      isDeleted: z.boolean().optional(),
    })
  }),
};
