import {Alert} from '@customTypes/Alert';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from './axiosConfig';

const getTripAlerts = async (tripId: string) => {
  const response = await axiosInstance.get<Alert[]>(`/${ServerRoutes.ALERTS}/${tripId}`);

  return response.data;
};

export {getTripAlerts};
