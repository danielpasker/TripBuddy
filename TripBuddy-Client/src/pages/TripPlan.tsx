import {FC, useCallback} from 'react';
import {useParams} from 'react-router';
import {useNavigate} from 'react-router-dom';
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

  const {data: tripPlan, isFetching: isFetchingPlan} = useFetch(getTripPlanByTripId, tripId?.toString() ?? '');
  const showLoading = useLoadingWithDelay(isFetchingPlan, 300);

  const handleReturn = useCallback(() => {
    navigate(`${ClientRoutes.TRIPS}/${tripId}`);
  }, [navigate, tripId]);

  return (
    <div className={styles.container}>
      <div className={styles.buttonsContainer}>
        <StyledButton startDecorator={<ArrowBack />} onClick={handleReturn}>
          Return
        </StyledButton>
        <StyledButton startDecorator={<AddRounded />}>Add Activity</StyledButton>
      </div>
      <div className={styles.tripPlan}>
        {showLoading ? (
          <div className={styles.skeleton}>
            {Array.from({length: 3}).map((_, index) => (
              <ContentCard key={index}>
                <Skeleton variant="text" width="50vw" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="90%" />
              </ContentCard>
            ))}
          </div>
        ) : (
          tripPlan?.plan.map(dayPlan => <DayPlanItem key={dayPlan.day} dayPlan={dayPlan} />)
        )}
      </div>
    </div>
  );
};

export default TripPlan;
