import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';
import {TripPlan, TripPlanRequest} from '@customTypes/TripPlan';


const planTrip = async (planRequest: TripPlanRequest) => {
  const response = await axiosInstance.post<TripPlan>(`/${ServerRoutes.TRIP_PLAN}`, planRequest);

  return response.data;
};

export {planTrip};
