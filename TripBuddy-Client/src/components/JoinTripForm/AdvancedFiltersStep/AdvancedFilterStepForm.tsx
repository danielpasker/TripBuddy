import {FC} from 'react';
import {useFormContext} from 'react-hook-form';
import {Female, NoFood, TempleBuddhist} from '@mui/icons-material';
import {FormSlider} from '@components/common/input/FormSlider/FormSlider';
import {FormValueSelect} from '@components/common/input/FormValueSelect';
import {diets, genders, religions} from '@utils/consts';
import styles from './styles.module.scss';

const AdvancedFiltersStepForm: FC = () => {
  const {control} = useFormContext();

  return (
    <>
      <FormValueSelect
        control={control}
        formKey="gender"
        options={['Any', ...genders]}
        multiple
        placeholder="Travelers Gender"
        endDecorator={<Female />}
        className={styles.input}
      />
      <FormValueSelect
        control={control}
        formKey="religion"
        options={['Any', ...religions]}
        multiple
        placeholder="Travelers Religion"
        endDecorator={<TempleBuddhist />}
        className={styles.input}
      />
      <FormValueSelect
        control={control}
        formKey="dietaryPreferences"
        options={['None', ...diets]}
        multiple
        placeholder="Dietary Preferences"
        endDecorator={<NoFood />}
        className={styles.input}
      />
      <FormSlider control={control} formKey="averageAge" label="Average Age" min={0} max={120} step={1} />
    </>
  );
};

export {AdvancedFiltersStepForm};
