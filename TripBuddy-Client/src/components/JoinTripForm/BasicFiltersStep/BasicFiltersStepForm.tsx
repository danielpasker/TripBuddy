import {parseISO} from 'date-fns';
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
import {tripTypes} from '@utils/consts';
import styles from './styles.module.scss';

const BasicFiltersStepForm: FC = () => {
  const {control, watch} = useFormContext();
  const values = watch();

  return (
    <>
      <FormDatePicker
        control={control}
        formKey="startDate"
        placeholder="Earliest Start Date"
        endDecorator={<CalendarMonthOutlined />}
        minDate={new Date()}
        className={styles.input}
      />
      <FormDatePicker
        control={control}
        formKey="endDate"
        placeholder="Latest End Date"
        endDecorator={<CalendarMonthOutlined />}
        minDate={values.startDate ? parseISO(values.startDate) : new Date()}
        className={styles.input}
      />
      <FormValueSelect
        control={control}
        formKey="tripType"
        options={['Any', ...tripTypes]}
        multiple
        placeholder="Trip Type"
        endDecorator={<TravelExploreOutlined />}
        className={styles.input}
      />
      <FormInput
        control={control}
        formKey="budget"
        type="number"
        placeholder="Max Budget"
        slotProps={{input: {min: 0}}}
        endDecorator={<AttachMoneyRounded />}
        className={styles.input}
      />
      <FormInput
        control={control}
        formKey="maxParticipants"
        type="number"
        placeholder="Max Participants"
        slotProps={{input: {min: 1}}}
        endDecorator={<PeopleOutlineRounded />}
        className={styles.input}
      />
    </>
  );
};

export {BasicFiltersStepForm};
