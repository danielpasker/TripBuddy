import {FC} from 'react';
import {useController, useFormContext} from 'react-hook-form';
import {NavigateNextRounded} from '@mui/icons-material';
import {StyledButton} from '@components/common/StyledButton';
import styles from './styles.module.scss';

interface Props {
  onContinue: () => void;
}

const DestinationStep: FC<Props> = ({onContinue}) => {
  const {control} = useFormContext();
  const {field, fieldState} = useController({control, name: 'location'});

  return (
    <div className={styles.container}>
      <h1>
        TODO: get destinations from api and display them, when selecting one show its selected and put its value in the
        form state
      </h1>
      <StyledButton disabled={!!fieldState.error} onClick={onContinue} endDecorator={<NavigateNextRounded />}>
        Continue
      </StyledButton>
    </div>
  );
};
export {DestinationStep};
