export type AlertParams = {
    fromDate: string
    toDate: string
    country: string
}

type EventType = 'DR' | 'EQ' | 'TS' | 'FL' | 'VO' | 'WF' | 'TC';

export type Alert = {
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
    url: {
        report: string
    }
}