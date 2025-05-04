import {TripPreview} from '@customTypes/Trip';
import {LoggedUser, User} from '@customTypes/User';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

const getUserById = async (userId: string) => {
  const response = await axiosInstance.get<User>(`/${ServerRoutes.USERS}/${userId}`);

  return response.data;
};

const getUserTrips = async (userId: string) => {
  const response = await axiosInstance.get<TripPreview[]>(`/${ServerRoutes.USERS}/${userId}/${ServerRoutes.TRIPS}`);

  return response.data;
};

const updateUserProfilePicture = async (imageUrl: string) => {
  const response = await axiosInstance.put<LoggedUser>(`/${ServerRoutes.USERS}/profile-picture`, {imageUrl});

  return response.data;
};

export {getUserById, getUserTrips, updateUserProfilePicture};
