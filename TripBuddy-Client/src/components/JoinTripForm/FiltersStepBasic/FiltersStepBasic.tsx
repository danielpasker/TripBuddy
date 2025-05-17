import {FC} from 'react';
import {useFormContext} from 'react-hook-form';
import {ArrowBack, NavigateNextRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {StyledButton} from '@components/common/StyledButton';
import {BasicFiltersStepForm} from './FiltersStepBasicForm';
import styles from './styles.module.scss';

interface Props {
  isSearching: boolean;
  onContinue: () => void;
  onReturn: () => void;
}

export const FiltersStepBasic: FC<Props> = ({isSearching, onContinue, onReturn}) => {
  // const {trigger} = useFormContext();
  const {trigger, formState} = useFormContext();

  const basicFields = ['startDate', 'endDate', 'tripType', 'budget', 'maxParticipants'] as const;

  return (
    <div className={styles.container}>
      <Typography level="h2">Filter Trips</Typography>
      <BasicFiltersStepForm />
      <div className={styles.actions}>
        <StyledButton startDecorator={<ArrowBack />} onClick={onReturn}>
          Back
        </StyledButton>
        <StyledButton
          onClick={async () => {
            const valid = await trigger(basicFields);
            console.log('📝 Validation result:', valid);
            console.log('❌ Field errors:', formState.errors);
            if (valid) {
              onContinue();
            }
          }}
          loading={isSearching}
          endDecorator={<NavigateNextRounded />}>
          Next
        </StyledButton>
      </div>
    </div>
  );
};
