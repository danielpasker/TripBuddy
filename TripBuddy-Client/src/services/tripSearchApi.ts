// src/services/tripSearchApi.ts
import {JoinTripSchemaType} from '@components/JoinTripForm/form';
import {TripPlan} from '@customTypes/TripPlan';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

export async function searchTrips(filters: JoinTripSchemaType): Promise<TripPlan[]> {
  const response = await axiosInstance.get<TripPlan[]>(`/${ServerRoutes.TRIPS}/search`, {params: filters});
  return response.data;
}
