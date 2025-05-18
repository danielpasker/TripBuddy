import {Control, FieldValues, Path, PathValue, useController} from 'react-hook-form';
import {Slider, SliderProps, Typography} from '@mui/joy';
import styles from './styles.module.scss';

interface Props<T extends FieldValues = FieldValues> extends Omit<SliderProps, 'onChange' | 'value'> {
  control: Control<T>;
  formKey: Path<T>;
  label?: string;
}

const FormSlider = <T extends FieldValues>({
  control,
  formKey,
  label,
  min = 0,
  max = 120,
  step = 1,
  ...props
}: Props<T>) => {
  const defaultValue = (min + max) / 2;

  const {
    field: {value, onChange, ...rest},
    fieldState: {error},
  } = useController({
    control,
    name: formKey,
    defaultValue: defaultValue as PathValue<T, typeof formKey>,
  });

  return (
    <div className={styles.sliderContainer}>
      {label && (
        <Typography level="body-md" sx={{mb: 1}}>
          {label}
        </Typography>
      )}
      <Slider
        {...rest}
        {...props}
        value={value as number}
        onChange={(_, v) => onChange(v)}
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="on"
        aria-labelledby={`${String(formKey)}-slider`}
      />
      {error && (
        <Typography color="danger" level="body-sm">
          {error.message}
        </Typography>
      )}
    </div>
  );
};

export {FormSlider};
