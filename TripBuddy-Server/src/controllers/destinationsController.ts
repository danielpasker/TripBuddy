import { Request, Response } from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';
import { Destination } from '@customTypes/destination';

// Cache for 24 hours (86400 seconds)
const cache = new NodeCache({ stdTTL: 86400 });

export const getDestinations = async (req: Request, res: Response): Promise<void> => {
    const query = req.query.query as string;
    if (!query) {
        res.status(400).send('Query parameter is required');
        return;
    }

    const cacheKey = `destinations:${query}`;
    const cachedData = cache.get<Destination[]>(cacheKey);
    if (cachedData) {
        console.log('Returning cached data');
        res.json(cachedData);
        return;
    }

    const GOOGLE_API_BASE_URL = process.env.GOOGLE_API_BASE_URL;
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    if (!GOOGLE_API_KEY || !GOOGLE_API_BASE_URL) {
        res.status(500).send('Missing GOOGLE_API_KEY or GOOGLE_API_BASE_URL in environment variables');
        return;
    }

    try {
        const response = await axios.get(`${GOOGLE_API_BASE_URL}?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`);

        // mapping the response to get the city and country
        const destinations: Destination[] = response.data.results.map((place: any) => {
            const formattedAddress = place.formatted_address || "";
            const parts = formattedAddress.split(",");
            const city = parts[0] ? parts[0].trim() : "";
            const country = parts.length > 1 ? parts[parts.length - 1].trim() : "";
            return {
                place_id: place.place_id,
                country,
                city,
            };
        });

        cache.set(cacheKey, destinations);
        console.log('Storing data in cache');
        res.json(destinations);
    } catch (error) {
        console.error('Error fetching destinations', error);
        res.status(500).json({ error: 'Error fetching destinations' });
    }
};
