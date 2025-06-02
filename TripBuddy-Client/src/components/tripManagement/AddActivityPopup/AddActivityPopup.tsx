import {FC, useCallback, useState} from 'react';
import {LocationOnRounded} from '@mui/icons-material';
import {Stack} from '@mui/joy';
import {Popup} from '@components/common/Popup';
import {StyledButton} from '@components/common/StyledButton';
import {FormInput} from '@components/common/input/FormInput';
import {FormTextArea} from '@components/common/input/FormTextArea';
import {FormValueSelect} from '@components/common/input/FormValueSelect';
import {TripPlan} from '@customTypes/TripPlan';
import {useValidatedForm} from '@hooks/useValidatedSchema';
import {updateTripPlan} from '@services/tripPlanApi';
import {AddActivitySchemaType, addActivitySchema} from './form';

interface Props {
  open: boolean;
  tripId: string;
  tripPlan: TripPlan;
  onClose: () => void;
  onActivityAdded: () => void;
}

const AddActivityPopup: FC<Props> = ({open, tripId, tripPlan, onClose, onActivityAdded}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: {isValid},
  } = useValidatedForm(addActivitySchema, {
    day: 1,
    activity: '',
    location: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(
    async (data: AddActivitySchemaType) => {
      setIsLoading(true);
      try {
        await updateTripPlan(tripId, {
          day: data.day,
          activity: {
            activity: data.activity,
            location: data.location,
            isValid: true,
          },
        });
        onClose();
        onActivityAdded();
      } catch (error) {
        console.error('Failed to add activity:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [tripId, updateTripPlan, onActivityAdded, onClose]
  );

  const handleClose = () => {
    reset();
    onClose();
  };

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
      <Stack spacing={2}>
        <FormValueSelect
          control={control}
          formKey="day"
          options={Array.from({length: tripPlan.days}).map((_, index) => `Day ${index + 1}`) ?? []}
          placeholder="Day"
        />
        <FormTextArea control={control} formKey="activity" minRows={3} placeholder="What are you going to do?" />
        <FormInput
          control={control}
          formKey="location"
          placeholder="Where is this activity?"
          endDecorator={<LocationOnRounded />}
        />
      </Stack>
    </Popup>
  );
};

export {AddActivityPopup};
