import {AlertLevel} from '@customTypes/Alert';

const mapAlertLevelToColor = (level: AlertLevel) => {
  switch (level) {
    case 'Green':
      return 'success';
    case 'Orange':
      return 'warning';
    case 'Red':
      return 'danger';
    default:
      return undefined;
  }
};

export {mapAlertLevelToColor};
