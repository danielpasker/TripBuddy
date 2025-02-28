import {format} from 'date-fns';

const parseExpirationInDays = (expiration: string) => {
  const match = expiration.match(/(\d+)([smhd])/);
  if (!match) return 0;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'm':
      return value / 1440; // minutes to days
    case 'h':
      return value / 24; // hours to days
    case 'd':
      return value; // days
    default:
      return 0;
  }
};

const DEFAULT_DATE_FORMAT = 'dd.MM.yyyy';
const LONG_DISPLAY_DATE_FORMAT = 'MMMM dd, yyyy. HH:mm';

const formatDate = (dateString?: string, newFormat: string = DEFAULT_DATE_FORMAT) =>
  dateString ? format(dateString, newFormat) : '';

export {parseExpirationInDays, formatDate, LONG_DISPLAY_DATE_FORMAT};
