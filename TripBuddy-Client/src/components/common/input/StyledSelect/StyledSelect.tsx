import {memo} from 'react';
import {Option, Select, SelectProps, Typography, styled} from '@mui/joy';
import {glassEffect} from '@styles/commonStyles';
import styles from './styles.module.scss';

const CustomSelect = styled(Select)({
  ...glassEffect,
  padding: '8px 16px',
  borderRadius: 100,
  borderColor: 'rgba(255, 255, 255, 0.7)',
  '--Icon-color': 'white',
  '--joy-palette-text-icon': 'white',
  '--variant-outlinedHoverBg': 'rgba(255, 255, 255, 0.5)',
  transition: 'background-color 0.2s',
});

interface Props extends Omit<SelectProps<object, boolean>, 'onChange'> {
  options: string[];
  inputLabel?: string;
  onChange: (value: string) => void;
}

const StyledSelect = memo<Props>(({options, onChange, inputLabel, ...props}) => (
  <div className={styles.container}>
    {inputLabel && <Typography level="body-md">{inputLabel}</Typography>}
    <CustomSelect
      {...props}
      slotProps={{
        listbox: {
          style: {
            ...glassEffect,
            gap: 8,
            padding: 8,
          },
        },
      }}
      onChange={(_e, newValue) => {
        onChange(newValue as string);
      }}>
      {options.map(option => (
        <Option style={glassEffect} key={option} value={option}>
          {option}
        </Option>
      ))}
    </CustomSelect>
  </div>
));

export type {Props as StyledSelectProps};
export {StyledSelect};
