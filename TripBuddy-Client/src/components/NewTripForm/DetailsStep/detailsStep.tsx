import {FC} from 'react';
import {StyledButton} from '@components/common/StyledButton';
import {FlightTakeoffRounded} from '@mui/icons-material';
import styles from './styles.module.scss';

interface Props {
  onSubmit: () => void;
  isPlanningTrip: boolean;
}

const DetailsStep: FC<Props> = ({onSubmit, isPlanningTrip}) => {
  return (
    <div className={styles.container}>
      <h1>TODO: fill the details of the trip as shown in figma - use from input to update the values into the form</h1>
      <StyledButton
        onClick={onSubmit}
        startDecorator={<FlightTakeoffRounded />}
        loading={isPlanningTrip}>
        Plan Trip
      </StyledButton>
    </div>
  );
};
export {DetailsStep};