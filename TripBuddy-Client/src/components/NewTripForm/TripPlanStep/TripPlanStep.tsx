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
      </div>
    </div>
  );
};

export {TripPlanStep};
