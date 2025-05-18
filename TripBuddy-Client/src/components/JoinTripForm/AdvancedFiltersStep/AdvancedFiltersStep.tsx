import {FC} from 'react';
import {useFormContext} from 'react-hook-form';
import {ArrowBack, FlightTakeoffRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {StyledButton} from '@components/common/StyledButton';
import {AdvancedFiltersStepForm} from './AdvancedFilterStepForm';
import styles from './styles.module.scss';

interface Props {
  isSearching: boolean;
  onContinue: () => void;
  onReturn: () => void;
}

const AdvancedFiltersStep: FC<Props> = ({isSearching, onContinue, onReturn}) => {
  const {
    formState: {isValid},
  } = useFormContext();

  return (
    <div className={styles.container}>
      <Typography level="h2">Advanced Filters (Optional)</Typography>
      <AdvancedFiltersStepForm />
      <div className={styles.actions}>
        <StyledButton startDecorator={<ArrowBack />} onClick={onReturn}>
          Return
        </StyledButton>
        <StyledButton
          disabled={!isValid}
          onClick={onContinue}
          loading={isSearching}
          startDecorator={<FlightTakeoffRounded />}>
          Find Your Trip
        </StyledButton>
      </div>
    </div>
  );
};

export {AdvancedFiltersStep};
