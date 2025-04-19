import {Trip} from '@customTypes/Trip';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

const getTripById = async (tripId: string) => {
  const response = await axiosInstance.get<Trip>(`/${ServerRoutes.TRIP}/${tripId}`);

  return response.data;
};

export {getTripById};
