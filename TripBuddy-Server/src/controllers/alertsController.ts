import {searchAlerts} from '@externalApis/alerts';
import {sendError} from '@utils/sendError';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

const ALERT_LEVEL = 'Red;Orange;Green';
const EVENT_LIST = 'EQ,TS,TC,FL,VO,DR,WF';

export const getAlerts = async (request: Request, response: Response) => {
  const query = request.query;
  try {
    const alerts = await searchAlerts({
      ...query,
      alertlevel: ALERT_LEVEL,
      eventlist: EVENT_LIST,
    });
    response.send(alerts.features?.map(f => f.properties));
  } catch (error) {
    sendError(response, StatusCodes.BAD_GATEWAY, 'Failed fetching alerts', error);
  }
};
