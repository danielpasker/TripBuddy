import {FC, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowBack} from '@mui/icons-material';
import {DayPlanItem} from '@components/NewTripForm/TripPlanStep/DayPlanItem';
import {TripDetailsCard} from '@components/TripDetailsCard';
import {StyledButton} from '@components/common/StyledButton';
import {TripPlan} from '@customTypes/TripPlan';
import {ClientRoutes} from '@enums/clientRoutes';
import {saveTripPlan} from '@services/tripPlanApi';
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
      const startDate = new Date().toISOString().split('T')[0]; // Current date
      const endDate = new Date(new Date().setDate(new Date().getDate() + tripPlan.days - 1))
        .toISOString()
        .split('T')[0]; // End date

      const userId = [
        {
          _id: '67d8144ff9a4c85c8621e2a8',
          userName: 'gaya.vishna',
          // eslint-disable-next-line prettier/prettier
          profileImageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocIPylij9ordMUaQN1gLK4pd1ikJQjZ0hQz6pSAHV-Rx_bsLhZKu5Q=s96-c',
        },
      ];

      // Log the data you're sending to verify it is correctly structured
      console.log('Trip data to save:', {
        startDate,
        endDate,
        users: userId,
        plan: tripPlan, // Check if this is correctly structured as an array of DayPlans
      });
      // eslint-disable-next-line prettier/prettier
  // eslint-disable-next-line prettier/prettier
  
      // Call the saveTripPlan API
      saveTripPlan(startDate, endDate, userId, tripPlan)
        .then(() => {
          console.log('Trip Plan saved successfully:', tripPlan);
          alert('Trip Plan saved successfully!');
        })
        .catch(error => {
          console.error('Error saving Trip Plan:', error);
          alert('Failed to save Trip Plan.');
        });
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
