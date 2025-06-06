import {FC, useCallback} from 'react';
import {useParams} from 'react-router';
import {useNavigate} from 'react-router-dom';
import {ArrowBack} from '@mui/icons-material';
import {Grid, Skeleton} from '@mui/joy';
import {AlertItem} from '@components/AlertItem';
import {ContentCard} from '@components/common/ContentCard';
import {StyledButton} from '@components/common/StyledButton';
import {ClientRoutes} from '@enums/clientRoutes';
import {useFetch} from '@hooks/useFetch';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {getTripAlerts} from '@services/alertsApi';
import styles from '@styles/tripAlerts.module.scss';

const TripAlerts: FC = () => {
  const navigate = useNavigate();
  const {tripId} = useParams();
  const {data: alerts = [], isFetching} = useFetch(getTripAlerts, tripId ?? '');
  const showLoading = useLoadingWithDelay(isFetching);

  const handleReturn = useCallback(() => {
    navigate(`${ClientRoutes.TRIPS}/${tripId}`);
  }, [navigate, tripId]);

  return (
    <div className={styles.container}>
      <StyledButton size="lg" className={styles.return} startDecorator={<ArrowBack />} onClick={handleReturn}>
        Return to Trip
      </StyledButton>
      <Grid container spacing="16px" direction="row" className={styles.alerts}>
        {showLoading
          ? Array.from({length: 3}).map((_, index) => (
              <Grid xs={6}>
                <ContentCard key={index} className={styles.skeleton}>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="80%" />
                </ContentCard>
              </Grid>
            ))
          : alerts.map(alert => (
              <Grid xs={6} key={alert.eventid}>
                <AlertItem alert={alert} />
              </Grid>
            ))}
      </Grid>
    </div>
  );
};

export {TripAlerts};
