import axios from 'axios';
import axiosRateLimit from 'axios-rate-limit';

export type OsmResult = {
  lat: number;
  lon: number;
  name: string;
  display_name: string;
  type: string;
  place_id: number;
};

const OPENSTREETMAP_API_URL = 'https://nominatim.openstreetmap.org';
const http = axiosRateLimit(axios.create({baseURL: OPENSTREETMAP_API_URL}), {maxRequests: 4, perMilliseconds: 1000});

export const searchLocation = async (query: string) => {
  const response = await http.get<OsmResult[]>('/search', {params: {q: query, format: 'json'}});

  return response.data;
};
