import {Dispatch, FC, SetStateAction, useCallback, useState} from 'react';
import {toast} from 'react-toastify';
import {LocationOnRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {Popup} from '@components/common/Popup';
import {StyledButton} from '@components/common/StyledButton';
import {FormInput} from '@components/common/input/FormInput';
import {FormTextArea} from '@components/common/input/FormTextArea';
import {FormValueSelect} from '@components/common/input/FormValueSelect';
import {TripPlan} from '@customTypes/TripPlan';
import {useValidatedForm} from '@hooks/useValidatedSchema';
import {addActivityToPlan} from '@services/tripPlanApi';
import {AddActivitySchemaType, getAddActivitySchema} from './form';
import styles from './styles.module.scss';

interface Props {
  open: boolean;
  tripId: string;
  tripPlan: TripPlan;
  onClose: () => void;
  onActivityAdded: Dispatch<SetStateAction<TripPlan | undefined>>;
}

const AddActivityPopup: FC<Props> = ({open, tripId, tripPlan, onClose, onActivityAdded}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: {isValid},
  } = useValidatedForm(getAddActivitySchema(tripPlan.days));

  const [isLoading, setIsLoading] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  const onSubmit = useCallback(
    async (data: AddActivitySchemaType) => {
      setIsLoading(true);

      try {
        const updatedTrip = await addActivityToPlan(tripId, data);
        onActivityAdded(updatedTrip);

        toast.success('Activity added successfully');
        handleClose();
      } catch {
        toast.error('Failed to add activity');
      } finally {
        setIsLoading(false);
      }
    },
    [tripId, onActivityAdded, handleClose]
  );

  return (
    <Popup
      open={open}
      title="Add New Activity"
      onCancel={handleClose}
      acceptAction={
        <StyledButton onClick={handleSubmit(onSubmit)} loading={isLoading} disabled={!isValid}>
          Add Activity
        </StyledButton>
      }>
      <div className={styles.container}>
        <FormValueSelect
          inputLabel="Day"
          control={control}
          formKey="day"
          options={Array.from({length: tripPlan.days}).map((_, index) => String(index + 1)) ?? []}
          placeholder="On which day?"
        />
        <FormTextArea control={control} formKey="activity" minRows={3} placeholder="What are you going to do?" />
        <FormInput
          control={control}
          formKey="location"
          inputLabel="Location"
          placeholder="Where is this activity?"
          endDecorator={<LocationOnRounded />}
        />
        <Typography className={styles.text}>The new activity cannot be updated later.</Typography>
      </div>
    </Popup>
  );
};

export {AddActivityPopup};
