import {z} from 'zod';
import {diets, genders, religions} from '@utils/consts';

const genderEnum = [...genders, 'Any'] as const;
const religionEnum = [...religions, 'Any'] as const;
const dietEnum = ['None', ...diets] as const;

export const joinTripSchema = z.object({
  location: z.string().nonempty().trim(),
  startDate: z.string().nonempty().trim(),
  endDate: z.string().nonempty().trim(),
  tripType: z.string().min(1, 'Please select a trip type').trim(),
  budget: z.number().positive(),
  maxParticipants: z.number().min(1, 'Max participants should be at least 1'),

  gender: z.array(z.enum(genderEnum)).min(1, 'Please select at least one gender'),
  religion: z.array(z.enum(religionEnum)).min(1, 'Please select at least one religion'),
  dietaryPreferences: z.array(z.enum(dietEnum)).min(1, 'Please select at least one dietary preference'),
  averageAge: z.number().min(16, 'Minimum age is 16').max(120, 'Maximum age is 120'),
});

export type JoinTripSchemaType = z.infer<typeof joinTripSchema>;
