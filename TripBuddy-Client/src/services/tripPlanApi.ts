import {TripPlan, TripPlanRequest} from '@customTypes/TripPlan';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

const planTrip = async (planRequest: TripPlanRequest) => {
  const response = await axiosInstance.post<TripPlan>(`/${ServerRoutes.TRIP_PLAN}`, planRequest);

  return response.data;
};

export {planTrip};
