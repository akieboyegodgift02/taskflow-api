import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(2, 'Project title must be at least 2 characters long'),
  description: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;