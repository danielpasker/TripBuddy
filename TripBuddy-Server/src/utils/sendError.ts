import {Response} from 'express';
import {StatusCodes} from 'http-status-codes';

/**
 *
 * @param response the response from the controller
 * @param statusCode http status code
 * @param errorMessage a message to return in the response body
 * @param logMessage a message to print in the console (like error details), data that is not supposed to reach the client
 */
export const sendError = (response: Response, statusCode: StatusCodes, errorMessage?: string, logMessage?: unknown) => {
  if (errorMessage && logMessage) {
    console.error(`${errorMessage}: ${logMessage}`);
  } else {
    console.error(logMessage ?? errorMessage ?? 'An error occured');
  }

  response.status(statusCode).send(errorMessage ?? 'An error occured');
};
