import {z} from 'zod';

export const editUserDetailsSchema = z.object({
  gender: z.string().min(1).max(15).trim(),
  age: z.number().min(16, 'You must be at least 16').max(120),
  religion: z.string().min(1).max(15).trim(),
  diet: z.string().min(1).max(15).trim(),
});

export type EditUserDetailsType = z.infer<typeof editUserDetailsSchema>;
