import {TripPlan} from '@customTypes/TripPlan';
import {User} from '@customTypes/User';

interface Trip {
  _id: string;
  startDate: string;
  endDate: string;
  country: string;
  users: User[];
  plan: TripPlan;
  isOpenToJoin: boolean;
}
interface TripPreview {
  _id: string;
  location: string;
  countryCode: string;
  startDate: string;
  endDate: string;
}
interface SaveTripRequest {
  startDate: string;
  endDate: string;
  users: string[];
  plan: TripPlan;
}
interface TripFilters {
  location: string;
  startDate: string;
  endDate: string;
  tripType: string[];
  budget?: number;
  maxParticipants: number;
  gender: string[];
  religion?: string[] | undefined;
  dietaryPreferences: string[];
  averageAge?: number;
}
export type {Trip, TripPreview, SaveTripRequest, TripFilters};
