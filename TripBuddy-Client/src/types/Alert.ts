export type EventType = 'DR' | 'EQ' | 'TS' | 'FL' | 'VO' | 'WF' | 'TC';
export type AlertLevel = 'Orange' | 'Green' | 'Red';

export type Alert = {
  eventtype: EventType;
  eventid: number;
  eventname: string;
  name: string;
  description: string;
  htmldescription: string;
  icon: string;
  alertlevel: AlertLevel;
  alertscore: number;
  country: string;
  fromdate: string;
  todate: string;
  severitydata: {
    severity: number;
    severitytext: string;
    severityunit: string;
  };
  url: {
    report: string;
  };
};
