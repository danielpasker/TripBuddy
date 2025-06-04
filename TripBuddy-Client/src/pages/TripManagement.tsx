import {FC, useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {ChatBubbleOutlineRounded, FormatListBulletedRounded} from '@mui/icons-material';
import {Grid} from '@mui/joy';
import {TitleWithDivider} from '@components/TitleWithDivider';
import {TripDetailsCard} from '@components/TripDetailsCard';
import {ContentCard} from '@components/common/ContentCard';
import {StyledButton} from '@components/common/StyledButton';
import {EmergencyAlertsPreview} from '@components/tripManagement/EmergencyAlertsPreview';
import {JoinRequestsManagement} from '@components/tripManagement/JoinRequestsManagement';
import {TripBuddiesPreview} from '@components/tripManagement/TripBuddiesPreview';
import {TripLoadingLottie} from '@components/tripManagement/TripLoadingLottie';
import {TripPlanPreview} from '@components/tripManagement/TripPlanPreview';
import {Trip} from '@customTypes/Trip';
import {ClientRoutes} from '@enums/clientRoutes';
import {useBackgroundImageFromSearch} from '@hooks/useBackgroundImageFromSearch';
import {useFetch} from '@hooks/useFetch';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {getTripById} from '@services/tripsApi';
import styles from '@styles/tripManagement.module.scss';

const TripManagement: FC = () => {
  const navigate = useNavigate();
  const {tripId} = useParams();

  const {data: initialTrip, isFetching, error} = useFetch(getTripById, tripId?.toString() ?? '');
  const showLoading = useLoadingWithDelay(isFetching, 1500);
  const [trip, setTrip] = useState<Trip>();
  useBackgroundImageFromSearch(`${trip?.plan.location} landscape`, showLoading);

  const onShowFullPlan = useCallback(() => {
    navigate(`${ClientRoutes.TRIPS}/${tripId}/plan`);
  }, [navigate, tripId]);

  const onShowAllAlerts = useCallback(() => {
    navigate(`${ClientRoutes.ALERTS}/${trip?.country}`);
  }, [navigate, trip]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load trip details');
    }
  }, [error]);

  useEffect(() => {
    if (initialTrip) {
      setTrip(initialTrip);
    }
  }, [initialTrip]);

  return showLoading || !trip ? (
    <TripLoadingLottie />
  ) : (
    <Grid container spacing="16px">
      <Grid xs={3} className={styles.gridItem}>
        <TripDetailsCard tripPlan={trip.plan} />
        <ContentCard className={styles.buddiesGridCard}>
          <TitleWithDivider title="My Trip Buddies" />
          <TripBuddiesPreview tripBuddies={trip.users} />
          <div className={styles.buddiesActions}>
            <JoinRequestsManagement trip={trip} setTrip={setTrip} />
            <StyledButton className={styles.button} startDecorator={<ChatBubbleOutlineRounded />}>
              Chat With Buddies
            </StyledButton>
          </div>
        </ContentCard>
      </Grid>
      <Grid xs={6} className={styles.gridItem}>
        <ContentCard className={styles.gridCard}>
          <TitleWithDivider title="What Am I Doing" />
          <TripPlanPreview tripPlan={trip.plan} />
          <StyledButton
            className={styles.button}
            onClick={onShowFullPlan}
            startDecorator={<FormatListBulletedRounded />}>
            View Full Plan
          </StyledButton>
        </ContentCard>
      </Grid>
      <Grid xs={3} className={styles.gridItem}>
        <ContentCard className={styles.gridCard}>
          <TitleWithDivider title="Emergency Alerts" />
          <EmergencyAlertsPreview country={trip.country} />
          <StyledButton
            onClick={onShowAllAlerts}
            color="danger"
            className={styles.button}
            startDecorator={<FormatListBulletedRounded />}>
            View All Alerts
          </StyledButton>
        </ContentCard>
      </Grid>
    </Grid>
  );
};

export default TripManagement;
