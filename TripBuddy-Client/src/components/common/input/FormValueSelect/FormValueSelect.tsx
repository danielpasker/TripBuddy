import {Control, FieldValues, Path, PathValue, useController} from 'react-hook-form';
import {Typography} from '@mui/joy';
import {StyledSelect, StyledSelectProps} from '@components/common/input/StyledSelect/StyledSelect';
import styles from './styles.module.scss';

interface Props<T extends FieldValues = FieldValues> extends Omit<StyledSelectProps, 'onChange' | 'value'> {
  control: Control<T>;
  formKey: string;
}

const FormValueSelect = <T extends FieldValues>({control, formKey, options, ...props}: Props<T>) => {
  const {field, fieldState} = useController({
    control,
    name: formKey as Path<T>,
    defaultValue: '' as PathValue<T, Path<T>>,
  });

  return (
    <div className={styles.container}>
      <StyledSelect options={options} {...field} onChange={value => field.onChange(value)} {...props} />
      {fieldState.error && (
        <Typography color="danger" level="body-md" fontWeight={700}>
          {fieldState.error.message}
        </Typography>
      )}
    </div>
  );
};

export {FormValueSelect};
