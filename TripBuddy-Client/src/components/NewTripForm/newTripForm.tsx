import {FC, ReactNode, useState} from 'react';
import {TripPlan, TripPlanRequest} from '@customTypes/TripPlan';
import {useMutation} from '@hooks/useMutation';
import {planTrip} from '@services/tripPlanApi';
import {toast} from 'react-toastify';
import {TripPlanStep} from '@components/NewTripForm/TripPlanStep';
import {DestinationStep} from '@components/NewTripForm/DestinationStep';
import {DetailsStep} from '@components/NewTripForm/DetailsStep';

enum Step {
  DESTINATION_PICK,
  TRIP_DETAILS,
  TRIP_PLAN
}

const NewTripForm: FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.DESTINATION_PICK);
  const [tripPlan, setTripPlan] = useState<TripPlan>();
  const {trigger: planNewTrip, isLoading: isPlanningTrip} = useMutation(planTrip);

  const onStepContinue = () => {
    setCurrentStep(prevState => prevState + 1);
  };

  const onPlanTrip = async (planRequest: TripPlanRequest) => {
    try {
      const newPlan = await planNewTrip(planRequest);
      toast.success('Planning successful! Your trip plan is ready');

      setTripPlan(newPlan);
      setCurrentStep(Step.TRIP_PLAN);
    } catch (e) {
      toast.error('We couldn\'t create a plan for your trip');
    }
  };

  /* TODO:
      * wrap in a form and add validation
      * make sure the fields in the step update the form state
      * in DetailsStep: replace onStepContinue with onSubmit that will get the form value and call onPlanTrip
  */

  const stepComponents: Record<Step, ReactNode> = {
    [Step.DESTINATION_PICK]: <DestinationStep onContinue={onStepContinue} />,
    [Step.TRIP_DETAILS]: <DetailsStep onSubmit={onStepContinue} isPlanningTrip={isPlanningTrip} />,
    [Step.TRIP_PLAN]: <TripPlanStep tripPlan={tripPlan} />,
  };

  return stepComponents[currentStep];
};

export {NewTripForm};
