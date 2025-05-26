import {FC, ReactNode, useCallback, useState} from 'react';
import {FormProvider} from 'react-hook-form';
import {toast} from 'react-toastify';
import {AdvancedFiltersStep} from '@components/JoinTripForm/AdvancedFiltersStep/AdvancedFiltersStep';
import {BasicFiltersStep} from '@components/JoinTripForm/BasicFiltersStep/BasicFiltersStep';
import {MatchmakingResultsStep} from '@components/JoinTripForm/SearchResultsStep/MatchmakingResultsStep';
import {DestinationStep} from '@components/NewTripForm/DestinationStep';
import {Trip} from '@customTypes/Trip';
import {useMutation} from '@hooks/useMutation';
import {useValidatedForm} from '@hooks/useValidatedSchema';
import {getMatches} from '@services/tripsApi';
import {JoinTripSchemaType, joinTripSchema} from './form';

enum Step {
  DESTINATION_PICK,
  BASIC_FILTERS,
  ADVANCED_FILTERS,
  MATCHMAKING_RESULTS,
}

const JoinTripForm: FC = () => {
  const form = useValidatedForm(joinTripSchema);
  const [step, setStep] = useState<Step>(Step.DESTINATION_PICK);
  const [results, setResults] = useState<Trip[]>([]);
  const {trigger, isLoading: isResultsLoading} = useMutation(getMatches);
  const onContinue = useCallback(() => setStep(step => step + 1), []);
  const onReturn = useCallback(() => setStep(step => Math.max(step - 1, Step.DESTINATION_PICK)), []);

  const onSearch = async (filters: JoinTripSchemaType) => {
    toast.success('Filters submitted!');

    const results = await trigger({
      ...filters,
      dietaryPreferences: filters.dietaryPreferences as string[],
      gender: filters.gender as string[],
    });
    setResults(results);
    setStep(Step.MATCHMAKING_RESULTS);
  };

  const steps: Record<Step, ReactNode> = {
    [Step.DESTINATION_PICK]: <DestinationStep onContinue={onContinue} />,
    [Step.BASIC_FILTERS]: <BasicFiltersStep onContinue={onContinue} onReturn={onReturn} />,
    [Step.ADVANCED_FILTERS]: (
      <AdvancedFiltersStep
        isSearching={isResultsLoading}
        onContinue={form.handleSubmit(onSearch)}
        onReturn={onReturn}
      />
    ),
    [Step.MATCHMAKING_RESULTS]: <MatchmakingResultsStep results={results} onReturn={onReturn} />,
  };

  // TODO: remove the button
  return <FormProvider {...form}>{steps[step]}</FormProvider>;
};

export default JoinTripForm;
