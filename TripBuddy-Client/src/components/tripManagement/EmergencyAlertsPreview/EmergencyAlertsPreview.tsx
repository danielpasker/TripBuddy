import {FC, memo} from 'react';
import {Stack, Typography} from '@mui/joy';
import {useFetch} from '@hooks/useFetch';
import {getAlerts} from '@services/alertsApi';
import {formatDate} from '@utils/dateUtils';
import styles from './styles.module.scss';

type Props = {
  country: string;
};

const EmergencyAlertsPreview: FC<Props> = ({country}) => {
  const {data: alerts = []} = useFetch(getAlerts, country);

  return  (
    <>
      <Typography>{alerts.length}</Typography>
      {alerts.slice(0, 4).map(a => (
        <Stack key={a.eventid} direction={'column'}>
          <Stack direction={'row'} className={styles.alertRow} gap={3}>
            <img src={a.icon} width={40} />
            <Typography>{a.name}</Typography>
          </Stack>
          <Typography>
            {formatDate(a.fromdate)}-{formatDate(a.todate)}
          </Typography>
        </Stack>
      ))}
    </>
  ) 
};

export {EmergencyAlertsPreview};
