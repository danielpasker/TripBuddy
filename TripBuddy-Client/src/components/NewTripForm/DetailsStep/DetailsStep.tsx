import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  ArrowBack, 
  FlightTakeoffRounded, 
  PeopleOutlineRounded, 
  CalendarMonthOutlined, 
  AttachMoneyRounded,
  TravelExploreOutlined
} from '@mui/icons-material';
import { StyledButton } from '@components/common/StyledButton';
import { FormInput } from '@components/common/input/FormInput';
import { FormDatePicker } from '@components/common/input/FormDatePicker';
import { FormValueSelect } from '@components/common/input/FormValueSelect';
import styles from './styles.module.scss';
import { tripTypes } from './tripTypes';
import { TripDetailsForm } from './TripDetailsForm';

interface Props {
  isPlanningTrip: boolean;
  onSubmit: () => void;
  onReturn: () => void;
}


const DetailsStep: FC<Props> = ({ isPlanningTrip, onSubmit, onReturn }) => {
  const {
    formState: { isValid },
  } = useFormContext();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Plan Your New Adventure</h1>
      
      <TripDetailsForm />

      <div className={styles.actions}>
        <StyledButton
          className={styles.returnButton}
          startDecorator={<ArrowBack />}
          onClick={onReturn}>
          Return
        </StyledButton>
        <StyledButton
          onClick={onSubmit}
          disabled={!isValid}
          startDecorator={<FlightTakeoffRounded />}
          loading={isPlanningTrip}>
          Let's Travel
        </StyledButton>
      </div>
    </div>
  );
};


export { DetailsStep };
