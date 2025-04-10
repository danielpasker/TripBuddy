import {Env} from '@env';
import axios from 'axios';

export type DestinationResult = {
  results: {formatted_address: string}[];
};

export const searchDestinations = async (query: string) => {
  const response = await axios.get<DestinationResult>(
    `${Env.GOOGLE_API_BASE_URL}?query=${encodeURIComponent(query)}&types=locality&key=${Env.GOOGLE_API_KEY}`
  );

  return response.data.results;
};
