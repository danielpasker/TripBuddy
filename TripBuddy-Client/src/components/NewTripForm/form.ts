import z from 'zod'

export const tripPlanSchema = z.object({
    location: z.string().nonempty().trim(),
    startDate: z.string().nonempty(),
    endDate: z.string().nonempty(),
    type: z.string().nonempty(),
    budget: z.number(),
    participants: z.number()
})

export type TripPlanSchemaType = z.infer<typeof tripPlanSchema>

