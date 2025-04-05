import { Request, Response } from 'express';
import NodeCache from 'node-cache';
import { Destination } from '@customTypes/destination';
import { StatusCodes } from 'http-status-codes';
import { searchDestinations } from '@externalApis/googleMaps';
import { sendError } from '@utils/sendError';

// Cache for 24 hours (86400 seconds)
const cache = new NodeCache({ stdTTL: 86400 });

export const getDestinations = async (request: Request, response: Response) => {
  const query = request.query.query as string;
  if (!query) {
    response.status(StatusCodes.BAD_REQUEST).send('Query parameter is required');
    return;
  }

  const cacheKey = `destinations:${query}`;
  const cachedData = cache.get<Destination[]>(cacheKey);
  if (cachedData) {
    console.log('Returning cached data');
    response.json(cachedData);
    return;
  }

  try {
    //TODO: check if can use osm instead (look at src/externalApis/osm.ts)
    const results = await searchDestinations(query)

    const destinations: Destination[] = results
      .map((place) => {
        const formattedAddress = place.formatted_address || '';
        const parts = formattedAddress.split(',');
        const city = parts[0] ? parts[0].trim() : '';
        const country = parts.length > 1 ? parts[parts.length - 1].trim() : '';

        if (!country || !city) return;

        return {
          country,
          city,
        };
      })
      .filter((destination) => !!destination);

    cache.set(cacheKey, destinations);
    console.log('Storing data in cache');
    response.json(destinations);
  } catch (error) {
    sendError(
      response,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed fetching destinations',
      JSON.stringify(error)
    );
  }
};
