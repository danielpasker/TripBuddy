import {ChangeEvent, FC} from 'react';
import {Control, useController} from 'react-hook-form';
import {Typography} from '@mui/joy';
import {StyledInput, StyledInputProps} from '@components/common/input/StyledInput';
import styles from './styles.module.scss';

interface Props extends StyledInputProps {
  control: Control<any>;
  formKey: string;
}

const FormInput: FC<Props> = ({control, formKey, ...props}) => {
  const {field, fieldState} = useController({control, name: formKey});

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
