// src/components/JoinTripForm/MatchFiltersStep/MatchFiltersStepForm.tsx
import {FC} from 'react';
import {useController, useFormContext} from 'react-hook-form';
import {
  PersonPin as AgeIcon,
  Fastfood as DietIcon,
  Wc as GenderIcon,
  Church as ReligionIcon,
} from '@mui/icons-material';
import {Chip, Typography} from '@mui/joy';
import {FormInput} from '@components/common/input/FormInput';
import {FormValueSelect} from '@components/common/input/FormValueSelect';
import {diets, genders, religions} from '@utils/consts';
import {JoinTripSchemaType} from '../form';
import styles from './styles.module.scss';

export const MatchFilterStepForm: FC = () => {
  const {control, watch} = useFormContext<JoinTripSchemaType>();
  const values = watch();

  // controllers
  const genderCtl = useController({
    control,
    name: 'gender',
    defaultValue: '',
  });
  const religionCtl = useController({
    control,
    name: 'religion',
    defaultValue: '',
  });
  const dietCtl = useController({
    control,
    name: 'diets', // make sure your schema has `diets: z.array(z.string())`
    defaultValue: [] as string[],
  });
  const ageCtl = useController({
    control,
    name: 'averageAge', // add `averageAge: z.number().min(0).optional()`
    defaultValue: undefined,
  });

  // diet‐toggle handler
  const toggleDiet = (diet: string) => {
    const arr = [...dietCtl.field.value];
    const idx = arr.indexOf(diet);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(diet);
    dietCtl.field.onChange(arr);
  };

  return (
    <div className={styles.container}>
      {/* -- Gender -- */}
      <FormValueSelect
        control={control}
        formKey="gender"
        options={genders}
        placeholder="Gender"
        endDecorator={<GenderIcon />}
        className={styles.input}
      />

      {/* -- Religion -- */}
      <FormValueSelect
        control={control}
        formKey="religion"
        options={religions}
        placeholder="Religion"
        endDecorator={<ReligionIcon />}
        className={styles.input}
      />

      {/* -- Diets as chips -- */}
        <FormValueSelect
    control={control}
    formKey="diets"
    options={diets}
    multiple
    placeholder="Dietary Preferences"
    endDecorator={<DietIcon />}
    className={styles.input}
  />


      <FormInput
        control={control}
        formKey="averageAge"
        type="number"
        placeholder="Average Age"
        endDecorator={<AgeIcon />}
        slotProps={{input: {min: 18, max: 100}}}
        className={styles.input}
      />
    </div>
  );
};
