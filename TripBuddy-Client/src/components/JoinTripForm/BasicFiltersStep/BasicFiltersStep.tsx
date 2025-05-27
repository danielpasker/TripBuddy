import {FC} from 'react';
import {useFormContext} from 'react-hook-form';
import {ArrowBack, NavigateNextRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {StyledButton} from '@components/common/StyledButton';
import {BasicFiltersStepForm} from './BasicFiltersStepForm';
import styles from './styles.module.scss';

interface Props {
  onContinue: () => void;
  onReturn: () => void;
}

const BasicFiltersStep: FC<Props> = ({onContinue, onReturn}) => {
  const {
    formState: {isValid},
  } = useFormContext();

  return (
    <div className={styles.container}>
      <Typography level="h2">Trip Filters</Typography>
      <BasicFiltersStepForm />
      <div className={styles.actions}>
        <StyledButton startDecorator={<ArrowBack />} onClick={onReturn}>
          Return
        </StyledButton>
        <StyledButton disabled={!isValid} onClick={onContinue} endDecorator={<NavigateNextRounded />}>
          Continue
        </StyledButton>
      </div>
    </div>
  );
};

export {BasicFiltersStep};
