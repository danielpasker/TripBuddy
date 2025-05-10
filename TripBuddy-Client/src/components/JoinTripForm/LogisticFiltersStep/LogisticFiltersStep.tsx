import {FC} from 'react';
import {useFormContext} from 'react-hook-form';
import {ArrowBack, FlightTakeoffRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {StyledButton} from '@components/common/StyledButton';
import {LogisticFiltersStepForm} from './LogisticFiltersStepForm';
import styles from './styles.module.scss';

interface LogisticFiltersStepProps {
  isSearching: boolean;
  onSubmit: () => void;
  onReturn: () => void;
}

const LogisticFiltersStep: FC<LogisticFiltersStepProps> = ({isSearching, onSubmit, onReturn}) => {
  const {
    formState: {isValid},
  } = useFormContext();

  return (
    <div className={styles.container}>
      <Typography level="h2">Choose Logistic Filters</Typography>
      <LogisticFiltersStepForm />
      <div className={styles.actions}>
        <StyledButton className={styles.returnButton} startDecorator={<ArrowBack />} onClick={onReturn}>
          Return
        </StyledButton>
        <StyledButton
          onClick={onSubmit}
          disabled={!isValid}
          startDecorator={<FlightTakeoffRounded />}
          loading={isSearching}>
          Continue Filtering
        </StyledButton>
      </div>
    </div>
  );
};

export {LogisticFiltersStep};
