import { z } from 'zod';

export const StudymaterialValidations = {
  create: z.object({
    name: z.string(),
    category: z.string(),
    size: z.string(),
    uploadDate: z.string().datetime(),
    type: z.string(),
    fileUrl: z.string(),
    uploadedBy: z.string(),
  }),

  update: z.object({
    name: z.string().optional(),
    category: z.string().optional(),
    size: z.string().optional(),
    uploadDate: z.string().datetime().optional(),
    type: z.string().optional(),
    fileUrl: z.string().optional(),
    uploadedBy: z.string().optional(),
  }),
};
