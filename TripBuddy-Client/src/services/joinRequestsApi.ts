import {JoinRequestPreview} from '@customTypes/JoinRequest';
import {Trip} from '@customTypes/Trip';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

const createJoinRequest = async (tripId: string) => {
  await axiosInstance.post(`/${ServerRoutes.JOIN_REQUESTS}`, {tripId});
};

const getJoinRequests = async (tripId: string) => {
  const response = await axiosInstance.get<JoinRequestPreview[]>(`/${ServerRoutes.JOIN_REQUESTS}/${tripId}`);

  return response.data;
};

const approveJoinRequest = async (joinRequestId: string) => {
  const response = await axiosInstance.post<Trip>(`/${ServerRoutes.JOIN_REQUESTS}/${joinRequestId}/approve`);

  return response.data;
};

const declineJoinRequest = async (joinRequestId: string) => {
  await axiosInstance.post<Trip>(`/${ServerRoutes.JOIN_REQUESTS}/${joinRequestId}/decline`);
};

export {createJoinRequest, getJoinRequests, approveJoinRequest, declineJoinRequest};
