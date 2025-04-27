import {FC, useCallback} from 'react';
import {useFormContext} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {ArrowBack} from '@mui/icons-material';
import {DayPlanItem} from '@components/NewTripForm/TripPlanStep/DayPlanItem';
import {TripDetailsCard} from '@components/TripDetailsCard';
import {StyledButton} from '@components/common/StyledButton';
import {TripPlan} from '@customTypes/TripPlan';
import {ClientRoutes} from '@enums/clientRoutes';
import {useUserContext} from '@contexts/UserContext';
import {useMutation} from '@hooks/useMutation';
import {saveTrip} from '@services/tripApi';
import styles from './styles.module.scss';

interface Props {
  tripPlan?: TripPlan;
}

const TripPlanStep: FC<Props> = ({tripPlan}) => {
  const {user} = useUserContext();
  const {getValues} = useFormContext();
  const navigate = useNavigate();

  const saveTripMutation = useMutation(async () => {
    const {startDate, endDate} = getValues();

    if (!user || !startDate || !endDate || !tripPlan) {
      throw new Error('Missing required data!');
    }

    const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
    const users = [user];

    return saveTrip(formattedStartDate, formattedEndDate, users, tripPlan);
  });

  const handleReturn = useCallback(() => {
    navigate(ClientRoutes.HOME);
  }, [navigate]);

  const handleSave = useCallback(async () => {
    try {
      await saveTripMutation.trigger();
      toast.success('Trip Plan saved successfully!');
      navigate(ClientRoutes.HOME);
    } catch {
      toast.error('Failed to save Trip Plan.');
    }
  }, [saveTripMutation, navigate]);

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
            {saveTripMutation.isLoading ? 'Saving...' : 'Save Trip'}
          </StyledButton>
        </div>
      </div>
    </div>
  );
};

export {TripPlanStep};
