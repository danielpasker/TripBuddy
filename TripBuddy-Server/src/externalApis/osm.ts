import {Destination} from '@customTypes/destination';
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
  };
};

const OPENSTREETMAP_API_URL = 'https://nominatim.openstreetmap.org';
const http = axiosRateLimit(axios.create({baseURL: OPENSTREETMAP_API_URL}), {maxRequests: 4, perMilliseconds: 1000});

export const searchLocation = async (query: string) => {
  const response = await http.get<OsmResult[]>('/search', {params: {q: query, format: 'json'}});

  return response.data;
};

export const searchDestinations = async (query: string): Promise<Destination[]> => {
  const results = await searchLocationWithDetails(query);

  const unique = new Map<string, Destination>();

  results.forEach(r => {
    const address = r.address ?? {};
    const state = address.state ?? '';
    let country = address.country ?? '';
    let city = address.city || address.town || address.village || '';

    if (!city && address.state && address.country_code === 'us') city = address.state;

    if (!city || !country) return;
    if (!city.toLowerCase().startsWith(query.toLowerCase())) return;

    const key = `${city.trim()}|${state.trim()}|${country.trim()}`.toLowerCase();

    if (country.includes('Palestinian')) {
      country = 'Israel';
    }
    if (unique.has(key)) return;

    unique.set(key, {country, city, state: state || undefined});
  });

  return [...unique.values()];
};

export const searchLocationWithDetails = async (query: string): Promise<OsmResult[]> =>
  (
    await http.get<OsmResult[]>('/search', {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        featureType: 'city',
        'accept-language': 'en', // force English names :contentReference[oaicite:2]{index=2}
        limit: 20,
      },
    })
  ).data;
