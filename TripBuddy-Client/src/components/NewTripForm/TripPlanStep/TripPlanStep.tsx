import {FC, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowBack} from '@mui/icons-material';
import {DayPlanItem} from '@components/NewTripForm/TripPlanStep/DayPlanItem';
import {TripDetailsCard} from '@components/TripDetailsCard';
import {StyledButton} from '@components/common/StyledButton';
import {TripPlan} from '@customTypes/TripPlan';
import {ClientRoutes} from '@enums/clientRoutes';
import styles from './styles.module.scss';

interface Props {
  tripPlan?: TripPlan;
}

const TripPlanStep: FC<Props> = ({tripPlan}) => {
  const navigate = useNavigate();

  const handleReturn = useCallback(() => {
    navigate(ClientRoutes.HOME);
  }, [navigate]);

  const handleSave = useCallback(() => {
    if (tripPlan) {
      // Here you can trigger the save API request or other logic to save the trip.
      console.log('Trip Plan saved:', tripPlan);
      // You might want to redirect or show a confirmation message here.
    }
  }, [tripPlan]);

  return (
    <div className={styles.container}>
      <div className={styles.detailsAndReturn}>
        <TripDetailsCard tripPlan={tripPlan} />
        <StyledButton className={styles.returnButton} startDecorator={<ArrowBack />} onClick={handleReturn}>
          Return
        </StyledButton>
      </div>
      <div className={styles.tripPlan}>
        {tripPlan?.plan.map(dayPlan => <DayPlanItem key={dayPlan.day} dayPlan={dayPlan} />)}

        <div className={styles.saveButtonContainer}>
          <StyledButton className={styles.saveButton} onClick={handleSave}>
            Save Trip
          </StyledButton>
        </div>
      </div>
    </div>
  );
};

export {TripPlanStep};
