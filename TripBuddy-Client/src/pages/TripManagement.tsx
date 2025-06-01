import { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChatBubbleOutlineRounded, FormatListBulletedRounded } from '@mui/icons-material';
import { Grid } from '@mui/joy';
import { TitleWithDivider } from '@components/TitleWithDivider';
import { TripDetailsCard } from '@components/TripDetailsCard';
import { ContentCard } from '@components/common/ContentCard';
import { StyledButton } from '@components/common/StyledButton';
import { JoinRequestsManagement } from '@components/tripManagement/JoinRequestsManagement';
import { TripBuddiesPreview } from '@components/tripManagement/TripBuddiesPreview';
import { TripLoadingLottie } from '@components/tripManagement/TripLoadingLottie';
import { TripPlanPreview } from '@components/tripManagement/TripPlanPreview';
import { Trip } from '@customTypes/Trip';
import { ClientRoutes } from '@enums/clientRoutes';
import { useFetch } from '@hooks/useFetch';
import { useLoadingWithDelay } from '@hooks/useLoadingWithDelay';
import { getTripById } from '@services/tripsApi';
import styles from '@styles/tripManagement.module.scss';

const TripManagement: FC = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();

  const { data: initialTrip, isFetching, error } = useFetch(getTripById, tripId?.toString() ?? '');
  const showLoading = useLoadingWithDelay(isFetching, 1500);
  const [trip, setTrip] = useState<Trip>();

  const onShowFullPlan = useCallback(() => {
    navigate(`${ClientRoutes.TRIPS}/${tripId}/plan`);
  }, [navigate, tripId]);

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
      {/* Left column */}
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

      {/* Middle column */}
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

      {/* Right column - Emergency Alerts */}
      <Grid xs={3} className={styles.gridItem}>
        <ContentCard className={styles.gridCard}>
          <TitleWithDivider title="Emergency Alerts" />
          <div className={styles.alertsList}>
            {[
              'Flood warning near Eiffel Tower',
              'High heat levels expected tomorrow',
              'Transport strike on June 2',
              'Protest scheduled at central square',
              'Airport delays expected in the evening',
            ].map((alert, idx) => (
              <div key={idx} className={styles.alertItem}>
                {alert}
              </div>
            ))}
          </div>
          <StyledButton
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