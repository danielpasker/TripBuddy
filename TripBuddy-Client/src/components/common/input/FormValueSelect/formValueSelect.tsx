import {FC} from 'react';
import {Control, useController} from 'react-hook-form';
import {Typography} from '@mui/joy';
import {StyledSelect, StyledSelectProps} from '@components/common/input/StyledSelect/styledSelect';
import styles from './styles.module.scss';

interface Props extends Omit<StyledSelectProps, 'onChange' | 'value'> {
  control: Control<any>;
  formKey: string;
}

const FormValueSelect: FC<Props> = ({control, formKey, options, ...props}) => {
  const {field, fieldState} = useController({control, name: formKey});

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
