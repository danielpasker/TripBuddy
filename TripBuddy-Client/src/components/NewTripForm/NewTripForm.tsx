import {FC, ReactNode, useCallback, useState} from 'react';
import {FormProvider} from 'react-hook-form';
import {toast} from 'react-toastify';
import {DestinationStep} from '@components/NewTripForm/DestinationStep';
import {DetailsStep} from '@components/NewTripForm/DetailsStep';
import {TripPlanStep} from '@components/NewTripForm/TripPlanStep';
import {TripPlan} from '@customTypes/TripPlan';
import {useMutation} from '@hooks/useMutation';
import {useValidatedForm} from '@hooks/useValidatedSchema';
import {planTrip} from '@services/tripPlanApi';
import {TripPlanSchemaType, tripPlanSchema} from './form';

enum Step {
  DESTINATION_PICK,
  TRIP_DETAILS,
  TRIP_PLAN,
}

const NewTripForm: FC = () => {
  const form = useValidatedForm(tripPlanSchema);

  const [currentStep, setCurrentStep] = useState<Step>(Step.DESTINATION_PICK);
  const [tripPlan, setTripPlan] = useState<TripPlan>();
  const {trigger: planNewTrip, isLoading: isPlanningTrip} = useMutation(planTrip);

  const onStepContinue = useCallback(() => {
    setCurrentStep(prevState => prevState + 1);
  }, [setCurrentStep]);

  const onStepReturn = useCallback(() => {
    setCurrentStep(prevState => (prevState - 1 < 0 ? 0 : prevState - 1));
  }, [setCurrentStep]);

  const onPlanTrip = async (planRequest: TripPlanSchemaType) => {
    if (form.formState.isValid) {
      try {
        const newPlan = await planNewTrip(planRequest);
        toast.success('Planning successful! Your trip plan is ready');

        setTripPlan(newPlan);
        setCurrentStep(Step.TRIP_PLAN);
      } catch {
        toast.error("We couldn't create a plan for your trip");
      }
    }
  };

  const stepComponents: Record<Step, ReactNode> = {
    [Step.DESTINATION_PICK]: <DestinationStep onContinue={onStepContinue} />,
    [Step.TRIP_DETAILS]: (
      <DetailsStep isPlanningTrip={isPlanningTrip} onSubmit={form.handleSubmit(onPlanTrip)} onReturn={onStepReturn} />
    ),
    [Step.TRIP_PLAN]: <TripPlanStep tripPlan={tripPlan} />,
  };

  return <FormProvider {...form}>{stepComponents[currentStep]}</FormProvider>;
};

export {NewTripForm};
