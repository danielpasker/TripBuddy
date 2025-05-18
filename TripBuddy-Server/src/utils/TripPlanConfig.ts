import {TripPlan, TripPlanRequest} from '@customTypes/tripPlan';

const responseShape: TripPlan = {
  location: 'string',
  countryCode: 'code of the country of the location',
  days: 1,
  budget: 'string',
  participants: 1,
  tripType: 'string (type of the trip)',
  plan: [
    {
      day: 1,
      activities: [
        {
          activity: 'string (description of activity). make it at least 25 words long',
          location:
            'string (' +
            'always of specific simple location name that can be found and verified on openstreetmap. e.g. "Eiffel Tower". ' +
            'represents a single, specific, existing location without special characters or brackets at all. ' +
            'never give a generic response like some pub or some/your hotel or Your x location)',
        },
      ],
    },
  ],
};

const createPrompt = (planRequest: TripPlanRequest) =>
  JSON.stringify([
    {role: 'system', content: 'You are a travel assistant.'},
    {
      role: 'user',
      content: `Plan a trip to ${planRequest.location} from ${planRequest.startDate} to ${planRequest.endDate}, including the end date
       With a budget of ${planRequest.budget} of local currency. 
       The type of the trip will be ${planRequest.type}.
       The number of participants will be ${planRequest.participants}.
       Return the plan only as JSON of shape: ${JSON.stringify(responseShape)}`,
    },
  ]);

export type {TripPlan};
export {createPrompt};
