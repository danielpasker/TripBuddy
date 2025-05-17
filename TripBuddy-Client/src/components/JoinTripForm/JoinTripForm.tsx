import {FC, ReactNode, useCallback, useState} from 'react';
import {FormProvider} from 'react-hook-form';
// import {i} from 'react-router/dist/development/route-data-Cw8htKcF';
import {toast} from 'react-toastify';
import {DestinationStep} from '@components/NewTripForm/DestinationStep';
import {Trip} from '@customTypes/Trip';
import {useValidatedForm} from '@hooks/useValidatedSchema';
import {AdvancedFiltersStep} from './FiltersStepAdvenced/FilterStepAdvenced';
import {FiltersStepBasic} from './FiltersStepBasic/FiltersStepBasic';
import {SearchResultsStep} from './SearchResultsStep/SearchResultsStep';
import {JoinTripSchemaType, joinTripSchema} from './form';

enum Step {
  DESTINATION_PICK,
  SEARCH_FILTERS_BASIC,
  SEARCH_FILTERS_ADVANCED,
  RESULTS,
}

const JoinTripForm: FC = () => {
  const form = useValidatedForm(joinTripSchema);
  const [step, setStep] = useState<Step>(Step.DESTINATION_PICK);
  const [results, setResults] = useState<Trip[]>([]);

  const next = useCallback(() => setStep(s => s + 1), []);
  const back = useCallback(() => setStep(s => Math.max(s - 1, Step.DESTINATION_PICK)), []);
  const isSearching = false;
  const onSearch = async (_data: JoinTripSchemaType) => {
    void _data;
    toast.success('Filters submitted!');
    setResults([]);
    setStep(Step.RESULTS);
  };

  const steps: Record<Step, ReactNode> = {
    [Step.DESTINATION_PICK]: <DestinationStep onContinue={next} />,
    [Step.SEARCH_FILTERS_BASIC]: <FiltersStepBasic onContinue={next} onReturn={back} isSearching={false} />,
    [Step.SEARCH_FILTERS_ADVANCED]: (
      <AdvancedFiltersStep isSearching={isSearching} onContinue={form.handleSubmit(onSearch)} onReturn={back} />
    ),

    [Step.RESULTS]: <SearchResultsStep results={results} onReturn={back} />,
  };

  return <FormProvider {...form}>{steps[step]}</FormProvider>;
};

export default JoinTripForm;
