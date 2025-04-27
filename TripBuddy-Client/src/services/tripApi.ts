import {Trip} from '@customTypes/Trip';
import {TripPlan} from '@customTypes/TripPlan';
import {User} from '@customTypes/User';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

interface SaveTripRequest {
  startDate: string;
  endDate: string;
  users: User[];
  plan: TripPlan;
}

const getTripById = async (tripId: string) => {
  const response = await axiosInstance.get<Trip>(`/${ServerRoutes.TRIP}/${tripId}`);

  return response.data;
};

const saveTrip = async (formattedStartDate: string, formattedEndDate: string, users: User[], tripPlan: TripPlan) => {
  const tripData: SaveTripRequest = {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    users: users,
    plan: tripPlan,
  };

  try {
    const response = await axiosInstance.post(`/${ServerRoutes.TRIP}`, tripData);
    return response.data;
  } catch (error) {
    console.error('Error saving trip:', error);
    throw error;
  }
};

export {saveTrip, getTripById};
