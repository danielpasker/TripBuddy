import {z} from 'zod';

export const joinTripSchema = z.object({
  startDate: z.date().min(new Date(), 'Start date must be in the future'),
  endDate: z.date().min(new Date(), 'End date must be in the future'),
  tripType: z.string().min(1, 'Please select a trip type'),
  budget: z.number().positive().optional(),
  maxParticipants: z.number().min(1, 'Max participants should be at least 1'),
  gender: z.string().optional(),
  religion: z.string().optional(),
  dietaryPreferences: z.array(z.string()).optional(),
  averageAge: z.number().min(0).max(120).optional(),
});

export type JoinTripSchemaType = z.infer<typeof joinTripSchema>;
