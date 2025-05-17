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

export const FiltersStepAdvanced: FC<Props> = ({isSearching, onContinue, onReturn}) => {
  const {trigger, formState} = useFormContext();

  const advancedFields = ['gender', 'religion', 'dietaryPreferences', 'averageAge'] as const;

  return (
    <div className={styles.container}>
      <Typography level="h2">Filter Trips</Typography>
      <AdvancedFiltersStepForm />
      <div className={styles.actions}>
        <StyledButton startDecorator={<ArrowBack />} onClick={onReturn}>
          Back
        </StyledButton>
        <StyledButton
          onClick={async () => {
            const valid = await trigger(advancedFields);
            console.log('📝 Validation result:', valid);
            console.log('❌ Field errors:', formState.errors);
            if (valid) {
              onContinue();
            }
          }}
          loading={isSearching}
          startDecorator={<FlightTakeoffRounded />}>
          Search
        </StyledButton>
      </div>
    </div>
  );
};
