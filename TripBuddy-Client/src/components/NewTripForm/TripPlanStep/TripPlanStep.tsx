import {FC, useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useFormContext} from 'react-hook-form';
import {ArrowBack} from '@mui/icons-material';

import {DayPlanItem} from '@components/NewTripForm/TripPlanStep/DayPlanItem';
import {TripDetailsCard} from '@components/TripDetailsCard';
import {StyledButton} from '@components/common/StyledButton';
import {TripPlan} from '@customTypes/TripPlan';
import {ClientRoutes} from '@enums/clientRoutes';
import {useUserContext} from '@contexts/UserContext';
import {saveTrip} from '@services/tripApi';

import styles from './styles.module.scss';

interface Props {
  tripPlan?: TripPlan;
}

const TripPlanStep: FC<Props> = ({tripPlan}) => {
  const {user} = useUserContext();
  const {getValues} = useFormContext();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleReturn = useCallback(() => {
    navigate(ClientRoutes.HOME);
  }, [navigate]);

  const handleSave = useCallback(async () => {
    const {startDate, endDate} = getValues();
    if (!user || !startDate || !endDate || !tripPlan) {
      alert('Missing required data!');
      return;
    }

    const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
    const users = [user];

    setIsSaving(true);
    try {
      const response = await saveTrip(formattedStartDate, formattedEndDate, users, tripPlan);
      if (response) {
        alert('Trip Plan saved successfully!');
      }
    } catch (error) {
      console.error('Error saving Trip Plan:', error);
      alert('Failed to save Trip Plan.');
    } finally {
      setIsSaving(false);
    }
  }, [user, getValues, tripPlan]);

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
          <StyledButton className={styles.saveButton} onClick={handleSave} disabled={isSaving}>
            Save Trip
          </StyledButton>
        </div>
      </div>
    </div>
  );
};

export {TripPlanStep};
