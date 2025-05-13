import {FC, ReactNode, useCallback, useState} from 'react';
import {FormProvider} from 'react-hook-form';
import {toast} from 'react-toastify';
import {DestinationStep} from '@components/NewTripForm/DestinationStep';
import {TripPlan} from '@customTypes/TripPlan';
import {useValidatedForm} from '@hooks/useValidatedSchema';
import {FiltersStep} from './FiltersStep/FiltersStep';
import {SearchResultsStep} from './SearchResultsStep/SearchResultsStep';
import {JoinTripSchemaType, joinTripSchema} from './form';

enum Step {
  DESTINATION_PICK,
  SEARCH_FILTERS,
  RESULTS,
}

const JoinTripForm: FC = () => {
  const form = useValidatedForm(joinTripSchema);
  const [step, setStep] = useState<Step>(Step.DESTINATION_PICK);
  const [results, setResults] = useState<TripPlan[]>([]);

  const next = useCallback(() => setStep(s => s + 1), []);
  const back = useCallback(() => setStep(s => Math.max(s - 1, Step.DESTINATION_PICK)), []);
  const isSearching = false;
  const onSearch = async (data: JoinTripSchemaType) => {
    //Data will be in use when the API is ready
    toast.success('Filters submitted!');
    setResults([]);
    setStep(Step.RESULTS);
  };

  const steps: Record<Step, ReactNode> = {
    [Step.DESTINATION_PICK]: <DestinationStep onContinue={next} />,

    [Step.SEARCH_FILTERS]: (
      <FiltersStep isSearching={isSearching} onSubmit={form.handleSubmit(onSearch)} onReturn={back} />
    ),

    [Step.RESULTS]: <SearchResultsStep results={results} onReturn={back} />,
  };

  return <FormProvider {...form}>{steps[step]}</FormProvider>;
};

export default JoinTripForm;
