import {z} from 'zod';

export const addActivitySchema = z.object({
  day: z.number().min(1, 'Day must be at least 1').max(30, 'Day cannot exceed 30'),
  activity: z.string().min(1, 'Activity is required').max(100, 'Activity name is too long'),
  location: z.string().min(1, 'Location is required').max(100, 'Location name is too long'),
});

export type AddActivitySchemaType = z.infer<typeof addActivitySchema>;
