import {FC} from 'react';
import {useFormContext} from 'react-hook-form';
import {
  AttachMoneyRounded,
  CalendarMonthOutlined,
  PeopleOutlineRounded,
  TravelExploreOutlined,
} from '@mui/icons-material';
import {FormDatePicker} from '@components/common/input/FormDatePicker';
import {FormInput} from '@components/common/input/FormInput';
import {FormValueSelect} from '@components/common/input/FormValueSelect';
import styles from './styles.module.scss';
import {tripTypes} from './tripTypes';

const TripDetailsForm: FC = () => {
  const {control} = useFormContext();

  return (
    <>
      <FormDatePicker
        className={styles.input}
        control={control}
        formKey="startDate"
        placeholder="Trip Start Date"
        endDecorator={<CalendarMonthOutlined />}
      />

      <FormDatePicker
        className={styles.input}
        control={control}
        formKey="endDate"
        placeholder="Trip End Date"
        endDecorator={<CalendarMonthOutlined />}
      />

      <FormValueSelect
        className={styles.input}
        control={control}
        formKey="type"
        placeholder="Trip Type"
        options={tripTypes.map(trip => trip.label)}
        endDecorator={<TravelExploreOutlined />}
      />

      <FormInput
        className={styles.input}
        control={control}
        formKey="budget"
        type="number"
        slotProps={{input: {min: 1}}}
        placeholder="Your Budget"
        endDecorator={<AttachMoneyRounded />}
      />

      <FormInput
        className={styles.input}
        control={control}
        formKey="participants"
        type="number"
        slotProps={{input: {min: 1}}}
        placeholder="Participants"
        endDecorator={<PeopleOutlineRounded />}
      />
    </>
  );
};

export {TripDetailsForm};
