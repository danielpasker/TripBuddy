// components/JoinTripForm/form.ts
import {z} from 'zod';

export const joinTripSchema = z.object({
  // … existing …
  gender: z.enum(['Female', 'Male', 'Non-binary', 'Other', 'Prefer not to say']).optional(),
  religion: z.enum(['Judaism', 'Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Atheism', 'Other']).optional(),
  diets: z
    .array(z.enum(['Vegetarian', 'Vegan', 'Pescatarian', 'Gluten-free', 'Halal', 'Kosher', 'Nothing Special', 'Other']))
    .optional(),
  averageAge: z.coerce.number().min(0).max(120).optional(),
});

export type JoinTripSchemaType = z.infer<typeof joinTripSchema>;
