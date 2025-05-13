import {FC} from 'react';
import {useFormContext} from 'react-hook-form';
import {ArrowBack, FlightTakeoffRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {StyledButton} from '@components/common/StyledButton';
import {FiltersStepForm} from './FiltersStepForm';
import styles from './styles.module.scss';

interface Props {
  isSearching: boolean;
  onSubmit: () => void;
  onReturn: () => void;
}

export const FiltersStep: FC<Props> = ({isSearching, onSubmit, onReturn}) => {
  const {
    formState: {isValid},
  } = useFormContext();

  return (
    <div className={styles.container}>
      <Typography level="h2">Filter Trips</Typography>
      <FiltersStepForm />
      <div className={styles.actions}>
        <StyledButton startDecorator={<ArrowBack />} onClick={onReturn}>
          Back
        </StyledButton>
        <StyledButton
          onClick={onSubmit}
          disabled={!isValid}
          loading={isSearching}
          startDecorator={<FlightTakeoffRounded />}>
          Search
        </StyledButton>
      </div>
    </div>
  );
};
