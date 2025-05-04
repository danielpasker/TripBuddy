import {parseISO} from 'date-fns';
import {FC, useRef, useState} from 'react';
import {DayPicker} from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import {ClickAwayListener} from '@mui/base';
import {TodayRounded} from '@mui/icons-material';
import {ContentCard} from '@components/common/ContentCard';
import {StyledInput, StyledInputProps} from '@components/common/input/StyledInput';
import {formatDate} from '@utils/dateUtils';
import styles from './styles.module.scss';

interface Props extends Omit<StyledInputProps, 'value'> {
  value?: string;
  minDate?: Date;
  onSelectDate: (date?: string) => void;
}

const StyledDatePicker: FC<Props> = ({value, minDate, onSelectDate, ...props}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleDateChange = (date?: Date) => {
    onSelectDate(date?.toISOString());
    setIsPickerOpen(false);
  };

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    if (inputRef.current && inputRef.current.contains(event.target as Node)) {
      return;
    }

    setIsPickerOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={styles.container}>
        <div ref={inputRef}>
          <StyledInput
            {...props}
            placeholder={props.placeholder ?? 'Select Date'}
            value={formatDate(value)}
            readOnly
            onClick={() => setIsPickerOpen(true)}
            endDecorator={<TodayRounded />}
          />
        </div>
        {isPickerOpen && (
          <div className={styles.calender}>
            <ContentCard>
              <DayPicker
                mode="single"
                animate
                selected={value ? parseISO(value) : undefined}
                onSelect={handleDateChange}
                disabled={minDate ? [{before: minDate}] : undefined}
              />
            </ContentCard>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export type {Props as StyledDatePickerProps};
export {StyledDatePicker};
