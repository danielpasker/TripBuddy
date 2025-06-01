import axios from 'axios';

const alertsCient = axios.create({baseURL: 'https://www.gdacs.org/gdacsapi/api/events/'});

type AlertParams = {
  fromDate: Date;
  toDate: Date;
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
  return (
    await alertsCient.get('geteventlist/SEARCH', {
      params: params as AlertParams,
    })
  ).data as AlertApiResponse;
};
