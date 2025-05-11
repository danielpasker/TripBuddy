import {parseISO} from 'date-fns';
import {FC} from 'react';
import {useFormContext} from 'react-hook-form';
import {
  AttachMoneyRounded,
  CalendarMonthOutlined,
  PeopleOutlineRounded,
  TravelExploreOutlined,
} from '@mui/icons-material';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import FemaleIcon from '@mui/icons-material/Female';
import NoFoodIcon from '@mui/icons-material/NoFood';
import TempleBuddhistIcon from '@mui/icons-material/TempleBuddhist';
import {tripTypes} from '@components/NewTripForm/DetailsStep/tripTypes';
import {FormDatePicker} from '@components/common/input/FormDatePicker';
import {FormInput} from '@components/common/input/FormInput';
import {FormValueSelect} from '@components/common/input/FormValueSelect';
import {FormValueSelectMultiple} from '@components/common/input/FormValueSelectMultiple/FormValueSelectMultiple';
import {diets, genders, religions} from '@utils/consts';
import styles from './styles.module.scss';

export const FiltersStepForm: FC = () => {
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
        formKey="type"
        options={tripTypes.map(t => t.label)}
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
        formKey="participants"
        type="number"
        placeholder="Max Participants"
        slotProps={{input: {min: 1}}}
        endDecorator={<PeopleOutlineRounded />}
        className={styles.input}
      />
      Advanced
      <FormValueSelect
        control={control}
        formKey="gender"
        options={['Any', ...genders]}
        placeholder="Travelers Gender"
        endDecorator={<FemaleIcon />}
        className={styles.input}
      />
      <FormValueSelect
        control={control}
        formKey="religion"
        options={['Any', ...religions]}
        placeholder="Travelers Religion"
        endDecorator={<TempleBuddhistIcon />}
        className={styles.input}
      />
      <FormValueSelectMultiple
        control={control}
        formKey="diets"
        options={['Any', ...diets]}
        multiple={true}
        placeholder="Dietary Preferences"
        endDecorator={<NoFoodIcon />}
        className={styles.input}
      />
      <FormInput
        control={control}
        formKey="averageAge"
        type="number"
        placeholder="Average Age"
        endDecorator={<Diversity3Icon />}
        slotProps={{input: {min: 0, max: 120}}}
        className={styles.input}
      />
    </>
  );
};
