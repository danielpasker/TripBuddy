type EventType = 'DR' | 'EQ' | 'TS' | 'FL' | 'VO' | 'WF' | 'TC';
type AlertLevel = 'Orange' | 'Green' | 'Red';

interface Alert {
  eventId: number;
  level: AlertLevel;
  iconUrl: string;
  type: EventType;
  description: string;
  startDate: string;
  endDate: string;
  url: string;
}

export type {Alert, EventType, AlertLevel};
