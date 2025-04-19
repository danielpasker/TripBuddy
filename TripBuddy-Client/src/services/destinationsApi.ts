import {Destination} from '@customTypes/Destination';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

export const getDestinations = async (query: string) => {
  const response = await axiosInstance.get<Destination[]>(`/${ServerRoutes.DESTINATIONS}`, {
    params: {
      query,
    },
  });

  return response.data;
};
