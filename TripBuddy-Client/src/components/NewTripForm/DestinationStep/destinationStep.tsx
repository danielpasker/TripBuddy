import {FC, useState} from 'react';
import {StyledButton} from '@components/common/StyledButton';
import styles from './styles.module.scss';
import {NavigateNextRounded} from '@mui/icons-material';

interface Props {
  onContinue: () => void;
}

const DestinationStep: FC<Props> = ({onContinue}) => {
  const [destination, setDestination] = useState<string>('example');

  return (
    <div className={styles.container}>
      <h1>TODO: get destinations from api and display them, when selecting one show its selected and put its value in a
        state (later a form)</h1>
      <StyledButton disabled={!destination} onClick={onContinue}
                    endDecorator={<NavigateNextRounded />}
      >Continue</StyledButton>
    </div>
  );
};
export {DestinationStep};