import {FC, useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {useNavigate} from 'react-router-dom';
import {AddActivityPopup} from 'src/components/tripManagement/AddActivityPopup';
import {AddRounded, ArrowBack} from '@mui/icons-material';
import {Skeleton} from '@mui/joy';
import {DayPlanItem} from '@components/NewTripForm/TripPlanStep/DayPlanItem';
import {ContentCard} from '@components/common/ContentCard';
import {StyledButton} from '@components/common/StyledButton';
import {ClientRoutes} from '@enums/clientRoutes';
import {useFetch} from '@hooks/useFetch';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {getTripPlanByTripId} from '@services/tripPlanApi';
import styles from '@styles/tripPlan.module.scss';

const TripPlan: FC = () => {
  const navigate = useNavigate();
  const {tripId} = useParams();
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);

  const {data: initialTripPlan, isFetching: isFetchingPlan} = useFetch(getTripPlanByTripId, tripId?.toString() ?? '');

  const [tripPlan, setTripPlan] = useState(initialTripPlan);
  const showLoading = useLoadingWithDelay(isFetchingPlan, 300);

  useEffect(() => {
    setTripPlan(initialTripPlan);
  }, [initialTripPlan]);

  const handleReturn = useCallback(() => {
    navigate(`${ClientRoutes.TRIPS}/${tripId}`);
  }, [navigate, tripId]);

  const onAddActivityClick = useCallback(() => {
    setIsAddActivityOpen(true);
  }, []);

  const handleCloseAddActivity = useCallback(() => {
    setIsAddActivityOpen(false);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.buttonsContainer}>
        <StyledButton size="lg" startDecorator={<ArrowBack />} onClick={handleReturn}>
          Return to Trip
        </StyledButton>
        <StyledButton size="lg" startDecorator={<AddRounded />} onClick={onAddActivityClick}>
          Add Activity
        </StyledButton>
      </div>
      <div className={styles.tripPlan}>
        {showLoading ? (
          <div className={styles.skeleton}>
            {Array.from({length: 3}).map((_, index) => (
              <ContentCard key={index}>
                <Skeleton variant="text" width="50vw" />
                <Skeleton variant="text" width="50vw" />
                <Skeleton variant="text" width="50vw" />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="80%" />
              </ContentCard>
            ))}
          </div>
        ) : (
          tripPlan?.plan.map(dayPlan => <DayPlanItem key={dayPlan.day} dayPlan={dayPlan} />)
        )}
      </div>
      {tripPlan && tripId && (
        <AddActivityPopup
          open={isAddActivityOpen}
          tripId={tripId}
          tripPlan={tripPlan}
          onClose={handleCloseAddActivity}
          onActivityAdded={setTripPlan}
        />
      )}
    </div>
  );
};

export default TripPlan;
