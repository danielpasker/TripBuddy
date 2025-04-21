import {TripPlan, TripPlanRequest} from '@customTypes/TripPlan';
import {User} from '@customTypes/User';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

const planTrip = async (planRequest: TripPlanRequest) => {
  const response = await axiosInstance.post<TripPlan>(`/${ServerRoutes.TRIP_PLAN}`, planRequest);

  return response.data;
};

const getTripPlanByTripId = async (tripId: string) => {
  const response = await axiosInstance.get<TripPlan>(`/${ServerRoutes.TRIP}/${tripId}/plan`);

  return response.data;
};

const saveTripPlan = async (startDate: string, endDate: string, users: User[], plan: TripPlan) => {
  try {
    // Send a PUT request to save the trip plan
    console.log('Plan data:', JSON.stringify(plan, null, 2));

    const response = await axiosInstance.post<TripPlan>(`/${ServerRoutes.TRIP_PLAN}/save`, {
      startDate,
      endDate,
      users,
      plan,
    });

    // Return the response data (saved trip)
    return response.data;
  } catch (error) {
    console.error('Error saving trip:', error);
    throw error;
  }
};

export {planTrip, getTripPlanByTripId, saveTripPlan};
