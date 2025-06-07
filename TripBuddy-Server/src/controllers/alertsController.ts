import {searchAlerts} from '@externalApis/alerts';
import {sendError} from '@utils/sendError';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import tripModel from '@models/tripModel';
import {getCountryNameFromCountryCode} from '@utils/countryUtils';

const getTripAlerts = async (request: Request, response: Response) => {
  const trip = await tripModel.findById(request.params.tripId);

  if (!trip) {
    return sendError(response, StatusCodes.NOT_FOUND, 'Trip was not found');
  }

  const country = getCountryNameFromCountryCode(trip.plan.countryCode);

  try {
    const alerts = await searchAlerts(country, trip.startDate, trip.endDate);

    if (!alerts) {
      response.send([]);
      return;
    }

    response.send(
      alerts.features?.map(f => ({
        eventId: f.properties.eventid,
        level: f.properties.alertlevel,
        iconUrl: f.properties.icon,
        type: f.properties.eventtype,
        description: f.properties.description,
        startDate: f.properties.fromdate,
        endDate: f.properties.todate,
        url: f.properties.url.report,
      }))
    );
  } catch (error) {
    sendError(response, StatusCodes.BAD_GATEWAY, 'Failed fetching alerts', error);
  }
};

export {getTripAlerts};
