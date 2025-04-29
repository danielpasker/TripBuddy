import { Request, Response } from 'express';
import NodeCache from 'node-cache';
import { StatusCodes } from 'http-status-codes';
import { searchDestinations } from '@externalApis/osm';
import { sendError } from '@utils/sendError';
import { Destination } from '@customTypes/destination';

// Cache for 24 hours 
const cache = new NodeCache({ stdTTL: 86_400 });


export const getDestinations = async (req: Request, res: Response) => {
  const query = (req.query.query as string)?.trim();
  if (!query) {
    sendError(res, StatusCodes.BAD_REQUEST, 'Query parameter is required', 'Query parameter is required');
    return;
  }

  const cacheKey = `destinations:${query.toLowerCase()}`;
  const cached = cache.get<Destination[]>(cacheKey);
  if (cached) {
    console.log('Returning cached destinations');
    res.json(cached);
    return;
  }

  try {
    const destinations = await searchDestinations(query);

    cache.set(cacheKey, destinations);
    console.log('Destinations cached');
    res.json(destinations);
  } catch (err) {
    sendError(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed fetching destinations',
      JSON.stringify(err),
    );
  }
};
