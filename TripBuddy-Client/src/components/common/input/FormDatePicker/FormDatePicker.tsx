import {FC} from 'react';
import {Control, FieldValues, useController} from 'react-hook-form';
import {Typography} from '@mui/joy';
import {StyledDatePicker, StyledDatePickerProps} from '@components/common/input/StyledDatePicker';
import styles from './styles.module.scss';

interface Props extends Omit<StyledDatePickerProps, 'onSelectDate'> {
  control: Control<FieldValues>;
  formKey: string;
}

const FormDatePicker: FC<Props> = ({control, formKey, ...props}) => {
  const {field, fieldState} = useController({control, name: formKey});

  return (
    <div className={styles.container}>
      <StyledDatePicker onSelectDate={field.onChange} {...field} {...props} />
      {fieldState.error && (
        <Typography color="danger" level="body-md" fontWeight={700}>
          {fieldState.error.message}
        </Typography>
      )}
    </div>
  );
};

export {FormDatePicker};
