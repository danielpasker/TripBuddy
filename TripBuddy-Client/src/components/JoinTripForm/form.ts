// src/components/JoinTripForm/form.ts
import {z} from 'zod';
import {diets, genders, religions} from '@utils/consts';

const genderEnum = [...genders, 'Any'] as const;
const religionEnum = [...religions, 'Any'] as const;
const dietEnum = ['None', ...diets] as const;
const tripTypes = ['Any', 'Adventure', 'Relaxation', 'Cultural', 'Culinary', 'Nature'] as const;

export const joinTripSchema = z.object({
  location: z.string().nonempty().trim(),
  startDate: z.string().nonempty().trim(),
  endDate: z.string().nonempty().trim(),

  tripType: z.array(z.enum(tripTypes)).min(1, 'Please select at least one trip type'),

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

  gender: z.array(z.enum(genderEnum)).min(1, 'Please select at least one gender').optional(),
  religion: z.array(z.enum(religionEnum)).min(1, 'Please select at least one religion').optional(),
  dietaryPreferences: z.array(z.enum(dietEnum)).min(1, 'Please select at least one dietary preference').optional(),

  averageAge: z.preprocess(val => {
    if (typeof val === 'string') return parseInt(val, 10);
    return val;
  }, z.number().min(16, 'Minimum age is 16').max(120, 'Maximum age is 120').optional()),
});

export type JoinTripSchemaType = z.infer<typeof joinTripSchema>;
