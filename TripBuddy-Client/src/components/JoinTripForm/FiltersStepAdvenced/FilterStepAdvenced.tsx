import {FC} from 'react';
import {useFormContext} from 'react-hook-form';
import {ArrowBack, FlightTakeoffRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {StyledButton} from '@components/common/StyledButton';
import {AdvancedFiltersStepForm} from './FilterStepAdvencedForm';
import styles from './styles.module.scss';

interface Props {
  isSearching: boolean;
  onContinue: () => void;
  onReturn: () => void;
}

export const AdvancedFiltersStep: FC<Props> = ({isSearching, onContinue, onReturn}) => {
  const {
    formState: {isValid},
  } = useFormContext();

  return (
    <div className={styles.container}>
      <Typography level="h2">Filter Trips</Typography>
      <AdvancedFiltersStepForm />
      <div className={styles.actions}>
        <StyledButton startDecorator={<ArrowBack />} onClick={onReturn}>
          Back
        </StyledButton>
        <StyledButton
          onClick={onContinue}
          disabled={!isValid}
          loading={isSearching}
          startDecorator={<FlightTakeoffRounded />}>
          Search
        </StyledButton>
      </div>
    </div>
  );
};
