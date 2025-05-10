import {parseISO} from 'date-fns';
import {FC} from 'react';
import {useFormContext} from 'react-hook-form';
import {
  AttachMoneyRounded,
  CalendarMonthOutlined,
  PeopleOutlineRounded,
  TravelExploreOutlined,
} from '@mui/icons-material';
import {tripTypes} from '@components/NewTripForm/DetailsStep/tripTypes';
import {FormDatePicker} from '@components/common/input/FormDatePicker';
import {FormInput} from '@components/common/input/FormInput';
import {FormValueSelect} from '@components/common/input/FormValueSelect';
import styles from './styles.module.scss';

const MatchFilterStepForm: FC = () => {
  const {control, watch} = useFormContext();
  const values = watch();

  return (
    <>
      <FormDatePicker
        className={styles.input}
        control={control}
        formKey="startDate"
        placeholder="Minimum Start Date"
        endDecorator={<CalendarMonthOutlined />}
        minDate={new Date()}
      />
      <FormDatePicker
        className={styles.input}
        control={control}
        formKey="endDate"
        placeholder="Minimum End Date"
        endDecorator={<CalendarMonthOutlined />}
        minDate={values.startDate ? parseISO(values.startDate) : new Date()}
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
        placeholder="Your max Budget"
        endDecorator={<AttachMoneyRounded />}
      />
      <FormInput
        className={styles.input}
        control={control}
        formKey="participants"
        type="number"
        slotProps={{input: {min: 1}}}
        placeholder="Maximum Participants"
        endDecorator={<PeopleOutlineRounded />}
      />
    </>
  );
};

export {MatchFilterStepForm};
