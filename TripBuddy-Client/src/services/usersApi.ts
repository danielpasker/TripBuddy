import {User} from '@customTypes/User';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

const getUserById = async (userId: string) => {
  const response = await axiosInstance.get<User>(`/${ServerRoutes.USERS}/${userId}`);

  return response.data;
};

export {getUserById};
