// File: FormValueSelect.tsx
import {Control, FieldValues, Path, PathValue, useController} from 'react-hook-form';
import {Typography} from '@mui/joy';
import {StyledSelect, StyledSelectProps} from '@components/common/input/StyledSelect/StyledSelect';
import styles from './styles.module.scss';

interface Props<T extends FieldValues = FieldValues> extends Omit<StyledSelectProps, 'onChange' | 'value'> {
  control: Control<T>;
  formKey: Path<T>;
  multiple?: boolean;
}

const FormValueSelect = <T extends FieldValues>({control, formKey, options, multiple = false, ...props}: Props<T>) => {
  const defaultValue = (multiple ? [] : '') as PathValue<T, typeof formKey>;

  const {
    field: {value, onChange, ...rest},
    fieldState,
  } = useController({
    control,
    name: formKey,
    defaultValue,
  });

  return (
    <div className={styles.container}>
      <StyledSelect
        {...rest}
        options={options}
        multiple={multiple}
        value={value}
        onChange={val => onChange(val)}
        {...props}
      />
      {fieldState.error && (
        <Typography color="danger" level="body-md" fontWeight={700}>
          {fieldState.error.message}
        </Typography>
      )}
    </div>
  );
};

export {FormValueSelect};
