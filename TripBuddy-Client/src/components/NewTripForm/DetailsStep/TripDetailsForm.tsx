import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  PeopleOutlineRounded, 
  CalendarMonthOutlined, 
  AttachMoneyRounded,
  TravelExploreOutlined 
} from '@mui/icons-material';
import { FormInput } from '@components/common/input/FormInput';
import { FormDatePicker } from '@components/common/input/FormDatePicker';
import { FormValueSelect } from '@components/common/input/FormValueSelect';
import { tripTypes } from './tripTypes';
import styles from './styles.module.scss';


const TripDetailsForm: FC = () => {
  const { control } = useFormContext();

  return (
    <>
      <FormDatePicker
        className={styles.input}
        control={control}
        formKey="tripStartDate"
        placeholder="Trip Start Date"
        endDecorator={<CalendarMonthOutlined />}
      />

      <FormDatePicker
        className={styles.input}
        control={control}
        formKey="tripEndDate"
        placeholder="Trip End Date"
        endDecorator={<CalendarMonthOutlined />}
      />

      <FormValueSelect
        className={styles.input}
        control={control}
        formKey="tripType"
        placeholder="Trip Type"
        options={tripTypes.map(trip => trip.label)}
        endDecorator={<TravelExploreOutlined />}
      />

      <FormInput
        className={styles.input}
        control={control}
        formKey="budgetUSD"
        type="number"
        slotProps={{ input: { min: 1 } }}
        placeholder="Your Budget"
        endDecorator={<AttachMoneyRounded />}
      />

      <FormInput
        className={styles.input}
        control={control}
        formKey="participantsNumber"
        type="number"
        slotProps={{ input: { min: 1 } }}
        placeholder="Participants"
        endDecorator={<PeopleOutlineRounded />}
      />
    </>
  );
};

export { TripDetailsForm };
