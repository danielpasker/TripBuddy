import {FC, useCallback} from 'react';
import {useFormContext} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {ArrowBack, FlightTakeoffRounded} from '@mui/icons-material';
import {DayPlanItem} from '@components/NewTripForm/TripPlanStep/DayPlanItem';
import {TripDetailsCard} from '@components/TripDetailsCard';
import {StyledButton} from '@components/common/StyledButton';
import {SaveTripRequest} from '@customTypes/Trip';
import {TripPlan} from '@customTypes/TripPlan';
import {ClientRoutes} from '@enums/clientRoutes';
import {useUserContext} from '@contexts/UserContext';
import {useMutation} from '@hooks/useMutation';
import {saveTrip} from '@services/tripsApi';
import styles from './styles.module.scss';

interface Props {
  tripPlan?: TripPlan;
}

const formatDate = (date: string) => new Date(date).toISOString().split('T')[0];

const TripPlanStep: FC<Props> = ({tripPlan}) => {
  const {user} = useUserContext();
  const {getValues} = useFormContext();
  const navigate = useNavigate();
  const {trigger: saveNewTrip, isLoading: isSavingTrip} = useMutation(saveTrip);

  const handleSave = async () => {
    if (user && tripPlan) {
      const {startDate, endDate} = getValues();

      const tripPlanRequest: SaveTripRequest = {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        users: [user._id],
        plan: tripPlan,
      };

      try {
        await saveNewTrip(tripPlanRequest);
        toast.success('Trip saved successfully!');
        navigate(ClientRoutes.HOME);
      } catch {
        toast.error('Failed to save Trip.');
      }
    }
  };

  const handleReturn = useCallback(() => {
    navigate(ClientRoutes.HOME);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.detailsAndReturn}>
        <TripDetailsCard tripPlan={tripPlan} />
        <div className={styles.actions}>
          <StyledButton className={styles.returnButton} startDecorator={<ArrowBack />} onClick={handleReturn}>
            Return
          </StyledButton>
          <StyledButton
            startDecorator={<FlightTakeoffRounded />}
            className={styles.saveButton}
            onClick={handleSave}
            loading={isSavingTrip}>
            Save Trip
          </StyledButton>
        </div>
      </div>
      <div className={styles.tripPlan}>
        {tripPlan?.plan.map(dayPlan => <DayPlanItem key={dayPlan.day} dayPlan={dayPlan} />)}
      </div>
    </div>
  );
};

export {TripPlanStep};
