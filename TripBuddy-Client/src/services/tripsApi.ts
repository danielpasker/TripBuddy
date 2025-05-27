import {SaveTripRequest, Trip} from '@customTypes/Trip';
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

const getConversationHistory = async (tripId: string, userId: string) => {
  console.log('Fetching conversation history for tripId:', tripId, 'and userId:', userId);
  return [];
};

export {getTripById, saveTrip, getConversationHistory};
