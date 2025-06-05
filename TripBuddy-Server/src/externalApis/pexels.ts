import {createClient, Photo} from 'pexels';
import {Env} from '@env';

const pexelsClient = createClient(Env.PEXELS_API_KEY);

export const searchImages = async (query: string, perPage: number = 10): Promise<Photo[]> => {
  try {
    const response = await pexelsClient.photos.search({
      query,
      per_page: perPage,
      orientation: 'landscape',
      size: 'large',
    });

    if ('error' in response) {
      throw new Error(response.error);
    }

    return response.photos;
  } catch (error) {
    console.error('Error searching Pexels images:', error);
    throw new Error('Failed to fetch images from Pexels');
  }
};
