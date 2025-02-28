import {FC} from 'react';
import {useFormContext} from 'react-hook-form';
import {ArrowBack, FlightTakeoffRounded, PeopleOutlineRounded} from '@mui/icons-material';
import {StyledButton} from '@components/common/StyledButton';
import {FormDatePicker} from '@components/common/input/FormDatePicker';
import {FormInput} from '@components/common/input/FormInput';
import styles from './styles.module.scss';

interface Props {
  isPlanningTrip: boolean;
  onSubmit: () => void;
  onReturn: () => void;
}

const DetailsStep: FC<Props> = ({isPlanningTrip, onSubmit, onReturn}) => {
  const {
    formState: {isValid},
    control,
  } = useFormContext();

  return (
    <div className={styles.container}>
      <h1>TODO: fill the details of the trip as shown in figma - use fromInput to update the values into the form</h1>
      {/* Example of FormInput usage */}
      <FormInput
        className={styles.input}
        control={control}
        formKey="participants"
        type="number"
        slotProps={{input: {min: 1}}}
        placeholder="Participants"
        endDecorator={<PeopleOutlineRounded />}
      />
      {/* Example of FormDatePicker usage */}
      <FormDatePicker control={control} formKey="startDate" className={styles.input} />
      <div className={styles.actions}>
        <StyledButton className={styles.returnButton} startDecorator={<ArrowBack />} onClick={onReturn}>
          Return
        </StyledButton>
        <StyledButton
          onClick={onSubmit}
          disabled={!isValid}
          startDecorator={<FlightTakeoffRounded />}
          loading={isPlanningTrip}>
          Let's Take Off
        </StyledButton>
      </div>
    </div>
  );
};
export {DetailsStep};
