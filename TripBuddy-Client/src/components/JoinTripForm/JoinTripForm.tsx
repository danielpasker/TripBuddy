// src/components/JoinTripForm/JoinTripForm.tsx
import {FC, ReactNode, useCallback, useState} from 'react';
import {FormProvider} from 'react-hook-form';
import {toast} from 'react-toastify';
import {DestinationStep} from '@components/NewTripForm/DestinationStep';
import {TripPlan} from '@customTypes/TripPlan';
import {useMutation} from '@hooks/useMutation';
import {useValidatedForm} from '@hooks/useValidatedSchema';
import {searchTrips} from '@services/tripSearchApi';
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

const JoinTripForm: FC = () => {
  const form = useValidatedForm(joinTripSchema);
  const [currentStep, setCurrentStep] = useState<Step>(Step.DESTINATION_PICK);
  const [results, setResults] = useState<TripPlan[]>([]);

  // only execute search in step 3
  const {trigger: doSearch, isLoading: isSearching} = useMutation<TripPlan[], JoinTripSchemaType>(searchTrips);

  const goNext = useCallback(() => setCurrentStep(s => s + 1), []);
  const goBack = useCallback(() => setCurrentStep(s => Math.max(s - 1, Step.DESTINATION_PICK)), []);

  // Step 2 “Next”: just advance into MatchFiltersStep
  const onLogisticContinue = useCallback(() => {
    goNext();
  }, [goNext]);

  // Step 3 “Next”: validate ALL filters, then call searchTrips
  const onSearch = async (data: JoinTripSchemaType) => {
    try {
      const found = await doSearch(data);
      setResults(found);
      setCurrentStep(Step.RESULTS);
    } catch {
      toast.error('Search failed — please try again.');
    }
  };
  const onMatchContinue = form.handleSubmit(onSearch);

  // Map each wizard step to its component
  const steps: Record<Step, ReactNode> = {
    [Step.DESTINATION_PICK]: <DestinationStep onContinue={goNext} />,

    [Step.SEARCH_FILTERS]: <LogisticFiltersStep onSubmit={onLogisticContinue} onReturn={goBack} />,

    [Step.MATCH_FILTERS]: <MatchFiltersStep onContinue={onMatchContinue} onReturn={goBack} />,

    [Step.RESULTS]: <SearchResultsStep results={results} onReturn={goBack} />,
  };

  return <FormProvider {...form}>{steps[currentStep]}</FormProvider>;
};

export default JoinTripForm;
