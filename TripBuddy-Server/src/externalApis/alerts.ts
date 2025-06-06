import axios from 'axios';
import {format} from 'date-fns';

const alertsCient = axios.create({baseURL: 'https://www.gdacs.org/gdacsapi/api/events/'});

const ALERT_DATE_FORMAT = 'yyyy-MM-dd';
const ALERT_LEVEL = 'Red;Orange;Green';
const EVENT_LIST = 'EQ,TS,TC,FL,VO,DR,WF';

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

export const searchAlerts = async (country: string, startDate: Date, endDate: Date) => {
  const params = {
    country,
    fromDate: startDate ? format(startDate, ALERT_DATE_FORMAT) : undefined,
    toDate: endDate ? format(endDate, ALERT_DATE_FORMAT) : undefined,
    alertlevel: ALERT_LEVEL,
    eventlist: EVENT_LIST,
  } as AlertParams;

  const alerts = await alertsCient.get('geteventlist/SEARCH', {params});

  return alerts.data ? (alerts.data as AlertApiResponse) : null;
};
