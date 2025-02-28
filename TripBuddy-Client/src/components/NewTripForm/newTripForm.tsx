import {FC, ReactNode, useCallback, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {toast} from 'react-toastify';
import {DestinationStep} from '@components/NewTripForm/DestinationStep';
import {DetailsStep} from '@components/NewTripForm/DetailsStep';
import {TripPlanStep} from '@components/NewTripForm/TripPlanStep';
import {TripPlan, TripPlanRequest} from '@customTypes/TripPlan';
import {useMutation} from '@hooks/useMutation';
import {planTrip} from '@services/tripPlanApi';

enum Step {
  DESTINATION_PICK,
  TRIP_DETAILS,
  TRIP_PLAN,
}

type CreateNewTripForm = Partial<TripPlanRequest>;

const NewTripForm: FC = () => {
  const form = useForm<CreateNewTripForm>();

  const [currentStep, setCurrentStep] = useState<Step>(Step.DESTINATION_PICK);
  const [tripPlan, setTripPlan] = useState<TripPlan>();
  const {trigger: planNewTrip, isLoading: isPlanningTrip} = useMutation(planTrip);

  const onStepContinue = useCallback(() => {
    setCurrentStep(prevState => prevState + 1);
  }, [setCurrentStep]);

  const onStepReturn = useCallback(() => {
    setCurrentStep(prevState => (prevState - 1 < 0 ? 0 : prevState - 1));
  }, [setCurrentStep]);

  // TODO: remove this console.log
  console.log('form values', form.watch());

  const onPlanTrip = async (planRequest: CreateNewTripForm) => {
    // TODO: remove this example after form is working
    const examplePlanRequest: TripPlanRequest = {
      location: 'Paris',
      days: 2,
      budget: 1000,
      participants: 1,
      type: 'chill',
    };

    if (form.formState.isValid || examplePlanRequest) {
      try {
        // TODO: replace examplePlanRequest with planRequest
        const newPlan = await planNewTrip(examplePlanRequest);
        toast.success('Planning successful! Your trip plan is ready');

        setTripPlan(newPlan);
        setCurrentStep(Step.TRIP_PLAN);
      } catch (e) {
        toast.error("We couldn't create a plan for your trip");
      }
    }
  };

  /* TODO:
   * add validation to form (rony)
   * make sure the fields in the step update the form state
   */

  const stepComponents: Record<Step, ReactNode> = {
    [Step.DESTINATION_PICK]: <DestinationStep onContinue={onStepContinue} />,
    [Step.TRIP_DETAILS]: (
      <DetailsStep isPlanningTrip={isPlanningTrip} onSubmit={form.handleSubmit(onPlanTrip)} onReturn={onStepReturn} />
    ),
    [Step.TRIP_PLAN]: <TripPlanStep tripPlan={tripPlan} />,
  };

  return <FormProvider {...form}>{stepComponents[currentStep]}</FormProvider>;
};

export type {CreateNewTripForm};
export {NewTripForm};
