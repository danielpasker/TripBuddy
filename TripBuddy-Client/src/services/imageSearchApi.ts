import {Photo} from 'pexels';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

const searchImages = async (query: string) => {
  const response = await axiosInstance.get<Photo[]>(`/${ServerRoutes.IMAGE_SEARCH}/${query}`);

  return response.data;
};

export {searchImages};
