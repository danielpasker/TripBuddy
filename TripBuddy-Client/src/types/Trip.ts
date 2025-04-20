import {TripPlan} from '@customTypes/TripPlan';
import {User} from '@customTypes/User';

interface Trip {
  _id: string;
  startDate: string;
  endDate: string;
  users: User[];
  plan: TripPlan;
}

export type {Trip};
