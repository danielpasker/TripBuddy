interface TripPlanRequest {
  location: string;
  days: number;
  budget: number;
  type: string;
  participants: number;
}

interface Activity {
  activity: string;
  location: string;
  isValid?: boolean;
  validationDetails?: any;
}

interface DayPlan {
  day: number;
  activities: Activity[];
}

interface TripPlan {
  location: string;
  days: number;
  budget: string;
  participants: number;
  plan: DayPlan[];
}

export type {TripPlanRequest, TripPlan};
