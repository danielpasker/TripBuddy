import {FC, ReactNode, useCallback, useState} from 'react';
import {FormProvider} from 'react-hook-form';
import {toast} from 'react-toastify';
import {DestinationStep} from '@components/NewTripForm/DestinationStep';
import {TripPlan} from '@customTypes/TripPlan';
import {useMutation} from '@hooks/useMutation';
import {useValidatedForm} from '@hooks/useValidatedSchema';
//import {searchTrips} from '@services/tripSearchApi';
import {LogisticFiltersStep} from './LogisticFiltersStep/LogisticFiltersStep';
import {MatchFiltersStep} from './MatchFilterstStep/MatchFiltersStep';
import {SearchResultsStep} from './SearchResultsStep/SearchResultsStep';
import {JoinTripSchemaType, joinTripSchema} from './form';

enum Step {
  DESTINATION_PICK,
  SEARCH_FILTERS,
  MATCH_FILTERS,
  RESULTS,
}

export const JoinTripForm: FC = () => {
  const form = useValidatedForm(joinTripSchema);
  const [currentStep, setCurrentStep] = useState<Step>(Step.DESTINATION_PICK);
  const [results, setResults] = useState<TripPlan[]>([]);

  const {trigger: doSearch, isLoading: isSearching} = useMutation<TripPlan[], JoinTripSchemaType>(searchTrips);

  const onNext = useCallback(() => setCurrentStep(s => s + 1), []);
  const onBack = useCallback(() => setCurrentStep(s => Math.max(s - 1, Step.DESTINATION_PICK)), []);

  const onSearch = async (data: JoinTripSchemaType) => {
    try {
      const found = await doSearch(data);
      setResults(found);
      setCurrentStep(Step.RESULTS);
    } catch {
      toast.error('Search failed — please try again.');
    }
  };

  const steps: Record<Step, ReactNode> = {
    [Step.DESTINATION_PICK]: <DestinationStep onContinue={onNext} />,

    [Step.SEARCH_FILTERS]: (
      <LogisticFiltersStep isSearching={isSearching} onSubmit={form.handleSubmit(onSearch)} onReturn={onBack} />
    ),

    [Step.MATCH_FILTERS]: <MatchFiltersStep onContinue={onNext} onReturn={onBack} />,

    [Step.RESULTS]: <SearchResultsStep results={results} onReturn={onBack} />,
  };

  return <FormProvider {...form}>{steps[currentStep]}</FormProvider>;
};
