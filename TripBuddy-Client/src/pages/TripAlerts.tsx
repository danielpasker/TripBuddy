import {FC} from 'react';
import {useParams} from 'react-router';
import {Stack} from '@mui/joy';
import {AlertItem} from '@components/AlertItem';
import {useFetch} from '@hooks/useFetch';
import {getAlerts} from '@services/alertsApi';

const TripAlerts: FC = () => {
  const {country} = useParams();
  const {data: alerts = []} = useFetch(getAlerts, country ?? '');

  return alerts.map(a => (
    <Stack alignItems={'center'} marginBottom={5}>
      <AlertItem alert={a} />
    </Stack>
  ));
};

export {TripAlerts};
