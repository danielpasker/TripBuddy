import {z} from 'zod';

export const joinTripSchema = z.object({
  location: z.string().nonempty('Select a destination'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  type: z.string().optional(),
  budget: z.number().int().min(0).optional(),
  participants: z.number().int().min(1).optional(),
  gender: z.enum(['any', 'male', 'female']).optional(),
  religion: z.string().optional(),
  diets: z.array(z.string()).optional(),
  averageAge: z.number().int().min(0).max(120).optional(),
});

export type JoinTripSchemaType = z.infer<typeof joinTripSchema>;
