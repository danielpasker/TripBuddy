import {z} from 'zod';

export const joinTripSchema = z.object({
  location: z.string().nonempty('Select a destination'),

  startDate: z.string().optional(),
  endDate: z.string().optional(),
  tripTypes: z.array(z.string()).optional(),
  groupSize: z.enum(['small', 'large']).optional(),

  gender: z.enum(['any', 'male', 'female']).optional(),
  religion: z.string().optional(),
});

export type JoinTripSchemaType = z.infer<typeof joinTripSchema>;
