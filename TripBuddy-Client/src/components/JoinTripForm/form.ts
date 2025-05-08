// components/JoinTripForm/form.ts
import {z} from 'zod';

export const joinTripSchema = z.object({
  location: z.string().nonempty('Select a destination'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  tripTypes: z.array(z.string()).optional(),
  minParticipants: z.number().int().min(1).optional(),
  maxParticipants: z.number().int().min(1).optional(),
  gender: z.enum(['any', 'male', 'female']).optional(),
  religion: z.string().optional(),
});

export type JoinTripSchemaType = z.infer<typeof joinTripSchema>;
