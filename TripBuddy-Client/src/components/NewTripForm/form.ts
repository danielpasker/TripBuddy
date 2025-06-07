import z from 'zod';
import {tripTypes} from '@utils/consts';

export const tripPlanSchema = z.object({
  location: z.string().nonempty().trim(),
  startDate: z.string().nonempty(),
  endDate: z.string().nonempty(),
  type: z.enum(tripTypes),
  budget: z.number().positive(),
  participants: z.number().positive(),
});

export type TripPlanSchemaType = z.infer<typeof tripPlanSchema>;
