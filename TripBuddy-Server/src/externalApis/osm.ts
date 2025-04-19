import { Destination } from '@customTypes/destination';
import axios from 'axios';
import axiosRateLimit from 'axios-rate-limit';

export type OsmResult = {
  lat: number;
  lon: number;
  display_name: string;
  type: string; // city | town | village | state | …
  place_id: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    country_code?: string; 
    [k: string]: any;
  };
};

const OPENSTREETMAP_API_URL = 'https://nominatim.openstreetmap.org';
const http = axiosRateLimit(axios.create({baseURL: OPENSTREETMAP_API_URL}), {maxRequests: 4, perMilliseconds: 1000});

export const searchLocation = async (query: string) => {
  const response = await http.get<OsmResult[]>('/search', {params: {q: query, format: 'json'}});

  return response.data;
};


export const searchDestinations = async (
  query: string,
): Promise<Destination[]> => {
  const results = await searchLocationWithDetails(query);

  const unique = new Map<string, Destination>();

  results.forEach((r) => {
    const a = r.address ?? {};
    const country = a.country ?? '';
    const state   = a.state   ?? ''; 
    let   city    = a.city || a.town || a.village || '';

    if (!city && a.state && a.country_code === 'us') city = a.state;

    if (!city || !country) return;
    if (!city.toLowerCase().startsWith(query.toLowerCase())) return;

    const key = `${city.trim().toLowerCase()}|${state.trim().toLowerCase()}|${country.trim().toLowerCase()}`;
    if (unique.has(key)) return;

    unique.set(key, { country, city, state: state || undefined });
  });

  return [...unique.values()];
};
    
const searchLocationWithDetails = async (query: string): Promise<OsmResult[]> =>
  (
    await http.get<OsmResult[]>('/search', {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        'accept-language': 'en', // force English names :contentReference[oaicite:2]{index=2}
        limit: 20,
      },
    })
  ).data;
   
