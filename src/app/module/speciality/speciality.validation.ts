import { z } from 'zod';

export const CreateSpecialitySchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'), // Changed from 'name' to 'title'
  description: z.string().max(500, 'Description must not exceed 500 characters').optional().nullable(),
  icon: z.string().max(255, 'Icon must not exceed 255 characters').optional().nullable(),
});

export const UpdateSpecialitySchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').optional(),
  description: z.string().max(500, 'Description must not exceed 500 characters').optional().nullable(),
  icon: z.string().max(255, 'Icon must not exceed 255 characters').optional().nullable(),
});

export type CreateSpecialityPayload = z.infer<typeof CreateSpecialitySchema>;
export type UpdateSpecialityPayload = z.infer<typeof UpdateSpecialitySchema>;