import {FC} from 'react';
import {useFormContext} from 'react-hook-form';
import {ArrowBack, FlightTakeoffRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {StyledButton} from '@components/common/StyledButton';
import {MatchFilterStepForm} from './MatchFiltersStepForm';
import styles from './styles.module.scss';

interface MatchFiltersStepProps {
  isPlanningTrip: boolean;
  onSubmit: () => void;
  onReturn: () => void;
}

const MatchFiltersStep: FC<MatchFiltersStepProps> = ({isPlanningTrip, onSubmit, onReturn}) => {
  const {
    formState: {isValid},
  } = useFormContext();
  return (
    <div className={styles.container}>
      <Typography level="h2">Choose Logistic Filters</Typography>
      <MatchFilterStepForm />
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
export {MatchFiltersStep};
