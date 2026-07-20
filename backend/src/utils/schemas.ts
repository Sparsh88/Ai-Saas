import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
    name: z.string().min(2, 'Name must be at least 2 characters long.'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address.'),
    password: z.string().nonempty('Password is required.'),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address.'),
    code: z.string().length(6, 'Verification code must be exactly 6 digits.'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address.'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().nonempty('Token is required.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
  }),
});

export const projectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required.'),
    description: z.string().optional(),
  }),
});

export const taskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Task title is required.'),
    description: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().optional().nullable(),
  }),
});

export const aiToolSchema = z.object({
  body: z.object({
    toolName: z.string().nonempty('AI Tool name is required.'),
    payload: z.any(),
  }),
});
