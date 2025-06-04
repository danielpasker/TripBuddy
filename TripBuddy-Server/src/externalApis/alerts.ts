import axios from 'axios';
import {format} from 'date-fns';

const alertsCient = axios.create({baseURL: 'https://www.gdacs.org/gdacsapi/api/events/'});

const ALERT_DATE_FORMAT = 'yyyy-MM-dd';

type AlertParams = {
  fromDate: string;
  toDate: string;
  alertlevel: string;
  eventlist: string;
  country: string;
};

type EventType = 'DR' | 'EQ' | 'TS' | 'FL' | 'VO' | 'WF' | 'TC';

type AlertApiResponse = {
  features: {
    properties: {
      eventtype: EventType;
      eventid: number;
      eventname: string;
      name: string;
      description: string;
      htmldescription: string;
      icon: string;
      alertlevel: 'Orange' | 'Green' | 'Red';
      alertscore: number;
      country: string;
      fromdate: string;
      todate: string;
      severitydata: {
        severity: number;
        severitytext: string;
        severityunit: string;
      };
    };
  }[];
};

export const searchAlerts = async (params: Partial<AlertParams>) => {
  const formattedParams = {
    ...params,
    fromDate: params.fromDate ? format(params.fromDate, ALERT_DATE_FORMAT) : undefined,
    toDate: params.toDate ? format(params.toDate, ALERT_DATE_FORMAT) : undefined,
  } as AlertParams;

  const res = (
    await alertsCient.get('geteventlist/SEARCH', {
      params: formattedParams,
    })
  ).data as AlertApiResponse;

  return res;
};
