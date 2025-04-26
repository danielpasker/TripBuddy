import {ChangeEvent, FC} from 'react';
import {Control, FieldValues, Path, useController} from 'react-hook-form';
import {Typography} from '@mui/joy';
import {StyledInput, StyledInputProps} from '@components/common/input/StyledInput';
import styles from './styles.module.scss';

interface Props<T extends FieldValues = FieldValues> extends StyledInputProps {
  control: Control<T>;
  formKey: string;
}

const FormInput = <T extends FieldValues>({control, formKey, ...props}: Props<T>) => {
  const {field, fieldState} = useController({control, name: formKey as Path<T>});

  const onChangeValue = (e?: ChangeEvent<HTMLInputElement>) =>
    field.onChange(e?.target.value && props.type === 'number' ? Number(e?.target.value) : e?.target.value);

  return (
    <div className={styles.container}>
      <StyledInput {...field} {...props} onChange={onChangeValue} />
      {fieldState.error && (
        <Typography color="danger" level="body-md" fontWeight={700}>
          {fieldState.error.message}
        </Typography>
      )}
    </div>
  );
};

export {FormInput};
