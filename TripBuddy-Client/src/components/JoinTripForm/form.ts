import {z} from 'zod';

export const joinTripSchema = z.object({
  location: z.string().nonempty().trim(),
  startDate: z.string().nonempty().trim(),
  endDate: z.string().nonempty().trim(),
  tripType: z.string().min(1, 'Please select a trip type').trim(),
  budget: z.number().positive(),
  maxParticipants: z.number().min(1, 'Max participants should be at least 1'),
  gender: z.string().trim(),
  religion: z.string().trim(),
  dietaryPreferences: z.array(z.string()).min(1, 'Please select at least one dietary preference'),
  averageAge: z.number().min(16, 'Minimum age is 16').max(120),
});

export type JoinTripSchemaType = z.infer<typeof joinTripSchema>;
