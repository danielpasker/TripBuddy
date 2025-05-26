export type TripFilters = {
  location: string;
  startDate: Date;
  endDate: Date;
  tripType: string[];
  budget: number;
  maxParticipants: number;
  gender?: string[];
  religion?: string[];
  dietaryPreferences?: string[];
  averageAge?: number;
};
