import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(2, 'Task title must be at least 2 characters long'),
  description: z.string().optional(),
  assigned_to: z.string().uuid('Invalid user UUID format').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;