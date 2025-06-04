import {Alert} from '@customTypes/Alert';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from './axiosConfig';

const getAlerts = async (country: string) => {
  return (await axiosInstance.get<Alert[]>(`/${ServerRoutes.ALERTS}`, {params: {country}})).data;
};

export {getAlerts};
