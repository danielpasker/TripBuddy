interface TripPlanRequest {
  location: string;
  startDate: string;
  endDate: string;
  budget: number;
  type: string;
  participants: number;
}

interface AddActivityRequest {
  day: number;
  activity: string;
  location: string;
}

interface Activity {
  activity: string;
  location: string;
  isValid?: boolean;
  isCustom?: boolean;
}

interface DayPlan {
  day: number;
  activities: Activity[];
}

interface TripPlan {
  location: string;
  countryCode: string;
  days: number;
  budget: string;
  participants: number;
  tripType: string;
  plan: DayPlan[];
}

export type {TripPlanRequest, AddActivityRequest, TripPlan, DayPlan, Activity};
