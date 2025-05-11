import {FC, ReactNode, useCallback, useState} from 'react';
import {FormProvider} from 'react-hook-form';
import {toast} from 'react-toastify';
import {DestinationStep} from '@components/NewTripForm/DestinationStep';
import {TripPlan} from '@customTypes/TripPlan';
import {useMutation} from '@hooks/useMutation';
import {useValidatedForm} from '@hooks/useValidatedSchema';
import {searchTrips} from '@services/tripSearchApi';
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

  // for final submission
  const {trigger: doSearch, isLoading: isSearching} = useMutation<TripPlan[], JoinTripSchemaType>(searchTrips);

  const next = useCallback(() => setStep(s => s + 1), []);
  const back = useCallback(() => setStep(s => Math.max(s - 1, Step.DESTINATION_PICK)), []);

  // ① validate & submit all filters
  const onSearch = async (data: JoinTripSchemaType) => {
    try {
      const found = await doSearch(data);
      setResults(found);
      setStep(Step.RESULTS);
    } catch {
      toast.error('Search failed—please try again.');
    }
  };
  const onFiltersContinue = form.handleSubmit(onSearch);

  const steps: Record<Step, ReactNode> = {
    [Step.DESTINATION_PICK]: <DestinationStep onContinue={next} />,

    [Step.SEARCH_FILTERS]: <FiltersStep isSearching={isSearching} onContinue={onFiltersContinue} onReturn={back} />,

    [Step.RESULTS]: <SearchResultsStep results={results} onReturn={back} />,
  };

  return <FormProvider {...form}>{steps[step]}</FormProvider>;
};

export default JoinTripForm;
