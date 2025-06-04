import {Control, FieldValues, Path, useController} from 'react-hook-form';
import {TextareaProps, Typography} from '@mui/joy';
import {StyledTextArea} from '@components/common/input/StyledTextArea';
import styles from './styles.module.scss';

interface Props<T extends FieldValues = FieldValues> extends TextareaProps {
  control: Control<T>;
  formKey: string;
}

const FormTextArea = <T extends FieldValues>({control, formKey, ...props}: Props<T>) => {
  const {field, fieldState} = useController({control, name: formKey as Path<T>});

  return (
    <div className={styles.container}>
      <StyledTextArea {...field} {...props} />
      {fieldState.error && (
        <Typography color="danger" level="body-md" fontWeight={700}>
          {fieldState.error.message}
        </Typography>
      )}
    </div>
  );
};

export {FormTextArea};
