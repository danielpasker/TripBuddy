import {z} from 'zod';

export const getAddActivitySchema = (maxDays: number) =>
  z.object({
    day: z.coerce.number().min(1, 'Day must be at least 1').max(maxDays, `Day cannot exceed ${maxDays}`),
    activity: z.string().min(1, 'Activity is required').max(100, 'Activity name is too long'),
    location: z.string().min(1, 'Location is required').max(100, 'Location name is too long'),
  });

export type AddActivitySchemaType = z.infer<ReturnType<typeof getAddActivitySchema>>;
