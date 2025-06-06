import {z} from 'zod';
import {diets, genders, religions, tripTypes} from '@utils/consts';

const genderEnum = [...genders, 'Any'] as const;
const religionEnum = [...religions, 'Any'] as const;
const dietEnum = ['None', ...diets] as const;
const tripTypesEnum = ['Any', ...tripTypes] as const;

export const joinTripSchema = z.object({
  location: z.string().nonempty().trim(),
  startDate: z.string().nonempty().trim(),
  endDate: z.string().nonempty().trim(),
  tripType: z.array(z.enum(tripTypesEnum)).min(1, 'Please select at least one trip type'),
  budget: z.preprocess(val => {
    if (typeof val === 'string') return parseFloat(val);
    return val;
  }, z.number().positive('Budget must be a positive number')),
  maxParticipants: z.preprocess(
    val => {
      if (typeof val === 'string') return parseInt(val, 10);
      return val;
    },
    z.number().min(1, 'Max participants should be at least 1')
  ),
  gender: z.array(z.enum(genderEnum)).optional(),
  religion: z.array(z.enum(religionEnum)).optional(),
  dietaryPreferences: z.array(z.enum(dietEnum)).optional(),
  averageAge: z.preprocess(val => {
    if (typeof val === 'string') return parseInt(val, 10);
    return val;
  }, z.number().min(16, 'Minimum age is 16').max(120, 'Maximum age is 120').optional()),
});

export type JoinTripSchemaType = z.infer<typeof joinTripSchema>;
