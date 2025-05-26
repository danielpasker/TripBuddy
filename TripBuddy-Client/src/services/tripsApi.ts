import {SaveTripRequest, Trip, TripFilters} from '@customTypes/Trip';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

const getTripById = async (tripId: string) => {
  const response = await axiosInstance.get<Trip>(`/${ServerRoutes.TRIPS}/${tripId}`);

  return response.data;
};

const saveTrip = async (request: SaveTripRequest) => {
  const response = await axiosInstance.post(`/${ServerRoutes.TRIPS}`, request);

  return response.data;
};

const setIsOpenToJoin = async (tripId: string, isOpenToJoin: boolean) => {
  await axiosInstance.put(`/${ServerRoutes.TRIPS}/${tripId}/open-to-join`, {isOpenToJoin});
};

const getMatches = async (filters: TripFilters) => {
  return (await axiosInstance.get<Trip[]>(`/${ServerRoutes.TRIPS}/match`, {params: filters})).data;
};

export {getTripById, saveTrip, setIsOpenToJoin, getMatches};
