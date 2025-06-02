import {FC} from 'react';
import {Stack, Typography} from '@mui/joy';
import {useFetch} from '@hooks/useFetch';
import {getAlerts} from '@services/alertsApi';
import {alertTypes} from '@utils/consts';
import styles from './styles.module.scss';

type Props = {
  country: string;
};

const EmergencyAlertsPreview: FC<Props> = ({country}) => {
  const {data: alerts = []} = useFetch(getAlerts, country);

  return (
    <>
      {alerts.slice(0, 4).map(a => (
        <Stack key={a.eventid} direction={'column'}>
          <Stack direction={'row'} className={styles.alertRow} gap={3}>
            <img src={a.icon} width={40} />
            <Typography>{alertTypes[a.eventtype]}</Typography>
          </Stack>
        </Stack>
      ))}
    </>
  );
};

export {EmergencyAlertsPreview};
