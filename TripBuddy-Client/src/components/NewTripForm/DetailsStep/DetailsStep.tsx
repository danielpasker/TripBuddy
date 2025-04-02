import {FC} from 'react';
import {useFormContext} from 'react-hook-form';
import {ArrowBack, FlightTakeoffRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {StyledButton} from '@components/common/StyledButton';
import {TripDetailsForm} from './TripDetailsForm';
import styles from './styles.module.scss';

interface Props {
  isPlanningTrip: boolean;
  onSubmit: () => void;
  onReturn: () => void;
}

const DetailsStep: FC<Props> = ({isPlanningTrip, onSubmit, onReturn}) => {
  const {
    formState: {isValid},
  } = useFormContext();

  return (
    <div className={styles.container}>
      <Typography level="h2">Plan Your New Adventure</Typography>
      <TripDetailsForm />
      <div className={styles.actions}>
        <StyledButton className={styles.returnButton} startDecorator={<ArrowBack />} onClick={onReturn}>
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

export {DetailsStep};
