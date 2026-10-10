import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters long'),
});

export const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address format'),
  role: z.enum(['ADMIN', 'MANAGER', 'MEMBER'], {
    message: "Role must be ADMIN, MANAGER, or MEMBER",
  }),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
