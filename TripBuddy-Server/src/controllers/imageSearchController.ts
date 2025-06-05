import {Request, Response} from 'express';
import NodeCache from 'node-cache';
import {StatusCodes} from 'http-status-codes';
import {searchImages} from '@externalApis/pexels';
import {sendError} from '@utils/sendError';

// Cache for 24 hours
const cache = new NodeCache({stdTTL: 86_400});

export const searchImagesByQuery = async (request: Request, response: Response) => {
  const {query} = request.params;

  if (!query) {
    sendError(response, StatusCodes.BAD_REQUEST, 'Query parameter is required');
    return;
  }

  const cacheKey = `search_${query}`;
  const cachedResults = cache.get(cacheKey);

  if (cachedResults) {
    response.send(cachedResults);
    return;
  }

  try {
    const images = await searchImages(query as string);

    cache.set(cacheKey, images);
    response.send(images);
  } catch (error) {
    sendError(response, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch images', JSON.stringify(error));
  }
};
