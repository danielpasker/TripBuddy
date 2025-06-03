import {AddActivityRequest, TripPlan, TripPlanRequest} from '@customTypes/TripPlan';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

const planTrip = async (planRequest: TripPlanRequest) => {
  const response = await axiosInstance.post<TripPlan>(`/${ServerRoutes.TRIP_PLAN}`, planRequest);

  return response.data;
};

const getTripPlanByTripId = async (tripId: string) => {
  const response = await axiosInstance.get<TripPlan>(`/${ServerRoutes.TRIPS}/${tripId}/plan`);

  return response.data;
};

const addActivityToPlan = async (tripId: string, request: AddActivityRequest) => {
  const response = await axiosInstance.patch<TripPlan>(`/${ServerRoutes.TRIPS}/${tripId}/plan`, request);

  return response.data;
};

export {planTrip, getTripPlanByTripId, addActivityToPlan};
